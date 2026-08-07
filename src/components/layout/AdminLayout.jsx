import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Package,
  FolderTree,
  Tag,
  Users,
  CreditCard,
  FileText,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
import logoImg from "../../assets/ISAI (2).png";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Admin Profile", path: "/admin/profile", icon: User },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Orders Management", path: "/admin/orders", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: FolderTree },
    { name: "Coupons & Offers", path: "/admin/coupons", icon: Tag },
    { name: "Admin Team", path: "/admin/admins", icon: UserCheck },
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
    <div className="min-h-screen bg-[#081A11] flex text-[#F3E5AB] font-sans">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-30 bg-[#0C2317] border-r border-[#D4AF37]/35 shadow-2xl">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#D4AF37]/35 bg-[#081A11]/80 shrink-0">
          <img src={logoImg} alt="Isai Logo" className="h-9 w-auto object-contain" />
          <div>
            <h2 className="font-serif text-xs font-extrabold text-[#F3E5AB] uppercase tracking-wider leading-none">
              ISAI TARANG
            </h2>
            <span className="text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-1 mt-1">
              <Shield className="w-2.5 h-2.5 text-[#D4AF37]" /> Admin Panel
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#1A3C2B] to-[#0F2A1C] text-[#F3E5AB] border-l-4 border-[#D4AF37] shadow-xl"
                    : "text-[#EADFC9]/75 hover:bg-[#153424] hover:text-[#F3E5AB]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#FFD54F]" : "text-[#D4AF37]/70"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Quick Links */}
        <div className="p-4 border-t border-[#D4AF37]/25 space-y-2 bg-[#081A11]/60 text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded text-[#EADFC9] hover:bg-[#1A3C2B] hover:text-[#F3E5AB] font-semibold transition-colors"
          >
            <span>Live Store Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded text-red-400 hover:bg-red-950/60 hover:text-red-300 font-bold transition-colors cursor-pointer"
          >
            <span>Sign Out Admin</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#0C2317] border-r border-[#D4AF37]/40 flex flex-col z-50">
            <div className="p-4 flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xs uppercase text-[#F3E5AB]">Admin Panel</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[#F3E5AB] hover:bg-[#1A3C2B] rounded"
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      active
                        ? "bg-[#1A3C2B] text-[#F3E5AB] border-l-4 border-[#D4AF37]"
                        : "text-[#EADFC9] hover:bg-[#153424]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#D4AF37]/25 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold rounded"
              >
                View Live Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-bold rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT WRAPPER ─── */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0C2317]/95 border-b border-[#D4AF37]/35 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#F3E5AB] hover:bg-[#1A3C2B] border border-[#D4AF37]/30"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#F3E5AB] font-serif">
              {navigationItems.find((i) => isActive(i.path))?.name || "Admin Management"}
            </h1>
          </div>

          <div
            onClick={() => navigate("/admin/profile")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
            title="View Admin Profile"
          >
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-[#F3E5AB]">
                {profile?.name || user?.email || "System Admin"}
              </span>
              <span className="block text-[10px] text-[#D4AF37] uppercase tracking-widest">
                System Admin Profile
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1A3C2B] border border-[#D4AF37] flex items-center justify-center text-[#F3E5AB] font-bold text-xs uppercase shadow-md">
              {(profile?.name || user?.email || "A")[0]}
            </div>
          </div>
        </header>

        {/* Render Page Children */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#081A11]">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
