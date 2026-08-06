import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { delivery_postcode } = await req.json();
    if (!delivery_postcode || String(delivery_postcode).length !== 6) {
      throw new Error("Invalid 6-digit pincode");
    }

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

    if (token) {
      const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=600001&delivery_postcode=${delivery_postcode}&weight=0.5&cod=1`;
      const sRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sData = await sRes.json();
      if (sData.status === 200 && sData.data?.available_courier_companies?.length > 0) {
        const best = sData.data.available_courier_companies[0];
        return new Response(
          JSON.stringify({
            serviceable: true,
            courier_name: best.courier_name,
            etd: best.etd || "3-5 Business Days",
            rate: best.rate || 50,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        serviceable: true,
        courier_name: "Standard Express Delivery",
        etd: "3-5 Business Days",
        rate: 50,
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
