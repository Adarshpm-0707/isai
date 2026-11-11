import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Crown } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';

const TRUST_BADGES = [
  {
    icon: <LotusEmblem className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A]" />,
    title: 'Authentic Sarees',
    subtitle: '100% Handloom Guarantee',
  },
  {
    icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Pan India Delivery',
    subtitle: '4-5 Days Express Shipping',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Secure Payments',
    subtitle: 'GPay & Bank Transfer',
  },
  {
    icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Quality Assured',
    subtitle: 'Inspected by Master Weavers',
  },
  {
    icon: <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Royal Heritage',
    subtitle: 'Kerala • Kanchi • Banaras',
    desktopOnly: true,
  },
];

export default function HomeTrustBadges() {
  return (
    <section className="bg-gradient-to-r from-[#140C0A] via-[#1A100C] to-[#140C0A] border-y border-[#2B1B15] py-4 sm:py-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Laptop / Desktop View (5 Columns) */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-center">
          {TRUST_BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1C120E]/60 border border-[#301F18] hover:border-[#DFC18A]/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#241611] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:scale-105 group-hover:border-[#DFC18A] transition-all duration-300">
                {badge.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors truncate">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#A69385] truncate font-light mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet View (Horizontal Swipeable Ribbon) */}
        <div className="lg:hidden flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
          {TRUST_BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#1C120E]/80 border border-[#301F18] shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-[#241611] flex items-center justify-center text-[#DFC18A] shrink-0">
                {badge.icon}
              </div>
              <div className="whitespace-nowrap">
                <span className="text-[11px] font-medium text-[#FDF8F4] block leading-tight">
                  {badge.title}
                </span>
                <span className="text-[9px] text-[#DFC18A]/80 font-light block leading-tight">
                  {badge.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
