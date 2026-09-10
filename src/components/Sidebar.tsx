import React from "react";
import {
  ShieldAlert,
  FileSearch,
  Layers,
  BarChart3,
  ClipboardCheck,
  ShieldCheck,
  Activity,
  Cpu,
} from "lucide-react";
import { PageId } from "../types";

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  reviewQueueCount: number;
  totalReportsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  reviewQueueCount,
  totalReportsCount,
}) => {
  const navItems = [
    {
      id: "overview" as PageId,
      label: "Overview",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "analyze" as PageId,
      label: "Analyze Report",
      icon: FileSearch,
      badge: "Core",
    },
    {
      id: "bulk" as PageId,
      label: "Bulk Analysis",
      icon: Layers,
      badge: null,
    },
    {
      id: "analytics" as PageId,
      label: "Analytics",
      icon: Activity,
      badge: totalReportsCount > 0 ? String(totalReportsCount) : null,
    },
    {
      id: "review" as PageId,
      label: "Review Queue",
      icon: ClipboardCheck,
      badge: reviewQueueCount > 0 ? String(reviewQueueCount) : null,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-md select-none z-30">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
                SIF-GUARD
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Precursor Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.badgeColor ||
                      (isActive
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information & Safety Philosophy Card */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Safety Philosophy Card */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-semibold tracking-wide text-slate-200 uppercase">
              AI Screening • Human HSE Authority
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Autonomous precursor triage and evidence mapping. Final life-critical decisions remain with qualified safety personnel.
          </p>
        </div>

        {/* Engine Footer */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <span className="font-semibold text-slate-300">SIF-Guard</span>
              <span className="block text-[10px] text-slate-400">Precursor Intelligence Engine</span>
            </div>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            v1.0
          </span>
        </div>
      </div>
    </aside>
  );
};
