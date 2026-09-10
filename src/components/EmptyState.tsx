import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No reports analyzed yet",
  description = "Analyze a single safety report or upload a CSV dataset to activate precursor screening intelligence.",
  icon: Icon = Inbox,
  actionText,
  onAction,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm ${
        compact ? "p-6" : "p-10"
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>

      <h4 className="font-display text-sm font-semibold text-slate-300 tracking-wide">
        {title}
      </h4>

      {description && (
        <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
