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
    <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F5E6BE] font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Customer Name</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Email Address</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Phone Number</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Account Role</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Total Orders</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Total Spent</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {filteredCustomers.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#A1A1AA] italic">
                  {searchQuery ? `No customers matching "${searchQuery}"` : 'No customers recorded yet.'}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const stats = getCustomerOrderStats(cust.email, cust.id);

                return (
                  <tr key={cust.id} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-bold text-[#FFFFFF]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#161B26] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0 overflow-hidden">
                          {cust.avatar_url ? (
                            <img src={cust.avatar_url} alt={cust.name} className="w-full h-full object-cover" />
                          ) : (
                            cust.name?.charAt(0).toUpperCase() || 'C'
                          )}
                        </div>
                        <span className="truncate max-w-[130px] sm:max-w-none">{cust.name}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-mono text-[#A1A1AA]">
                      <span className="truncate max-w-[150px] sm:max-w-none block">{cust.email}</span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 text-[#A1A1AA] whitespace-nowrap">{cust.phone || 'N/A'}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                        User
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-bold text-[#FFFFFF] whitespace-nowrap">{stats.count} orders</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-bold text-[#D4AF37] whitespace-nowrap">
                      ₹{stats.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 text-right space-x-1.5 sm:space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onViewCustomer(cust)}
                        className="p-1.5 bg-[#161B26] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 rounded-lg transition-all cursor-pointer"
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
