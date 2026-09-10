import React from "react";
import {
  Activity,
  BarChart2,
  PieChart,
  ShieldAlert,
  Flame,
  Wrench,
  AlertTriangle,
  Compass,
  ShieldX,
  Gauge,
  Layers,
  ArrowRight,
} from "lucide-react";
import { AnalyzedReport, PageId } from "../types";
import { EmptyState } from "../components/EmptyState";

interface AnalyticsPageProps {
  reports: AnalyzedReport[];
  onNavigate: (page: PageId) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  reports,
  onNavigate,
}) => {
  const total = reports.length;
  const isEmpty = total === 0;

  // SIF Potential Distribution
  const sifCount = reports.filter((r) => r.sifPotential).length;
  const nonSifCount = reports.filter((r) => !r.sifPotential).length;
  const sifPct = total > 0 ? (sifCount / total) * 100 : 0;
  const nonSifPct = total > 0 ? (nonSifCount / total) * 100 : 0;

  // Average confidence
  const avgConfidence =
    total > 0
      ? (reports.reduce((acc, r) => acc + r.confidence, 0) / total) * 100
      : 0;

  // Life-Saving Rule Distribution
  const lsrDistribution: Record<string, number> = {};
  reports.forEach((r) => {
    const lsr = r.lifeSavingRule || "Unmapped";
    lsrDistribution[lsr] = (lsrDistribution[lsr] || 0) + 1;
  });
  const sortedLSR = Object.entries(lsrDistribution).sort((a, b) => b[1] - a[1]);

  // Top Hazards
  const hazardCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.hazard) {
      hazardCounts[r.hazard] = (hazardCounts[r.hazard] || 0) + 1;
    }
  });
  const sortedHazards = Object.entries(hazardCounts).sort((a, b) => b[1] - a[1]);

  // Top Activities
  const activityCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.activity) {
      activityCounts[r.activity] = (activityCounts[r.activity] || 0) + 1;
    }
  });
  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

  // Top Barrier Failures
  const barrierCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.barrierFailure && !r.barrierFailure.toLowerCase().includes("none")) {
      barrierCounts[r.barrierFailure] = (barrierCounts[r.barrierFailure] || 0) + 1;
    }
  });
  const sortedBarriers = Object.entries(barrierCounts).sort((a, b) => b[1] - a[1]);

  // Priority Distribution
  const priorityCounts = {
    LOW: reports.filter((r) => r.priority === "LOW").length,
    MEDIUM: reports.filter((r) => r.priority === "MEDIUM").length,
    HIGH: reports.filter((r) => r.priority === "HIGH").length,
    CRITICAL: reports.filter((r) => r.priority === "CRITICAL").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
              Precursor Intelligence
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Aggregated Analytics
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
            Safety Analytics &amp; Risk Aggregations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pattern discovery calculated purely from currently screened reports
          </p>
        </div>

        {isEmpty && (
          <button
            onClick={() => onNavigate("analyze")}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-1.5"
          >
            <span>Analyze a Report First</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          title="No reports analyzed yet"
          description="Analytics and distribution charts are calculated dynamically and remain empty until reports are screened through the engine."
          actionText="Screen a Report Now"
          onAction={() => onNavigate("analyze")}
        />
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Analyzed Cohort
              </span>
              <span className="font-display text-2xl font-bold text-slate-100">
                {total}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Total Incident Reports
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-rose-400 block mb-1">
                SIF Potential Rate
              </span>
              <span className="font-display text-2xl font-bold text-rose-400">
                {sifPct.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {sifCount} High-Severity Precursors
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                Mean Confidence
              </span>
              <span className="font-display text-2xl font-bold text-cyan-400">
                {avgConfidence.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                NLP Classification Accuracy
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                High / Critical Triage
              </span>
              <span className="font-display text-2xl font-bold text-amber-400">
                {priorityCounts.HIGH + priorityCounts.CRITICAL}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                HSE Review Required
              </span>
            </div>
          </div>

          {/* Section 1: SIF Potential Distribution & Priority Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SIF Potential Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                    SIF Potential Distribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Binary Breakdown
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                      SIF Precursor
                    </span>
                    <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
                  </div>
                  <div className="font-display text-3xl font-extrabold text-rose-400">
                    {sifCount}
                  </div>
                  <div className="text-xs text-rose-300/80 font-mono mt-1">
                    {sifPct.toFixed(1)}% of total reports
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      Non-SIF
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </div>
                  <div className="font-display text-3xl font-extrabold text-emerald-400">
                    {nonSifCount}
                  </div>
                  <div className="text-xs text-emerald-300/80 font-mono mt-1">
                    {nonSifPct.toFixed(1)}% of total reports
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-500"
                    style={{ width: `${sifPct}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${nonSifPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>SIF Precursors ({sifCount})</span>
                  <span>Non-SIF Controls ({nonSifCount})</span>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                    Priority Distribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  HSE Triage Severity
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Low
                  </span>
                  <span className="font-display text-xl font-bold text-slate-300">
                    {priorityCounts.LOW}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <span className="text-[10px] font-mono text-blue-300 uppercase block">
                    Medium
                  </span>
                  <span className="font-display text-xl font-bold text-blue-400">
                    {priorityCounts.MEDIUM}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block">
                    High
                  </span>
                  <span className="font-display text-xl font-bold text-amber-400">
                    {priorityCounts.HIGH}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] font-mono text-rose-300 uppercase block">
                    Critical
                  </span>
                  <span className="font-display text-xl font-bold text-rose-400">
                    {priorityCounts.CRITICAL}
                  </span>
                </div>
              </div>

              {/* Progress bars for each priority tier */}
              <div className="space-y-2 pt-1">
                {(
                  [
                    { label: "CRITICAL", count: priorityCounts.CRITICAL, color: "bg-rose-500" },
                    { label: "HIGH", count: priorityCounts.HIGH, color: "bg-amber-500" },
                    { label: "MEDIUM", count: priorityCounts.MEDIUM, color: "bg-blue-500" },
                    { label: "LOW", count: priorityCounts.LOW, color: "bg-emerald-500" },
                  ] as const
                ).map((p) => {
                  const pPct = total > 0 ? (p.count / total) * 100 : 0;
                  return (
                    <div key={p.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{p.label}</span>
                        <span className="text-slate-400">
                          {p.count} ({pPct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${p.color} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${pPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Life-Saving Rule Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Life-Saving Rule Distribution
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Frequency Ranked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedLSR.map(([lsr, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div
                    key={lsr}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 truncate pr-2">
                        {lsr}
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 text-right">
                      {pct.toFixed(1)}% of reports
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Top Hazards, Top Activities, Top Barrier Failures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Hazards */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Top Hazards
                </h3>
              </div>
              <div className="space-y-2">
                {sortedHazards.slice(0, 6).map(([hazard, count]) => (
                  <div
                    key={hazard}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium truncate pr-2">
                      {hazard}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Activities */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Top Activities
                </h3>
              </div>
              <div className="space-y-2">
                {sortedActivities.slice(0, 6).map(([activity, count]) => (
                  <div
                    key={activity}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium truncate pr-2">
                      {activity}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Barrier Failures */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldX className="w-4 h-4 text-rose-400" />
                <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Top Barrier Failures
                </h3>
              </div>
              <div className="space-y-2">
                {sortedBarriers.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">
                    No compromised barriers recorded
                  </div>
                ) : (
                  sortedBarriers.slice(0, 6).map(([barrier, count]) => (
                    <div
                      key={barrier}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200 font-medium truncate pr-2">
                        {barrier}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 shrink-0">
                        {count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
