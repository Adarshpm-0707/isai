import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { items, shipping_address, coupon_id } = await req.json();
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      if (user) userId = user.id;
    }

    if (!items || items.length === 0) {
      throw new Error("Cart items are required");
    }

    const productIds = items.map((i: any) => i.product_id);
    const { data: dbProducts, error: prodErr } = await supabaseClient
      .from("products")
      .select("id, name, price, discount_price, stock")
      .in("id", productIds);

    if (prodErr || !dbProducts) {
      throw new Error("Error fetching products from database");
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.product_id);
      if (!prod) throw new Error(`Product ${item.product_id} not found`);
      if (prod.stock < item.qty) {
        throw new Error(`Insufficient stock for ${prod.name}`);
      }
      const unitPrice = prod.discount_price ?? prod.price;
      subtotal += Number(unitPrice) * item.qty;
      validatedItems.push({
        product_id: prod.id,
        name: prod.name,
        qty: item.qty,
        size: item.size || null,
        price: unitPrice,
      });
    }

    let discountAmount = 0;
    if (coupon_id) {
      const { data: coupon } = await supabaseClient
        .from("coupons")
        .select("*")
        .eq("id", coupon_id)
        .eq("is_active", true)
        .single();

      if (coupon) {
        if (coupon.type === "percentage") {
          discountAmount = (subtotal * coupon.value) / 100;
        } else {
          discountAmount = Number(coupon.value);
        }
      }
    }

    const shippingFee = subtotal > 1000 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_dummy";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "secret_dummy";

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    const rzpData = await rzpRes.json();
    if (!rzpRes.ok) {
      throw new Error(rzpData.error?.description || "Failed to create Razorpay order");
    }

    const { data: dbOrder, error: orderErr } = await supabaseClient
      .from("orders")
      .insert({
        user_id: userId,
        items: validatedItems,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        total: totalAmount,
        payment_method: "prepaid",
        status: "pending",
        shipping_address,
        coupon_id: coupon_id || null,
        razorpay_order_id: rzpData.id,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    return new Response(
      JSON.stringify({
        order_id: rzpData.id,
        amount: amountInPaise,
        key_id: razorpayKeyId,
        db_order_id: dbOrder.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
