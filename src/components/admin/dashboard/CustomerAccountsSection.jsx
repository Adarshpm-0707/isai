import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, Trash2 } from 'lucide-react';

export default function CustomerAccountsSection({ customers = [], handleDeleteCustomer }) {
  return (
    <section className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-lg sm:text-xl font-bold text-[#FFFFFF]">
              Customer Profiles & Account Records
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/40">
              {customers.length} Profiles
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Active customer accounts and contact information
          </p>
        </div>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161B26] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] hover:bg-[#1E2534] hover:text-[#FFFFFF] transition-all self-start sm:self-auto"
        >
          <span>View Full Directory</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/25">
        {customers.length === 0 ? (
          <p className="text-xs text-[#A1A1AA] italic py-8 text-center">
            No customer profiles registered yet.
          </p>
        ) : (
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold tracking-wider bg-[#090B10]">
                <th className="py-3 px-4">Customer Full Name</th>
                <th className="py-3 px-4">Email Address & Phone Number</th>
                <th className="py-3 px-4">User Role</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {customers.slice(0, 6).map((c, i) => {
                const initials = (c.name || 'CU')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={c.id || i} className="hover:bg-[#161B26] transition-colors">
                    {/* Customer Full Name */}
                    <td className="py-3.5 px-4 font-bold text-[#FFFFFF]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#090B10] font-black flex items-center justify-center text-xs shrink-0">
                          {initials}
                        </div>
                        <span className="break-words">{c.name || 'Customer User'}</span>
                      </div>
                    </td>

                    {/* Full Email & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <p className="font-mono text-[#FFFFFF] text-xs flex items-center gap-1.5 break-all">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          {c.email}
                        </p>
                        {c.phone && (
                          <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5 font-mono">
                            <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            {c.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/40">
                        {c.role || 'Verified Customer'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-[#A1A1AA] font-mono text-xs">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Active User'}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCustomer(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950 text-red-200 border border-red-500/50 hover:bg-red-800 hover:text-white transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
                        title="Delete Customer Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

