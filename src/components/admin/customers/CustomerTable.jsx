import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

export default function CustomerTable({
  filteredCustomers,
  loading,
  searchQuery,
  getCustomerOrderStats,
  onViewCustomer,
  onDeleteCustomer,
}) {
  return (
    <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F3E5AB]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
              <th className="py-4 px-6">Customer Name</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6">Phone Number</th>
              <th className="py-4 px-6">Account Role</th>
              <th className="py-4 px-6">Total Orders</th>
              <th className="py-4 px-6">Total Spent</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {filteredCustomers.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#EADFC9]/70 italic">
                  {searchQuery ? `No customers matching "${searchQuery}"` : 'No customers recorded yet.'}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const stats = getCustomerOrderStats(cust.email, cust.id);

                return (
                  <tr key={cust.id} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#F3E5AB] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                        {cust.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#EADFC9]">{cust.email}</td>
                    <td className="py-4 px-6 text-[#EADFC9]">{cust.phone}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                        User
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#F3E5AB]">{stats.count} orders</td>
                    <td className="py-4 px-6 font-bold text-[#D4AF37]">
                      ₹{stats.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onViewCustomer(cust)}
                        className="p-1.5 bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35 rounded-lg transition-all cursor-pointer"
                        title="View Customer Profile & History"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCustomer(cust)}
                        className="p-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 rounded-lg transition-all cursor-pointer"
                        title="Delete Customer Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
