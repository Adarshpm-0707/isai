import React from 'react';
import useProfitLoss from '../../hooks/useProfitLoss';
import SectionHeading from '../../components/reusable/SectionHeading';
import ProfitLossKpiCards from '../../components/admin/profitloss/ProfitLossKpiCards';
import ProfitLossDetailsGrid from '../../components/admin/profitloss/ProfitLossDetailsGrid';
import TopPerformingSareesTable from '../../components/admin/profitloss/TopPerformingSareesTable';
import { Download } from 'lucide-react';

export default function ProfitLoss() {
  const {
    timeRange,
    setTimeRange,
    metrics,
    handleExportReport,
  } = useProfitLoss();

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F5E6BE] font-sans">
      {/* Title & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Profit &amp; Loss Financial Overview"
          subtitle="Real-time revenue accounting, cost analysis, margin estimates, and sales health"
          align="left"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Filter Buttons */}
          <div className="flex items-center bg-[#0F131C] border border-[#D4AF37]/35 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'Past 7 Days' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === t.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10]'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161B26] text-[#F5E6BE] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] transition-all text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export P&amp;L</span>
          </button>
        </div>
      </div>

      {/* 4 Main Financial KPI Cards */}
      <ProfitLossKpiCards metrics={metrics} />

      {/* Financial Cost Breakdown & Payment Channels */}
      <ProfitLossDetailsGrid metrics={metrics} />

      {/* Top Saree Revenue Leaders Table */}
      <TopPerformingSareesTable topSarees={metrics.topSarees} />
    </div>
  );
}
