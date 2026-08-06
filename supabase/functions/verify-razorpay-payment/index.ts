import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyHmac(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(`${orderId}|${paymentId}`);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hexHash === signature;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      db_order_id,
      coupon_id,
      user_id,
    } = await req.json();

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") || "secret_dummy";
    const isValid = await verifyHmac(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!isValid && secret !== "secret_dummy") {
      throw new Error("Invalid payment signature");
    }

    const { data: order, error: orderErr } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", db_order_id)
      .single();

    if (orderErr || !order) throw new Error("Order not found");

    await supabaseClient
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", db_order_id);

    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        await supabaseClient.rpc("decrement_product_stock", {
          p_id: item.product_id,
          p_qty: item.qty,
        }).catch(async () => {
          const { data: p } = await supabaseClient
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();
          if (p) {
            await supabaseClient
              .from("products")
              .update({ stock: Math.max(0, p.stock - item.qty) })
              .eq("id", item.product_id);
          }
        });
      }
    }

    if (coupon_id && user_id) {
      await supabaseClient.from("coupon_usage").insert({
        coupon_id,
        user_id,
        order_id: db_order_id,
      }).catch(() => {});

      await supabaseClient.rpc("increment_coupon_uses", { c_id: coupon_id }).catch(() => {});
    }

    return new Response(
      JSON.stringify({ success: true, order_id: db_order_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
