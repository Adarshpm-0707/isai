import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function RevenueVelocityChart({ revenueChartData }) {
  return (
    <div className="lg:col-span-2 animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#FFFFFF]">
                7-Day Revenue & Sales Velocity
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Daily gross collection and orders placed over the last 7 calendar days
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-wider">
            Live Sync
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="mt-6 pt-2">
          <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-[#D4AF37]/25">
            {revenueChartData.days.map((item) => {
              const heightPercent = Math.max(
                Math.round((item.revenue / revenueChartData.maxRev) * 100),
                item.revenue > 0 ? 10 : 3
              );

              return (
                <div
                  key={item.dateKey}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-bold text-[#FFFFFF] bg-[#090B10] border border-[#D4AF37]/50 rounded px-1.5 py-0.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    ₹{item.revenue.toLocaleString('en-IN')} ({item.ordersCount} orders)
                  </div>

                  {/* Animated Bar with Solid Gold Accents */}
                  <div className="w-full max-w-[42px] bg-[#161B26] rounded-t-lg relative flex items-end overflow-hidden border-t border-x border-[#D4AF37]/40 h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-[#D4AF37] group-hover:bg-[#E5C158] transition-all duration-500 animate-bar-grow rounded-t-md flex items-start justify-center pt-1"
                    >
                      {item.revenue > 0 && (
                        <span className="hidden sm:inline text-[9px] font-bold text-[#090B10]">
                          ₹{item.revenue > 999 ? `${Math.round(item.revenue / 1000)}k` : item.revenue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* X-axis Day Label */}
                  <span className="mt-2 text-[11px] font-bold text-[#D1D5DB] group-hover:text-[#FFFFFF] transition-colors">
                    {item.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#A1A1AA]">
          Peak Day Maximum:{' '}
          <strong className="text-[#FFFFFF]">
            ₹{revenueChartData.maxRev.toLocaleString('en-IN')}
          </strong>
        </span>
        <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
          <span>Calculated directly from verified customer orders</span>
        </span>
      </div>
    </div>
  );
}
