import React, { useState } from "react";
import {
  FileSearch,
  Sparkles,
  Play,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers,
  Send,
  Loader2,
  BookmarkPlus,
  ExternalLink,
} from "lucide-react";
import { AnalyzedReport, PageId } from "../types";
import { analyzeSafetyReport } from "../services/api";
import { PipelineVisualizer } from "../components/PipelineVisualizer";
import { ConfidenceRadial } from "../components/ConfidenceRadial";
import { StructuredIntelligence } from "../components/StructuredIntelligence";
import { EvidenceHighlighter } from "../components/EvidenceHighlighter";
import { ExplainabilityPanel } from "../components/ExplainabilityPanel";

interface AnalyzePageProps {
  onReportAnalyzed: (report: AnalyzedReport) => void;
  onNavigate: (page: PageId) => void;
  onOpenReview: (report: AnalyzedReport) => void;
}

const DEMO_INPUTS = [
  {
    id: "demo1",
    title: "Demo 1: Lockout / Energized Pump",
    category: "Energy Isolation (SIF)",
    text: "During maintenance of a pump, the technician bypassed the lockout procedure and worked while the equipment was still energized.",
  },
  {
    id: "demo2",
    title: "Demo 2: Housekeeping / Walkway Obstacle",
    category: "Low Energy Observation (Non-SIF)",
    text: "A housekeeping inspection found some loose packaging material near a walkway. The material was removed immediately and no person was exposed to the hazard.",
  },
  {
    id: "demo3",
    title: "Demo 3: Confined Space Entry",
    category: "Toxic Atmosphere / Gas Test (SIF)",
    text: "During maintenance inside a confined space, gas testing was not completed before entry and the required atmospheric monitoring was unavailable.",
  },
];

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onReportAnalyzed,
  onNavigate,
  onOpenReview,
}) => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<number>(-1);
  const [latestResult, setLatestResult] = useState<AnalyzedReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Demo selection ONLY places text into input box - strictly follows the prompt rules
  const handleSelectDemo = (text: string) => {
    setInputText(text);
    setErrorMsg(null);
    setShowDemoSelector(false);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg("Please enter safety report text or select a Demo Input.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    // Progressive visual pipeline staging to communicate processing stages clearly
    setPipelineStage(0);
    const stageTimers: NodeJS.Timeout[] = [];

    stageTimers.push(setTimeout(() => setPipelineStage(1), 180));
    stageTimers.push(setTimeout(() => setPipelineStage(2), 360));
    stageTimers.push(setTimeout(() => setPipelineStage(3), 540));
    stageTimers.push(setTimeout(() => setPipelineStage(4), 720));
    stageTimers.push(setTimeout(() => setPipelineStage(5), 900));

    try {
      const result = await analyzeSafetyReport(inputText);

      // Complete all stages
      setTimeout(() => {
        setPipelineStage(5);
        setIsAnalyzing(false);
        setLatestResult(result);
        onReportAnalyzed(result);
      }, 1050);
    } catch (err: any) {
      stageTimers.forEach(clearTimeout);
      setIsAnalyzing(false);
      setPipelineStage(-1);
      setErrorMsg(err?.message || "Failed to analyze safety report via screening API.");
    }
  };

  const handleClear = () => {
    setInputText("");
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
              NLP Screening Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              POST /api/v1/analyze
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
            Analyze Safety Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Free-text Unsafe Act, Unsafe Condition, near-miss or incident report precursor screening
          </p>
        </div>

        {/* Quick Demo Selector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDemoSelector(!showDemoSelector)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Try Demo</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Demo Selector Dropdown Cards (strictly places text into input box only) */}
      {showDemoSelector && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Demo Inputs (Clicking only loads text into the editor)
            </span>
            <button
              onClick={() => setShowDemoSelector(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DEMO_INPUTS.map((demo) => (
              <div
                key={demo.id}
                onClick={() => handleSelectDemo(demo.text)}
                className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      Demo Input
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {demo.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mb-1.5 group-hover:text-cyan-300">
                    {demo.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    "{demo.text}"
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Load into editor</span>
                  <Send className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Textarea Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-cyan-400" />
            Report Free-Text Input
          </label>
          <div className="flex items-center gap-3">
            {inputText && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            )}
            <span className="text-[11px] font-mono text-slate-400">
              {inputText.length} characters
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Enter an Unsafe Act, Unsafe Condition, near-miss or incident report..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans leading-relaxed shadow-inner resize-y min-h-[110px]"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>FastAPI/Express Service Target:</span>
            <code className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-[11px] text-cyan-400 border border-slate-800">
              POST /api/v1/analyze
            </code>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDemoSelector(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Demo Input</span>
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] disabled:shadow-none flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Screening Precursors...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Analyze Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Section */}
      <PipelineVisualizer
        activeStage={pipelineStage}
        isProcessing={isAnalyzing}
      />

      {/* Analysis Result Section */}
      {latestResult && (
        <div className="space-y-6 pt-2">
          {/* Prominent Top Result Banner */}
          <div
            className={`p-6 rounded-2xl border ${
              latestResult.sifPotential
                ? "bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-900/90 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
                : "bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900/90 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            } transition-all duration-300`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* SIF Potential Display */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl ${
                    latestResult.sifPotential
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  }`}
                >
                  {latestResult.sifPotential ? (
                    <AlertTriangle className="w-8 h-8 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                      Screening Outcome
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {latestResult.id}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
                      SIF POTENTIAL:
                    </h3>
                    <span
                      className={`font-display text-3xl md:text-4xl font-extrabold tracking-wider ${
                        latestResult.sifPotential
                          ? "text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                          : "text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      }`}
                    >
                      {latestResult.sifPotential ? "YES" : "NO"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {latestResult.sifPotential
                      ? "High-energy hazard & critical barrier breakdown detected. High severity potential."
                      : "Routine low-energy finding. No immediate life-critical precursor flagged."}
                  </p>
                </div>
              </div>

              {/* Confidence Radial & Metrics */}
              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <ConfidenceRadial
                  confidence={latestResult.confidence}
                  sifPotential={latestResult.sifPotential}
                  size={105}
                />

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onOpenReview(latestResult)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>HSE Sign-off</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate("overview")}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
                  >
                    View in Overview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Structured Safety Intelligence Cards */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Structured Safety Intelligence
            </h3>
            <StructuredIntelligence
              activity={latestResult.activity}
              hazard={latestResult.hazard}
              barrierFailure={latestResult.barrierFailure}
              potentialConsequence={latestResult.potentialConsequence}
              lifeSavingRule={latestResult.lifeSavingRule}
              priority={latestResult.priority}
              priorityScore={latestResult.priorityScore}
            />
          </div>

          {/* Explainability Section */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Why did the system flag this report?
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Extracted evidence phrases grounded in the original report narrative
              </p>
            </div>

            <EvidenceHighlighter
              text={latestResult.reportText}
              evidence={latestResult.evidence}
            />
          </div>

          {/* AI Explanation & LIME/SHAP Attribution */}
          <ExplainabilityPanel
            sifPotential={latestResult.sifPotential}
            attribution={latestResult.modelAttribution}
            priority={latestResult.priority}
          />
        </div>
      )}
    </div>
  );
};
