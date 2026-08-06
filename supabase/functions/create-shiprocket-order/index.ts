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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { order_id } = await req.json();

    const { data: order, error: orderErr } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) throw new Error("Order not found");

    const email = Deno.env.get("SHIPROCKET_EMAIL");
    const password = Deno.env.get("SHIPROCKET_PASSWORD");

    let token = "";
    if (email && password) {
      const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const authData = await authRes.json();
      token = authData.token || "";
    }

    const addr = order.shipping_address || {};
    const shiprocketPayload = {
      order_id: order.id,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: "Primary",
      billing_customer_name: addr.name || "Customer",
      billing_last_name: "",
      billing_address: addr.street || addr.address || "Main St",
      billing_city: addr.city || "Chennai",
      billing_pincode: addr.pincode || "600001",
      billing_state: addr.state || "Tamil Nadu",
      billing_country: "India",
      billing_email: addr.email || "customer@example.com",
      billing_phone: addr.phone || "9999999999",
      shipping_is_billing: true,
      order_items: (order.items || []).map((item: any) => ({
        name: item.name || "Product",
        sku: item.product_id,
        units: item.qty,
        selling_price: item.price,
      })),
      payment_method: order.payment_method === "cod" ? "COD" : "Prepaid",
      sub_total: order.total,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    let shiprocketOrderId = `SR_MOCK_${Date.now()}`;
    let shipmentId = `SH_MOCK_${Date.now()}`;

    if (token) {
      const srRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shiprocketPayload),
      });
      const srData = await srRes.json();
      if (srData.order_id) {
        shiprocketOrderId = String(srData.order_id);
        shipmentId = String(srData.shipment_id || "");
      }
    }

    await supabaseClient
      .from("orders")
      .update({
        shiprocket_order_id: shiprocketOrderId,
        shiprocket_shipment_id: shipmentId,
        status: order.payment_method === "cod" ? "confirmed" : "processing",
      })
      .eq("id", order_id);

    return new Response(
      JSON.stringify({
        success: true,
        shiprocket_order_id: shiprocketOrderId,
        shipment_id: shipmentId,
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
