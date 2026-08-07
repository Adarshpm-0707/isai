import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, ShieldCheck, Award, Truck, Star, ShoppingBag, Flower2 } from "lucide-react";
import useProducts from "../hooks/useProducts";
import { getProductImage } from "../utils/productHelpers";
import HeroSection from "../components/layout/HeroSection";

/* ── Onam Kerala Categories ── */
const KERALA_CATEGORIES = [
  { name: "KASAVU SAREES", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300" },
  { name: "SET MUNDU", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=300" },
  { name: "GOLDEN BORDER", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300" },
  { name: "HANDLOOMS", img: "https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=300" },
  { name: "FESTIVE SILKS", img: "https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=300" },
];

const ONAM_COLLECTIONS = [
  { title: "BALARAMAPURAM KASAVU", subtitle: "Pure Golden Zari Handloom", query: "Kasavu", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" },
  { title: "TEMPLE MAROON SILKS", subtitle: "Royal Festive Drapery", query: "Silk", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800" },
  { title: "KUCHI HAND-WORKED WEAVES", subtitle: "Traditional Heritage Art", query: "Traditional", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800" },
  { title: "TISSUE KASAVU SAREES", subtitle: "Lustrous Festive Sheen", query: "Tissue", img: "https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=800" },
];

const ONAM_FEATURES = [
  { icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />, title: "PURE KASAVU", sub: "Authentic Kerala Zari" },
  { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />, title: "HANDLOOM MARK", sub: "Master Weaver Certified" },
  { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />, title: "ETHICAL WEAVING", sub: "100% Artisan Supported" },
  { icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />, title: "EXPRESS ONAM DELIVERY", sub: "Worldwide Shipping" },
];

const REVIEWS = [
  { quote: "The Kasavu saree was breathtaking for Onam celebrations! True Kerala craftsmanship.", author: "Lakshmi Nair", location: "Kochi", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  { quote: "Authentic Balaramapuram tissue kasavu. The gold zari lustre is top class.", author: "Devika Menon", location: "Trivandrum", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" },
  { quote: "Prompt delivery before Thiruvonam. Beautiful collection and premium quality!", author: "Anjali Pillai", location: "Bengaluru", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
];

/* ── Onam SVG Flower decorators ── */
function SectionFlower({ size = 30, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={i} transform={`rotate(${a},30,30)`}>
          <ellipse cx="30" cy="10" rx="5" ry="12" fill={i % 2 === 0 ? "#FF6B35" : "#FFD54F"} opacity="0.88" />
        </g>
      ))}
      <circle cx="30" cy="30" r="9" fill="#FF8F00" />
      <circle cx="30" cy="30" r="5.5" fill="#FFD54F" />
      <circle cx="30" cy="30" r="2.5" fill="white" opacity="0.75" />
    </svg>
  );
}

function FlowerDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5 my-2">
      <div className="flex-1 h-px max-w-xs" style={{ background: "linear-gradient(to right,transparent,#D4AF37)" }} />
      <SectionFlower size={14} />
      <SectionFlower size={22} />
      <SectionFlower size={14} />
      <div className="flex-1 h-px max-w-xs" style={{ background: "linear-gradient(to left,transparent,#D4AF37)" }} />
    </div>
  );
}

function PookklamGarland({ count = 20 }) {
  const colors = [["#FF6B35", "#FFD54F"], ["#FFD54F", "#FF8F00"], ["#FF8F00", "#FF6B35"], ["#E65100", "#FFA000"], ["#FFA000", "#FFD54F"]];
  return (
    <div className="flex items-center justify-center gap-0.5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const [c1, c2] = colors[i % 5];
        const sz = [10, 14, 18, 14][i % 4];
        return (
          <motion.span key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.8, delay: i * 0.07, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-block" }}
          >
            <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
              {[0, 60, 120, 180, 240, 300].map((a, j) => (
                <g key={j} transform={`rotate(${a},20,20)`}>
                  <ellipse cx="20" cy="7" rx="4" ry="10" fill={j % 2 === 0 ? c1 : c2} opacity="0.9" />
                </g>
              ))}
              <circle cx="20" cy="20" r="6" fill="#FFA000" />
              <circle cx="20" cy="20" r="3.5" fill="#FFD54F" />
            </svg>
          </motion.span>
        );
      })}
    </div>
  );
}

/* ── SECTION HEADING ── */
function SectionHeading({ malayalam, english }) {
  return (
    <div className="text-center space-y-1.5 mb-8">
      <div className="flex items-center justify-center gap-2">
        <SectionFlower size={16} />
        <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">{malayalam}</span>
        <SectionFlower size={16} />
      </div>
      <h2 className="font-serif text-xl sm:text-3xl font-bold tracking-wide uppercase"
        style={{
          background: "linear-gradient(135deg,#0C2317,#1A3C2B)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {english}
      </h2>
      <FlowerDivider />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProducts();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(180deg,#FFFDF5 0%,#FFF9EC 50%,#FFFDF5 100%)", color: "#1B3022" }}>

      {/* 1. HERO */}
      <HeroSection />



      {/* 2. POOKKALAM CATEGORY CIRCLES */}
      <section className="py-10 sm:py-14 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#FFFDF5,#FFF8E7,#FFFDF5)" }}>
        {/* Top flower border */}
        <div className="w-full mb-6">

          <div className="h-px w-full mt-1" style={{ background: "linear-gradient(90deg,transparent,#D4AF37 30%,#FFD54F 50%,#D4AF37 70%,transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading malayalam="ONAM CELEBRATIONS" english="KERALA HERITAGE CATEGORIES" />
          <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 scrollbar-none px-2">
            {KERALA_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.07, y: -4 }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center cursor-pointer shrink-0 group"
              >
                {/* Gold ring frame */}
                <div className="relative p-1.5 rounded-full shadow-md group-hover:shadow-xl transition-all"
                  style={{ background: "linear-gradient(135deg,#D4AF37,#FFF5C0,#B8860B,#FFD54F)" }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#0C2317]">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <span className="mt-3 text-[10px] sm:text-xs font-bold tracking-wider text-[#0C2317] group-hover:text-[#B8860B] transition-colors text-center">
                  {cat.name}
                </span>
                <span className="text-[9px] text-[#B8860B] font-medium">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom flower border */}
        <div className="w-full mt-6">
          <div className="h-px w-full mb-1" style={{ background: "linear-gradient(90deg,transparent,#D4AF37 30%,#FFD54F 50%,#D4AF37 70%,transparent)" }} />

        </div>
      </section>

      {/* 3. ONAM SPECIAL WEAVES GRID */}
      <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-4 border-b pb-3" style={{ borderColor: "rgba(212,175,55,0.35)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SectionFlower size={18} />
              <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">HERITAGE HANDLOOM</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-wide uppercase font-bold"
              style={{ background: "linear-gradient(135deg,#0C2317,#1A3C2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ONAM SPECIAL WEAVES
            </h2>
          </div>
          <button onClick={() => navigate("/products")}
            className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B8860B] hover:text-[#0C2317] hover:underline uppercase transition-colors flex items-center gap-1">
            <SectionFlower size={14} /> EXPLORE ALL &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {ONAM_COLLECTIONS.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => navigate(`/products?search=${encodeURIComponent(item.query)}`)}
              className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-lg"
              style={{ border: "1.5px solid rgba(212,175,55,0.35)" }}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2317]/92 via-[#0C2317]/30 to-transparent flex flex-col justify-end p-3 sm:p-5">
                <span className="text-[8px] sm:text-[10px] text-[#F3E5AB] font-bold tracking-widest uppercase mb-1">{item.subtitle}</span>
                <h3 className="font-serif text-sm sm:text-lg font-bold text-white tracking-wide uppercase leading-snug">{item.title}</h3>
                <span className="text-[9px] sm:text-[11px] text-[#D4AF37] tracking-widest uppercase mt-2 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  SHOP COLLECTION &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. KASAVU TRUST BADGES */}
      <section className="text-[#F3E5AB] py-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)", borderTop: "2px solid #D4AF37", borderBottom: "2px solid #D4AF37" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10 py-4">
          {ONAM_FEATURES.map((feat, idx) => (
            <motion.div key={idx} whileHover={{ y: -4, scale: 1.04 }} className="flex flex-col items-center justify-center space-y-2 p-2">
              <div className="relative p-2.5 rounded-full border border-[#D4AF37]/40" style={{ background: "rgba(26,60,43,0.8)" }}>
                {feat.icon}
              </div>
              <h4 className="font-serif text-xs sm:text-sm tracking-widest font-bold text-[#F3E5AB]">{feat.title}</h4>
              <p className="text-[9px] sm:text-xs text-[#EADFC9]/80 font-light">{feat.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SAREES */}
      <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-4 border-b pb-3" style={{ borderColor: "rgba(212,175,55,0.35)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">MASTER WEAVER SAREES</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-wide uppercase font-bold"
              style={{ background: "linear-gradient(135deg,#0C2317,#1A3C2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              FEATURED KERALA SAREES
            </h2>
          </div>
          <button onClick={() => navigate("/products")}
            className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B8860B] hover:text-[#0C2317] hover:underline uppercase transition-colors flex items-center gap-1">
            VIEW ALL ({products.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -6 }}
              className="rounded-xl overflow-hidden border shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              style={{ background: "white", borderColor: "rgba(212,175,55,0.3)" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}>
                <img
                  src={getProductImage(product)}
                  alt={product.name || "Kasavu Saree"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"; }}
                />
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#0C2317] hover:text-red-600 transition-colors shadow-sm"
                >
                  <Heart size={14} />
                </button>
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[#F3E5AB] text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-full border border-[#D4AF37]"
                  style={{ background: "#0C2317" }}>
                  {product.category || "Kerala Kasavu"}
                </span>
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                <h3 onClick={() => navigate(`/product/${product.id}`)}
                  className="font-serif text-xs sm:text-sm text-[#0C2317] font-bold truncate cursor-pointer hover:text-[#B8860B] transition-colors">
                  {product.name || "Traditional Kerala Saree"}
                </h3>
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "#EADFC9" }}>
                  <p className="text-xs sm:text-sm font-bold text-[#B8860B]">
                    &#8377;{product.price ? product.price.toLocaleString("en-IN") : "4,999"}
                  </p>
                  <button onClick={() => navigate(`/product/${product.id}`)}
                    className="p-1.5 rounded-md text-[#F3E5AB] hover:bg-[#B8860B] transition-colors"
                    style={{ background: "#0C2317" }}>
                    <ShoppingBag size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. ONAM STORYTELLING BANNER */}
      <section className="px-4 max-w-7xl mx-auto pb-12 sm:pb-16">
        <div className="relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-center shadow-2xl"
          style={{ background: "linear-gradient(135deg,#0C2317,#1A3C2B)", border: "2px solid #D4AF37" }}>
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
            alt="Onam Tradition" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />

          <div className="relative z-10 p-6 sm:p-14 max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase">
                ഓണസന്ദേശം &bull; CELEBRATING TRADITION
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase leading-tight"
              style={{ color: "#F3E5AB", textShadow: "0 2px 12px rgba(212,175,55,0.3)" }}>
              WEAVING KERALA&apos;S<br />HERITAGE IN GOLD
            </h3>
            <p className="text-xs sm:text-sm text-[#EADFC9] font-light leading-relaxed">
              Every Kasavu thread holds decades of handloom art straight from master weavers in Balaramapuram and Chendamangalam.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 font-bold rounded-md text-[10px] sm:text-xs tracking-widest uppercase hover:shadow-lg transition-all"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 20px rgba(212,175,55,0.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
            >
              DISCOVER ONAM VAULT &rarr;
            </button>
          </div>
        </div>
      </section>



    </div>
  );
}
