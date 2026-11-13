import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  User,
  Boxes,
  TrendingUp,
} from "lucide-react";
import logoImg from "../../assets/isai_logo.png";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const navigationItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Admin Profile", path: "/admin/profile", icon: User },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Orders Management", path: "/admin/orders", icon: Package },
    { name: "Inventory & Stock", path: "/admin/inventory", icon: Boxes },
    { name: "Profit & Loss", path: "/admin/profit-loss", icon: TrendingUp },
    { name: "Categories", path: "/admin/categories", icon: FolderTree },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#090B10] flex text-[#F5E6BE] font-sans antialiased">
      
      {/* ─── DESKTOP SIDEBAR (Visible on laptop/desktop: lg and up) ─── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed inset-y-0 z-30 bg-[#0D1017] border-r border-[#D4AF37]/20 shadow-2xl">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#D4AF37]/20 bg-[#090B10] shrink-0">
          <img src={logoImg} alt="Isaitarang Logo" className="h-9 w-auto object-contain" />
          <div className="min-w-0">
            <h2 className="font-sans text-xs font-bold text-[#FFFFFF] uppercase tracking-wider leading-none truncate">
              Isaitarang
            </h2>
            <span className="text-[9px] font-semibold text-[#DFC18A] tracking-widest uppercase flex items-center gap-1 mt-1">
              <Shield className="w-2.5 h-2.5 text-[#DFC18A] shrink-0" /> Admin Panel
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-[#0F131C] text-[#DFC18A] border-l-4 border-[#D4AF37] shadow-lg"
                    : "text-[#C7B5A7] hover:bg-[#0F131C]/70 hover:text-[#FFFFFF]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#D4AF37]" : "text-[#DFC18A]/60"}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Quick Links */}
        <div className="p-3.5 border-t border-[#D4AF37]/20 space-y-1.5 bg-[#090B10] text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[#C7B5A7] hover:bg-[#0F131C] hover:text-[#DFC18A] font-medium transition-colors"
          >
            <span>Live Store Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#DFC18A]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 font-medium transition-colors cursor-pointer"
          >
            <span>Sign Out Admin</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ─── MOBILE & TABLET DRAWER OVERLAY (Screen width < 1024px) ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs sm:max-w-sm w-full bg-[#0D1017] border-r border-[#D4AF37]/25 flex flex-col z-50 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#090B10]">
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="Logo" className="h-8 w-auto object-contain" />
                <div>
                  <span className="font-bold text-xs uppercase text-[#FFFFFF] block leading-none">Isaitarang</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#DFC18A] font-semibold">Admin Panel</span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-[#C7B5A7] hover:text-[#FFFFFF] rounded-lg hover:bg-[#161B26] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? "bg-[#0F131C] text-[#DFC18A] border-l-4 border-[#D4AF37] shadow-md"
                        : "text-[#C7B5A7] hover:bg-[#0F131C]/70 hover:text-[#FFFFFF]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#DFC18A] shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#D4AF37]/20 space-y-2 bg-[#090B10]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 border border-[#D4AF37]/35 bg-[#0F131C] hover:bg-[#161B26] text-[#DFC18A] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Live Store Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT WRAPPER ─── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0D1017]/95 border-b border-[#D4AF37]/20 sticky top-0 z-20 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#DFC18A] hover:bg-[#0F131C] border border-[#D4AF37]/30 transition-colors shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-[#FFFFFF] font-sans truncate">
              {navigationItems.find((i) => isActive(i.path))?.name || "Admin Management"}
            </h1>
          </div>

          <div
            onClick={() => navigate("/admin/profile")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-85 transition-opacity shrink-0"
            title="View Admin Profile"
          >
            <div className="text-right hidden sm:block max-w-[160px] md:max-w-[220px]">
              <span className="block text-xs font-medium text-[#FFFFFF] truncate">
                {profile?.name || user?.email || "System Admin"}
              </span>
              <span className="block text-[9px] text-[#DFC18A] uppercase tracking-widest font-semibold truncate">
                Admin Profile
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0F131C] border border-[#D4AF37] flex items-center justify-center text-[#DFC18A] font-bold text-xs uppercase shadow-md shrink-0">
              {(profile?.name || user?.email || "A")[0]}
            </div>
          </div>
        </header>

        {/* Render Page Children */}
        <main ref={mainRef} className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto bg-[#090B10] text-[#F5E6BE] font-sans">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
