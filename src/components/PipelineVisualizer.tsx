import React from "react";
import {
  FileText,
  ScanEye,
  Crosshair,
  Compass,
  FileQuestion,
  Gauge,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface PipelineVisualizerProps {
  activeStage?: number; // 0 to 5 or -1 for idle/complete
  isProcessing?: boolean;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  activeStage = -1,
  isProcessing = false,
}) => {
  const stages = [
    { name: "Free-text Report", desc: "Raw Safety Text Ingest", icon: FileText },
    { name: "SIF Screening", desc: "Binary Precursor Gate", icon: ScanEye },
    { name: "Precursor Extraction", desc: "Hazard & Barrier Mining", icon: Crosshair },
    { name: "Life-Saving Rule", desc: "IOGP Rule Alignment", icon: Compass },
    { name: "Explainability", desc: "Evidence Substring Grounding", icon: FileQuestion },
    { name: "Priority Score", desc: "HSE Escalation Rating", icon: Gauge },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Explainable AI / NLP Screening Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {isProcessing
            ? `Processing Stage ${(activeStage ?? 0) + 1} of 6...`
            : "Deterministic & LLM Screening Pipeline Ready"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = isProcessing && activeStage === idx;
          const isPassed = !isProcessing || (activeStage !== undefined && activeStage > idx);

          let stageStatusStyle = "border-slate-800 bg-slate-950/60 text-slate-400";
          if (isCurrent) {
            stageStatusStyle =
              "border-cyan-500 bg-cyan-950/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40";
          } else if (isPassed) {
            stageStatusStyle = "border-slate-700/80 bg-slate-900/80 text-slate-300";
          }

          return (
            <div
              key={stage.name}
              className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${stageStatusStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                  {isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isCurrent
                        ? "text-cyan-400 animate-pulse"
                        : isPassed
                        ? "text-cyan-400"
                        : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs font-semibold tracking-tight text-slate-200">
                    {stage.name}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-1">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
