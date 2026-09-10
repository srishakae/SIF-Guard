import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  variant?: "neutral" | "danger" | "safe" | "warning";
  isEmpty?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = "neutral",
  isEmpty = false,
}) => {
  const getTheme = () => {
    switch (variant) {
      case "danger":
        return {
          glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
          border: "border-rose-500/30",
          iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          valColor: "text-rose-400",
        };
      case "safe":
        return {
          glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          border: "border-emerald-500/30",
          iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          valColor: "text-emerald-400",
        };
      case "warning":
        return {
          glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          border: "border-amber-500/30",
          iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          valColor: "text-amber-400",
        };
      case "neutral":
      default:
        return {
          glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]",
          border: "border-slate-800",
          iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
          valColor: "text-slate-100",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative p-5 rounded-2xl bg-slate-900/80 border ${
        isEmpty ? "border-slate-800/80 opacity-80" : theme.border
      } backdrop-blur-sm transition-all duration-300 group ${theme.glow}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${theme.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={`font-display text-3xl font-bold tracking-tight ${
            isEmpty ? "text-slate-500" : theme.valColor
          }`}
        >
          {value}
        </span>
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-400 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
