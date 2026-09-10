import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  UserCheck,
  Calendar,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { AnalyzedReport } from "../types";

interface ReviewModalProps {
  report: AnalyzedReport | null;
  onClose: () => void;
  onSaveReview: (
    reportId: string,
    notes: string,
    reviewedBy: string,
    status: "Reviewed" | "Needs Review",
    overrideSif?: boolean
  ) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  report,
  onClose,
  onSaveReview,
}) => {
  if (!report) return null;

  const [notes, setNotes] = useState(report.reviewNotes || "");
  const [reviewerName, setReviewerName] = useState(
    report.reviewedBy || "Lead HSE Specialist"
  );
  const [status, setStatus] = useState<"Reviewed" | "Needs Review">(
    report.status || "Reviewed"
  );
  const [confirmedSif, setConfirmedSif] = useState(report.sifPotential);

  const handleSave = () => {
    onSaveReview(report.id, notes, reviewerName, status, confirmedSif);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Human HSE Review &amp; Sign-off
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {report.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI-Assisted Screening • Human HSE Authority
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

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Report Source Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>ORIGINAL REPORT TEXT</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "{report.reportText}"
            </p>
          </div>

          {/* AI Precursor Screening Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                AI PREDICTION
              </span>
              <span
                className={`font-bold ${
                  report.sifPotential ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {report.sifPotential ? "SIF POTENTIAL" : "NON-SIF"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                MODEL CONFIDENCE
              </span>
              <span className="font-bold text-slate-200">
                {(report.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                LIFE-SAVING RULE
              </span>
              <span className="font-bold text-cyan-400 truncate block">
                {report.lifeSavingRule}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                INITIAL PRIORITY
              </span>
              <span className="font-bold text-amber-400">
                {report.priority}
              </span>
            </div>
          </div>

          {/* SIF Determination Human Verification */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              HSE Professional Final Classification Determination
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmedSif(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  confirmedSif
                    ? "bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Confirm SIF Precursor Potential
              </button>
              <button
                type="button"
                onClick={() => setConfirmedSif(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  !confirmedSif
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Classify as Non-SIF Condition
              </button>
            </div>
          </div>

          {/* HSE Reviewer Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              HSE Investigation &amp; Barrier Action Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified lockout permit on site. Work suspended until energy isolation procedure confirmed. Toolbox briefing scheduled for next shift..."
              rows={3}
              className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />
          </div>

          {/* Reviewer & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                REVIEWED BY (OFFICIAL HSE SIGN-OFF)
              </label>
              <div className="relative">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                REVIEW STATUS
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "Reviewed" | "Needs Review")
                }
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Reviewed">Reviewed &amp; Approved</option>
                <option value="Needs Review">Needs Further Investigation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Audit timestamp will be logged upon sign-off
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save HSE Determination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
