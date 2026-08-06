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
    const { to, order } = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Thank you for your order!</h2>
          <p>Order ID: <strong>${order?.id || "N/A"}</strong></p>
          <p>Total Amount: <strong>₹${order?.total || 0}</strong></p>
          <p>Status: <strong>${order?.status || "Confirmed"}</strong></p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Isai Store <orders@isai.com>",
          to: [to],
          subject: `Order Confirmation #${order?.id?.slice(0, 8)}`,
          html: emailHtml,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email triggered" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
