import React, { useState } from "react";
import {
  Shield,
  RotateCcw,
  Server,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { PageId } from "../types";
import { setCustomBackendUrl, getCustomBackendUrl } from "../services/api";

interface HeaderProps {
  currentPage: PageId;
  totalReports: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  totalReports,
  onResetData,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState(getCustomBackendUrl() || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case "overview":
        return "Overview";
      case "analyze":
        return "Analyze Report";
      case "bulk":
        return "Bulk Analysis";
      case "analytics":
        return "Analytics";
      case "review":
        return "Human Review Queue";
    }
  };

  const handleSaveApiUrl = () => {
    setCustomBackendUrl(apiUrl);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowConfig(false);
    }, 1200);
  };

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Breadcrumb as required */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400">
          <span className="text-cyan-400 font-semibold font-display tracking-wider">
            SIF-GUARD
          </span>
          <span>/</span>
          <span className="text-slate-200 font-medium">{getPageTitle(currentPage)}</span>
        </div>

        {/* Live Active Reports Tag */}
        {totalReports > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
            {totalReports} {totalReports === 1 ? "Report Screened" : "Reports Screened"}
          </span>
        )}
      </div>

      {/* Center HSE Positioning Subtle Badge */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>AI-assisted first-level screening. Final safety decisions remain with qualified HSE professionals.</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Backend Connectivity Status */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          title="Backend API Connection Configuration"
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">
            {getCustomBackendUrl() ? "External Python API" : "Integrated Engine"}
          </span>
          <Settings2 className="w-3 h-3 text-slate-400" />
        </button>

        {/* Reset Session Data Button */}
        {totalReports > 0 && (
          <button
            onClick={onResetData}
            title="Reset to clean initial state (for demo restart)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset State</span>
          </button>
        )}
      </div>

      {/* Backend Configuration Modal Popup */}
      {showConfig && (
        <div className="absolute top-16 right-6 w-96 p-4 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              API Service Layer Configuration
            </h4>
            <button
              onClick={() => setShowConfig(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            The platform communicates with an isolated service layer. You can connect an external Python FastAPI backend directly or use the built-in industrial screening engine.
          </p>

          <div className="space-y-2 mb-4">
            <label className="text-[11px] font-mono text-slate-400 block">
              ENDPOINT URL (POST /api/v1/analyze)
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="/api/v1/analyze or http://localhost:8000/api/v1/analyze"
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setApiUrl("");
                setCustomBackendUrl(null);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 1200);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Reset to Internal
            </button>

            <button
              onClick={handleSaveApiUrl}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
