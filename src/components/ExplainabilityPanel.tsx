import React from "react";
import { Sparkles, BarChart2, Info, CheckCircle2 } from "lucide-react";
import { ModelAttribution } from "../types";

interface ExplainabilityPanelProps {
  sifPotential: boolean;
  attribution?: ModelAttribution;
  priority: string;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  sifPotential,
  attribution,
  priority,
}) => {
  const hasTokens = attribution?.tokens && attribution.tokens.length > 0;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              AI Explanation &amp; Attribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Deterministic &amp; NLP Model Rationale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Engine: {attribution?.engine || "SIF-Guard Standard"}
          </span>
        </div>
      </div>

      {/* Rationale Statement */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-300 space-y-1">
            <p className="font-semibold text-slate-200">
              {sifPotential
                ? `System Flagged as SIF Precursor (Priority: ${priority})`
                : "System Screened as Non-SIF Condition"}
            </p>
            <p className="text-slate-400">
              {attribution?.rationale ||
                (sifPotential
                  ? "Report contains a convergence of high-energy hazard exposure and barrier failure capable of serious injury or fatality."
                  : "Routine operational anomaly or low-energy observation with no severe hazard precursors detected.")}
            </p>
          </div>
        </div>
      </div>

      {/* LIME / SHAP Feature Attribution Component */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            Token Feature Importance (SHAP / LIME Attribution Structure)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {hasTokens ? "Active Precursor Weights" : "Awaiting Python SHAP Ingest"}
          </span>
        </div>

        {hasTokens ? (
          <div className="space-y-2 pt-1">
            {attribution!.tokens!.map((item, idx) => {
              const isSif = item.class === "SIF";
              const pct = Math.round(item.weight * 100);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-slate-950/50 p-2 rounded-lg border border-slate-800/70"
                >
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSif ? "bg-rose-400 shadow-[0_0_6px_#f43f5e]" : "bg-emerald-400"
                      }`}
                    />
                    <span className="font-mono text-slate-200 font-medium">
                      "{item.token}"
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="flex-1 mx-4 flex items-center gap-2">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isSif
                            ? "bg-gradient-to-r from-amber-500 to-rose-500"
                            : "bg-gradient-to-r from-cyan-500 to-emerald-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 min-w-[32px] text-right">
                      +{pct}%
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      isSif
                        ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {item.class}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center">
            <p className="text-xs text-slate-400 mb-1 font-mono">
              Model Attribution Module: Ready for Python LIME/SHAP Ingest
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Attribution vectors will populate automatically when the Python SHAP / LIME explainer backend returns token contribution arrays on{" "}
              <code className="text-cyan-400">POST /api/v1/analyze</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
