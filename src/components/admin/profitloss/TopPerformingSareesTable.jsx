import React from 'react';

export default function TopPerformingSareesTable({ topSarees }) {
  return (
    <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl font-sans">
      <div className="p-4 sm:p-5 border-b border-[#D4AF37]/25 flex items-center justify-between">
        <h4 className="font-sans text-sm sm:text-base font-bold text-[#FFFFFF] uppercase tracking-wider">
          Top Revenue Generating Sarees
        </h4>
        <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest">
          Sales Performance
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#0A0D14]">
              <th className="py-3 px-3 sm:px-5">Saree Name</th>
              <th className="py-3 px-2.5 sm:px-4">Category</th>
              <th className="py-3 px-2.5 sm:px-4 text-center">Units Sold</th>
              <th className="py-3 px-2.5 sm:px-4">Total Revenue</th>
              <th className="py-3 px-3 sm:px-4 text-right">Est. Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {topSarees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#A1A1AA] italic">
                  No individual saree sales recorded in this timeframe yet.
                </td>
              </tr>
            ) : (
              topSarees.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#161B26]/60 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-bold text-[#FFFFFF] max-w-[150px] sm:max-w-xs truncate">{s.name}</td>
                  <td className="py-3.5 px-2.5 sm:px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/30">
                      {s.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-2.5 sm:px-4 text-center font-bold text-[#FFFFFF] whitespace-nowrap">
                    {s.unitsSold}
                  </td>
                  <td className="py-3.5 px-2.5 sm:px-4 font-bold text-[#DFC18A] whitespace-nowrap">
                    ₹{s.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-bold text-emerald-300 whitespace-nowrap">
                    ₹{Math.round(s.revenue * 0.48).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
