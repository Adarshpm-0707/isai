import React from 'react';

export default function TopPerformingSareesTable({ topSarees }) {
  return (
    <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-[#D4AF37]/25 flex items-center justify-between">
        <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
          Top Revenue Generating Sarees
        </h4>
        <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest">
          Sales Performance
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#081A11]">
              <th className="py-3 px-5">Saree Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Units Sold</th>
              <th className="py-3 px-4">Total Revenue</th>
              <th className="py-3 px-4 text-right">Est. Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {topSarees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#EADFC9]/70 italic">
                  No individual saree sales recorded in this timeframe yet.
                </td>
              </tr>
            ) : (
              topSarees.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#153424]/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#F3E5AB]">{s.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A3C2B] text-[#D4AF37] border border-[#D4AF37]/30">
                      {s.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#F3E5AB]">
                    {s.unitsSold}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#DFC18A]">
                    ₹{s.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-300">
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
