import React, { useState } from "react";
import {
  ClipboardCheck,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Eye,
  Search,
} from "lucide-react";
import { AnalyzedReport } from "../types";
import { EmptyState } from "../components/EmptyState";

interface ReviewQueuePageProps {
  reports: AnalyzedReport[];
  onOpenReview: (report: AnalyzedReport) => void;
  onOpenDetails: (report: AnalyzedReport) => void;
}

export const ReviewQueuePage: React.FC<ReviewQueuePageProps> = ({
  reports,
  onOpenReview,
  onOpenDetails,
}) => {
  const [filter, setFilter] = useState<"ALL" | "NEEDS_REVIEW" | "REVIEWED" | "SIF_ONLY">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((r) => {
    if (filter === "NEEDS_REVIEW" && r.status !== "Needs Review") return false;
    if (filter === "REVIEWED" && r.status !== "Reviewed") return false;
    if (filter === "SIF_ONLY" && !r.sifPotential) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.reportText.toLowerCase().includes(q) ||
        r.activity.toLowerCase().includes(q) ||
        r.hazard.toLowerCase().includes(q) ||
        r.lifeSavingRule.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const needsReviewCount = reports.filter((r) => r.status === "Needs Review").length;
  const reviewedCount = reports.filter((r) => r.status === "Reviewed").length;
  const sifCount = reports.filter((r) => r.sifPotential).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
              HSE Verification Gate
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Human-in-the-Loop Governance
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
            Human Review Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Reports requiring additional attention based on SIF potential, confidence and priority.
          </p>
        </div>

        {/* Human Authority Notice Card */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Final safety decisions remain with qualified HSE professionals.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === "ALL"
                ? "bg-slate-800 text-slate-100 border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilter("NEEDS_REVIEW")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              filter === "NEEDS_REVIEW"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Needs Review</span>
            {needsReviewCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200">
                {needsReviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("SIF_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              filter === "SIF_ONLY"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>SIF Precursors</span>
            {sifCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-200">
                {sifCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("REVIEWED")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === "REVIEWED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Reviewed ({reviewedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search report text, ID, hazard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        {filteredReports.length === 0 ? (
          <EmptyState
            title="No reports require review"
            description={
              reports.length === 0
                ? "Screen safety reports from the Analyze Report page to build the review queue."
                : "All reports matching the selected filter have been addressed."
            }
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400 bg-slate-950/40">
                <tr>
                  <th className="py-3 px-3">Report</th>
                  <th className="py-3 px-3 whitespace-nowrap">SIF Potential</th>
                  <th className="py-3 px-3 whitespace-nowrap">Confidence</th>
                  <th className="py-3 px-3 whitespace-nowrap">Priority</th>
                  <th className="py-3 px-3 min-w-[200px]">Key Evidence</th>
                  <th className="py-3 px-3 whitespace-nowrap">Status</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredReports.map((r) => {
                  const keyEvidence =
                    r.evidence && r.evidence.length > 0
                      ? r.evidence[0].text
                      : "Direct textual evidence";

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 max-w-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                            {r.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                          {r.reportText}
                        </p>
                        {r.reviewNotes && (
                          <div className="mt-1.5 p-1.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                            <UserCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="italic truncate">
                              HSE Note: "{r.reviewNotes}" ({r.reviewedBy})
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            r.sifPotential
                              ? "bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]"
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

                      <td className="py-3 px-3 text-slate-300">
                        <span className="font-mono text-[11px] text-amber-300/90 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 inline-block max-w-[220px] truncate">
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDetails(r)}
                            title="View Details"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenReview(r)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </div>
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
