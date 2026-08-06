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
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabaseClient.auth.getUser(token);
    if (userErr || !user) throw new Error("Unauthorized");

    const { order_id } = await req.json();

    const { data: order, error: orderErr } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) throw new Error("Order not found");

    // Check if admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    if (order.user_id !== user.id && !isAdmin) {
      throw new Error("Forbidden: Not your order");
    }

    const cancelableStatuses = ["pending", "paid", "confirmed"];
    if (!cancelableStatuses.includes(order.status)) {
      throw new Error(`Cannot cancel order in state: ${order.status}`);
    }

    // Update status to cancelled
    await supabaseClient
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    // Re-increment stock
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const { data: prod } = await supabaseClient
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();
        if (prod) {
          await supabaseClient
            .from("products")
            .update({ stock: prod.stock + (item.qty || 1) })
            .eq("id", item.product_id);
        }
      }
    }

    // Call Shiprocket cancel API if shiprocket_order_id exists
    if (order.shiprocket_order_id && !order.shiprocket_order_id.startsWith("SR_MOCK_")) {
      const email = Deno.env.get("SHIPROCKET_EMAIL");
      const password = Deno.env.get("SHIPROCKET_PASSWORD");
      if (email && password) {
        const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const authData = await authRes.json();
        if (authData.token) {
          await fetch("https://apiv2.shiprocket.in/v1/external/orders/cancel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
            body: JSON.stringify({ ids: [order.shiprocket_order_id] }),
          }).catch(() => {});
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order cancelled successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
