import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

export default function OrderFulfillmentChart({ donutChartData }) {
  let accumulated = 0;

  return (
    <div className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D4AF37]/20">
          <div className="p-2 rounded-lg bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans text-sm sm:text-base font-bold text-[#FFFFFF]">
              Order Fulfillment Split
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Distribution across all order statuses
            </p>
          </div>
        </div>

        {/* Donut Graphic Visualizer */}
        <div className="mt-5 flex items-center justify-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#161B26"
                strokeWidth="12"
                fill="transparent"
              />
              {donutChartData.slices.map((slice, i) => {
                if (slice.count === 0) return null;
                const circumference = 2 * Math.PI * 38;
                const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulated / 100) * circumference);
                accumulated += slice.pct;

                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="38"
                    stroke={slice.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 hover:opacity-80"
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-sans text-xl sm:text-2xl font-black text-[#FFFFFF]">
                {donutChartData.totalOrders}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                Orders
              </span>
            </div>
          </div>
        </div>

        {/* Legend with Full Names & Visible Text */}
        <div className="mt-5 space-y-2">
          {donutChartData.slices.map((slice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 border-b border-[#D4AF37]/10 last:border-none gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-[#FFFFFF] font-medium truncate">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0">
                <span className="text-[#A1A1AA]">{slice.count} units</span>
                <span className="font-bold text-[#D4AF37] w-8 text-right">
                  {slice.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

