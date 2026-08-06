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
        setLogs(data);
      } catch (err) {
        console.error('Error fetching admin logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <SectionHeading title="Admin Activity Logs" subtitle="Audit trail of all administrative actions" align="left" />

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 uppercase font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Table</th>
              <th className="py-3 px-4">Target ID</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8A55A]/10">
            {logs.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center italic text-[#D8A55A]/60">
                  No activity log entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#5C2F14]/30">
                  <td className="py-3 px-4 text-[#D8A55A] font-mono text-[10px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#F6D18A]">
                    {log.actor?.name || log.actor?.email || log.actor_id || 'System'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge text={log.action} variant="gold" />
                  </td>
                  <td className="py-3 px-4 uppercase font-bold text-[10px]">{log.target_table || 'N/A'}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#D8A55A]">{log.target_id || 'N/A'}</td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    <pre className="text-[9px] bg-[#4A0000]/60 p-1 rounded overflow-x-auto font-mono text-[#F6D18A]">
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
  );
}
