import React from "react";
import {
  Wrench,
  AlertOctagon,
  ShieldX,
  Skull,
  Compass,
  Gauge,
} from "lucide-react";
import { PriorityLevel } from "../types";

interface StructuredIntelligenceProps {
  activity: string;
  hazard: string;
  barrierFailure: string;
  potentialConsequence: string;
  lifeSavingRule: string;
  priority: PriorityLevel;
  priorityScore: number;
}

export const StructuredIntelligence: React.FC<StructuredIntelligenceProps> = ({
  activity,
  hazard,
  barrierFailure,
  potentialConsequence,
  lifeSavingRule,
  priority,
  priorityScore,
}) => {
  const getPriorityBadge = (lvl: PriorityLevel) => {
    switch (lvl) {
      case "CRITICAL":
        return {
          bg: "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
          dot: "bg-rose-400",
        };
      case "HIGH":
        return {
          bg: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
          dot: "bg-amber-400",
        };
      case "MEDIUM":
        return {
          bg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          dot: "bg-blue-400",
        };
      case "LOW":
      default:
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          dot: "bg-emerald-400",
        };
    }
  };

  const pBadge = getPriorityBadge(priority);

  const cards = [
    {
      title: "Activity",
      value: activity || "General Operations",
      icon: Wrench,
      color: "text-blue-400",
      bg: "border-blue-500/20 bg-blue-950/10",
      tag: "Operational Task",
    },
    {
      title: "Hazard",
      value: hazard || "Unclassified Hazard",
      icon: AlertOctagon,
      color: "text-amber-400",
      bg: "border-amber-500/20 bg-amber-950/10",
      tag: "High Energy Source",
    },
    {
      title: "Barrier Failure",
      value: barrierFailure || "No Direct Barrier Breakdown",
      icon: ShieldX,
      color: "text-rose-400",
      bg: "border-rose-500/20 bg-rose-950/10",
      tag: "Control Breakdown",
    },
    {
      title: "Potential Consequence",
      value: potentialConsequence || "Occupational exposure",
      icon: Skull,
      color: "text-purple-400",
      bg: "border-purple-500/20 bg-purple-950/10",
      tag: "Severity Potential",
    },
    {
      title: "Life-Saving Rule",
      value: lifeSavingRule || "Process Safety / PPE",
      icon: Compass,
      color: "text-cyan-400",
      bg: "border-cyan-500/20 bg-cyan-950/10",
      tag: "IOGP Standard",
    },
    {
      title: "Priority Score",
      value: priority,
      scoreValue: `${(priorityScore * 100).toFixed(0)}/100`,
      icon: Gauge,
      color: pBadge.bg,
      isPriority: true,
      tag: "Review Escalation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-xl border ${c.bg || "border-slate-800 bg-slate-900/80"} flex flex-col justify-between transition-all hover:border-slate-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${c.color}`} />
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {c.title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                {c.tag}
              </span>
            </div>

            <div className="mt-1">
              {c.isPriority ? (
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${pBadge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${pBadge.dot}`} />
                    {priority}
                  </span>
                  <div className="text-right">
                    <span className="font-display text-lg font-bold text-slate-200">
                      {c.scoreValue}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      Risk Index
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  {c.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
