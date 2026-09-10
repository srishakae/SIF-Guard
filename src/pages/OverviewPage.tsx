import React from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Flame,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Activity,
  Wrench,
  ShieldX,
  Compass,
} from "lucide-react";
import { AnalyzedReport, PageId } from "../types";
import { KpiCard } from "../components/KpiCard";
import { EmptyState } from "../components/EmptyState";

interface OverviewPageProps {
  reports: AnalyzedReport[];
  onNavigate: (page: PageId) => void;
  onOpenReview: (report: AnalyzedReport) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  reports,
  onNavigate,
  onOpenReview,
}) => {
  const totalReports = reports.length;
  const sifCount = reports.filter((r) => r.sifPotential).length;
  const nonSifCount = reports.filter((r) => !r.sifPotential).length;
  const highPriorityCount = reports.filter(
    (r) => r.priority === "HIGH" || r.priority === "CRITICAL"
  ).length;

  const isEmpty = totalReports === 0;

  // Life-Saving Rule Distribution counts
  const targetLSRs = [
    "Energy Isolation",
    "Confined Space",
    "Line of Fire",
    "Working at Height",
    "Process Safety / PPE",
  ];

  const lsrCounts: Record<string, number> = {};
  targetLSRs.forEach((lsr) => (lsrCounts[lsr] = 0));
  reports.forEach((r) => {
    if (r.lifeSavingRule) {
      lsrCounts[r.lifeSavingRule] = (lsrCounts[r.lifeSavingRule] || 0) + 1;
    }
  });

  // Top Hazards aggregation
  const hazardCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.hazard && r.hazard !== "None identified") {
      hazardCounts[r.hazard] = (hazardCounts[r.hazard] || 0) + 1;
    }
  });
  const topHazards = Object.entries(hazardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top Activities aggregation
  const activityCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.activity) {
      activityCounts[r.activity] = (activityCounts[r.activity] || 0) + 1;
    }
  });
  const topActivities = Object.entries(activityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top Barrier Failures aggregation
  const barrierCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.barrierFailure && !r.barrierFailure.toLowerCase().includes("none")) {
      barrierCounts[r.barrierFailure] = (barrierCounts[r.barrierFailure] || 0) + 1;
    }
  });
  const topBarriers = Object.entries(barrierCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Priority Review Queue: show reports that need review or are High/Critical
  const reviewQueueReports = reports
    .filter((r) => r.status === "Needs Review" || r.priority === "CRITICAL" || r.priority === "HIGH")
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest font-semibold">
                Industrial Precursor Analytics
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                Oil &amp; Gas / Process HSE
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
              SIF-Guard | Precursor Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Explainable AI for Serious Injury &amp; Fatality precursor screening
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-cyan-400/90">
              <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                Detect
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                Explain
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                Map
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                Aggregate
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                Prioritize
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={() => onNavigate("analyze")}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
            >
              <span>Screen Safety Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Reports"
          value={totalReports}
          subtext={isEmpty ? "Database empty (0 screened)" : "Free-text reports screened"}
          icon={FileText}
          variant="neutral"
          isEmpty={isEmpty}
        />
        <KpiCard
          title="SIF Potential"
          value={sifCount}
          subtext={isEmpty ? "No SIF precursors flagged" : `${((sifCount / Math.max(1, totalReports)) * 100).toFixed(0)}% of screened cohort`}
          icon={AlertTriangle}
          variant="danger"
          isEmpty={isEmpty}
        />
        <KpiCard
          title="Non-SIF"
          value={nonSifCount}
          subtext={isEmpty ? "No low-severity reports" : "Low energy / minor hazard"}
          icon={CheckCircle}
          variant="safe"
          isEmpty={isEmpty}
        />
        <KpiCard
          title="High Priority"
          value={highPriorityCount}
          subtext={isEmpty ? "Zero escalation queue" : "Urgent HSE investigation"}
          icon={Flame}
          variant="warning"
          isEmpty={isEmpty}
        />
      </div>

      {/* SIF Risk Overview & Life-Saving Rule Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SIF Risk Overview */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                SIF Risk Overview
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Binary SIF Split
            </span>
          </div>

          {isEmpty ? (
            <EmptyState
              title="No reports analyzed yet"
              description="Analyze report or upload CSV to view SIF vs Non-SIF risk breakdown."
              compact
            />
          ) : (
            <div className="space-y-4 my-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="text-[10px] font-mono uppercase text-rose-300 font-semibold mb-1">
                    SIF Potential
                  </div>
                  <div className="font-display text-2xl font-bold text-rose-400">
                    {sifCount}{" "}
                    <span className="text-xs font-normal font-sans text-rose-300/80">
                      ({((sifCount / totalReports) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Critical barrier failures / high energy
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-[10px] font-mono uppercase text-emerald-300 font-semibold mb-1">
                    Non-SIF
                  </div>
                  <div className="font-display text-2xl font-bold text-emerald-400">
                    {nonSifCount}{" "}
                    <span className="text-xs font-normal font-sans text-emerald-300/80">
                      ({((nonSifCount / totalReports) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Low severity / administrative findings
                  </div>
                </div>
              </div>

              {/* Proportional Stack Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-500"
                    style={{ width: `${(sifCount / totalReports) * 100}%` }}
                    title={`SIF: ${sifCount}`}
                  />
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(nonSifCount / totalReports) * 100}%` }}
                    title={`Non-SIF: ${nonSifCount}`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>SIF Precursors ({sifCount})</span>
                  <span>Non-SIF Controls ({nonSifCount})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Life-Saving Rule Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Life-Saving Rule Distribution
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              IOGP Standard Mapping
            </span>
          </div>

          {isEmpty ? (
            <EmptyState
              title="No reports analyzed yet"
              description="Life-Saving Rules will dynamically map upon report screening."
              compact
            />
          ) : (
            <div className="space-y-2.5 my-auto">
              {targetLSRs.map((lsr) => {
                const count = lsrCounts[lsr] || 0;
                const pct = totalReports > 0 ? (count / totalReports) * 100 : 0;
                return (
                  <div key={lsr} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300">{lsr}</span>
                      <span className="font-mono text-slate-400">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Extracted Structured Safety Intelligence Rows: Top Hazards, Top Activities, Top Barriers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top Hazards */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Top Hazards
            </h3>
          </div>
          {isEmpty || topHazards.length === 0 ? (
            <div className="my-auto py-4 text-center text-xs text-slate-400">
              No hazards extracted yet
            </div>
          ) : (
            <div className="space-y-2 my-auto">
              {topHazards.map(([hazard, count]) => (
                <div
                  key={hazard}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium truncate pr-2">
                    {hazard}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] shrink-0">
                    {count} {count === 1 ? "incident" : "incidents"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Activities */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-blue-400" />
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Top Activities
            </h3>
          </div>
          {isEmpty || topActivities.length === 0 ? (
            <div className="my-auto py-4 text-center text-xs text-slate-400">
              No activities extracted yet
            </div>
          ) : (
            <div className="space-y-2 my-auto">
              {topActivities.map(([activity, count]) => (
                <div
                  key={activity}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium truncate pr-2">
                    {activity}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] shrink-0">
                    {count} {count === 1 ? "task" : "tasks"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Barrier Failures */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <ShieldX className="w-4 h-4 text-rose-400" />
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Top Barrier Failures
            </h3>
          </div>
          {isEmpty || topBarriers.length === 0 ? (
            <div className="my-auto py-4 text-center text-xs text-slate-400">
              No barrier failures detected yet
            </div>
          ) : (
            <div className="space-y-2 my-auto">
              {topBarriers.map(([barrier, count]) => (
                <div
                  key={barrier}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium truncate pr-2">
                    {barrier}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] shrink-0">
                    {count} {count === 1 ? "breach" : "breaches"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Priority Review Queue Table Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Priority Review Queue
            </h3>
          </div>
          {reviewQueueReports.length > 0 && (
            <button
              onClick={() => onNavigate("review")}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View Full Queue ({reviewQueueReports.length})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {reviewQueueReports.length === 0 ? (
          <EmptyState
            title="No reports require review"
            description="Reports identified as SIF potential or High/Critical priority will appear here for human safety sign-off."
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Report</th>
                  <th className="py-2.5 px-3">SIF Potential</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Key Evidence</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {reviewQueueReports.map((r) => {
                  const keyEvidence =
                    r.evidence && r.evidence.length > 0
                      ? r.evidence[0].text
                      : "Evidence grounded";

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-mono text-[11px] text-cyan-400 mb-0.5">
                          {r.id}
                        </div>
                        <p className="text-slate-300 truncate text-xs">
                          {r.reportText}
                        </p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            r.sifPotential
                              ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {r.sifPotential ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                        {(r.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${
                            r.priority === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : r.priority === "HIGH"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          }`}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs text-slate-300 truncate text-xs">
                        <span className="font-mono text-[11px] text-amber-300/90 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
                          "{keyEvidence}"
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            r.status === "Reviewed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenReview(r)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
                        >
                          Review &amp; Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
