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
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      <SectionHeading title="Admin Activity Logs" subtitle="Audit trail of all administrative actions and system events" align="left" />

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Actor</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Target Table</th>
                <th className="py-4 px-6">Target ID</th>
                <th className="py-4 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center italic text-[#EADFC9]/70">
                    No activity log entries recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-4 px-6 text-[#EADFC9] font-mono text-[10px]">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#F3E5AB]">
                      {log.actor?.name || log.actor?.email || log.actor_id || 'System'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge text={log.action} variant="gold" />
                    </td>
                    <td className="py-4 px-6 uppercase font-bold text-[10px] text-[#EADFC9]">{log.target_table || 'N/A'}</td>
                    <td className="py-4 px-6 font-mono text-[10px] text-[#EADFC9]">{log.target_id || 'N/A'}</td>
                    <td className="py-4 px-6 max-w-xs truncate">
                      <pre className="text-[9px] bg-[#1A3C2B] border border-[#D4AF37]/30 p-2 rounded-lg overflow-x-auto font-mono text-[#F3E5AB]">
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
