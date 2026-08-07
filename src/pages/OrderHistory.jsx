import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import EmptyState from "../components/reusable/EmptyState";
import Badge from "../components/reusable/Badge";
import { orderService } from "../services/orderService";
import { getProductImage } from "../utils/productHelpers";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine } from "../components/layout/OnamEffects";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try { const data = await orderService.getUserOrders(user.id); setOrders(data || []); }
    catch (err) { console.error("Failed to fetch orders:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try { await orderService.cancelOrder(orderId); alert("Order cancelled successfully."); await fetchOrders(); }
    catch (err) { alert(err.message || "Failed to cancel order"); }
    finally { setCancellingId(null); }
  };

  if (orders.length === 0 && !loading) {
    return <EmptyState title="No Orders Yet" message="You haven't ordered anything yet. Start exploring our Onam collections." actionText="Browse Collection" actionPath="/products" />;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 space-y-8"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 40%,#0C2317 100%)" }}>

      <div><GoldLine /></div>
      <div className="text-center space-y-1 my-4">
        <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase block">PAST PURCHASES</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-[#F3E5AB]">ORDER HISTORY</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order, idx) => {
          const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
          let badgeVariant = "warning";
          if (order.status === "shipped") badgeVariant = "gold";
          if (order.status === "delivered" || order.status === "paid") badgeVariant = "success";
          if (order.status === "cancelled" || order.status === "failed") badgeVariant = "danger";
          const isCancelable = ["pending", "paid", "confirmed"].includes(order.status);
          const items = Array.isArray(order.items) ? order.items : [];
          const addr = order.shipping_address || {};

          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{ border: "1.5px solid rgba(212,175,55,0.3)", background: "linear-gradient(135deg,rgba(26,60,43,0.92),rgba(12,35,23,0.96))" }}>

              {/* Header */}
              <div className="px-5 py-4 flex flex-wrap justify-between items-center gap-3 text-xs border-b" style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.05)" }}>
                <div className="flex flex-wrap gap-5">
                  {[
                    { label: "Order Placed", value: formattedDate },
                    { label: "Total", value: `&#8377;${Number(order.total || order.total_amount || 0).toLocaleString("en-IN")}` },
                    { label: "Payment", value: order.payment_method || "Prepaid" },
                  ].map((f, i) => (
                    <div key={i}>
                      <span className="block text-[#D4AF37]/60 uppercase font-bold tracking-wider mb-0.5 text-[9px] flex items-center gap-1">
                        <SectionFlower size={10} /> {f.label}
                      </span>
                      <span className="text-[#F3E5AB] font-medium" dangerouslySetInnerHTML={{ __html: f.value }} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Badge text={order.status} variant={badgeVariant} />
                  {isCancelable && (
                    <button onClick={() => handleCancel(order.id)} disabled={cancellingId === order.id}
                      className="text-xs text-red-400 hover:text-red-300 underline font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y px-5" style={{ divideColor: "rgba(212,175,55,0.1)" }}>
                {items.map((item, i) => (
                  <div key={i} className="py-3.5 flex gap-3 items-center border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                    <div className="w-10 aspect-[3/4] overflow-hidden flex-shrink-0 rounded-lg" style={{ background: "rgba(12,35,23,0.7)", border: "1px solid rgba(212,175,55,0.25)" }}>
                      <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-sm font-bold text-[#F3E5AB] truncate">{item.name}</h4>
                      {item.size && <p className="text-[10px] text-[#D4AF37]/60">Size: {item.size}</p>}
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-[#D4AF37] font-medium">{item.qty} &times; &#8377;{Number(item.price || 0).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 text-[11px] flex flex-wrap justify-between items-center gap-2"
                style={{ background: "rgba(12,35,23,0.4)", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
                <div className="flex items-center gap-1 text-[#EADFC9]/65">
                  <SectionFlower size={12} />
                  <strong>Deliver To:</strong>&nbsp;{addr.name || "Customer"} ({addr.city}, {addr.pincode})
                </div>
                {order.shiprocket_order_id && (
                  <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                    Tracking ID: {order.shiprocket_order_id}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div><GoldLine /><PookklamGarland count={26} /><GoldLine /></div>
    </div>
  );
}
