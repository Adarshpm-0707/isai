import React, { useState, useEffect } from 'react';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Badge from '../../components/reusable/Badge';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await adminLogService.getAdminLogs();
        setLogs(data || []);
      } catch (err) {
        console.error('Error fetching admin logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#F5E6BE] font-sans">
      <SectionHeading title="Admin Activity Logs" subtitle="Audit trail of all administrative actions and system events" align="left" />

      <div className="bg-[#0F131C] border border-[#D4AF37]/30 rounded-xl shadow-xl overflow-hidden text-[#FFFFFF]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Timestamp</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Actor</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Action</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Target Table</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Target ID</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center italic text-[#A1A1AA]">
                    No activity log entries recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 text-[#A1A1AA] font-mono text-[10px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 font-bold text-[#FFFFFF] whitespace-nowrap">
                      {log.actor?.name || log.actor?.email || log.actor_id || 'System'}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 whitespace-nowrap">
                      <Badge text={log.action} variant="gold" />
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 uppercase font-bold text-[10px] text-[#A1A1AA] whitespace-nowrap">{log.target_table || 'N/A'}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 font-mono text-[10px] text-[#A1A1AA] whitespace-nowrap">{log.target_id || 'N/A'}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6">
                      <pre className="text-[9px] bg-[#0A0D14] border border-[#D4AF37]/30 p-2 rounded-lg overflow-x-auto font-mono text-[#FFFFFF] max-w-[180px] sm:max-w-xs md:max-w-sm">
                        {JSON.stringify(log.details || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
