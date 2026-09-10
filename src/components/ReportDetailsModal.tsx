import React from "react";
import { X, ShieldAlert, FileText, CheckCircle2, UserCheck } from "lucide-react";
import { AnalyzedReport } from "../types";
import { ConfidenceRadial } from "./ConfidenceRadial";
import { StructuredIntelligence } from "./StructuredIntelligence";
import { EvidenceHighlighter } from "./EvidenceHighlighter";
import { ExplainabilityPanel } from "./ExplainabilityPanel";

interface ReportDetailsModalProps {
  report: AnalyzedReport | null;
  onClose: () => void;
  onOpenReview: (report: AnalyzedReport) => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
  onOpenReview,
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Screened Report Details &amp; Precursor Audit
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {report.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full NLP Attributions, Life-Saving Rule Mapping &amp; Evidence Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              report.sifPotential
                ? "bg-rose-950/30 border-rose-500/40"
                : "bg-emerald-950/30 border-emerald-500/40"
            } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`font-display text-2xl md:text-3xl font-extrabold ${
                  report.sifPotential ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                SIF POTENTIAL: {report.sifPotential ? "YES" : "NO"}
              </span>
              <span
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded border ${
                  report.priority === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : report.priority === "HIGH"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                }`}
              >
                {report.priority} Priority
              </span>
            </div>

            <ConfidenceRadial
              confidence={report.confidence}
              sifPotential={report.sifPotential}
              size={90}
            />
          </div>

          {/* Structured Intelligence */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Structured Safety Intelligence
            </h4>
            <StructuredIntelligence
              activity={report.activity}
              hazard={report.hazard}
              barrierFailure={report.barrierFailure}
              potentialConsequence={report.potentialConsequence}
              lifeSavingRule={report.lifeSavingRule}
              priority={report.priority}
              priorityScore={report.priorityScore}
            />
          </div>

          {/* Evidence Phrases */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Evidence Phrase Grounding
            </h4>
            <EvidenceHighlighter
              text={report.reportText}
              evidence={report.evidence}
            />
          </div>

          {/* Explainability & SHAP panel */}
          <ExplainabilityPanel
            sifPotential={report.sifPotential}
            attribution={report.modelAttribution}
            priority={report.priority}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Status:</span>
            <span
              className={`font-mono text-[11px] px-2 py-0.5 rounded-full border ${
                report.status === "Reviewed"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {report.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenReview(report);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Open HSE Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
