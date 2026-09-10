import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Play,
  Download,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  HelpCircle,
  FileText,
} from "lucide-react";
import { AnalyzedReport } from "../types";
import { analyzeSafetyReport } from "../services/api";

interface BulkAnalysisPageProps {
  reports: AnalyzedReport[];
  onAddBulkReports: (newReports: AnalyzedReport[]) => void;
  onOpenReview: (report: AnalyzedReport) => void;
}

const SAMPLE_CSV_CONTENT = `Report Text
"During maintenance of a pump, the technician bypassed the lockout procedure and worked while the equipment was still energized."
"A housekeeping inspection found some loose packaging material near a walkway. The material was removed immediately and no person was exposed to the hazard."
"During maintenance inside a confined space, gas testing was not completed before entry and the required atmospheric monitoring was unavailable."
"Scaffolder observed unhooking both lanyards while transitioning between elevated platforms at 6 meters elevation."
"Rigger was standing directly beneath a 3-ton suspended pipe spool during crane slewing operations."
"Operator noted minor rust on secondary storage cabinet hinge during routine shift inspection."`;

export const BulkAnalysisPage: React.FC<BulkAnalysisPageProps> = ({
  reports,
  onAddBulkReports,
  onOpenReview,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sortBy, setSortBy] = useState<"sif" | "confidence" | "priority">("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.type.includes("csv")) {
      setStatusMsg("Please upload a valid .csv file.");
      return;
    }
    setCsvFile(file);
    setStatusMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  const parseCsvText = (csvString: string) => {
    // Simple robust CSV line splitter handling quotes
    const lines = csvString.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    // Check if first row is header
    const firstLine = lines[0].toLowerCase();
    const startIndex = firstLine.includes("report") || firstLine.includes("text") || firstLine.includes("description") ? 1 : 0;

    const extractedReports: string[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      // Strip leading/trailing quotes if whole line is enclosed
      if (line.startsWith('"') && line.endsWith('"')) {
        line = line.substring(1, line.length - 1);
      }
      extractedReports.push(line.replace(/""/g, '"'));
    }

    setParsedRows(extractedReports);
  };

  const handleLoadSample = () => {
    parseCsvText(SAMPLE_CSV_CONTENT);
    setCsvFile(new File([SAMPLE_CSV_CONTENT], "sih_oil_gas_incidents_sample.csv", { type: "text/csv" }));
    setStatusMsg("Loaded 6 sample incident reports ready for batch screening.");
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sif_guard_sample_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyzeBatch = async () => {
    if (parsedRows.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    const analyzedBatch: AnalyzedReport[] = [];

    for (let i = 0; i < parsedRows.length; i++) {
      try {
        const item = await analyzeSafetyReport(parsedRows[i]);
        analyzedBatch.push(item);
      } catch (e) {
        console.error("Batch item error:", e);
      }
      setProgress(Math.round(((i + 1) / parsedRows.length) * 100));
    }

    // Add directly to the SAME shared analyzed-results state used by Overview, Analytics and Review Queue
    onAddBulkReports(analyzedBatch);
    setIsProcessing(false);
    setParsedRows([]);
    setCsvFile(null);
    setStatusMsg(`Successfully screened and added ${analyzedBatch.length} reports to system intelligence.`);
  };

  // Sorting
  const sortedReports = [...reports].sort((a, b) => {
    let comp = 0;
    if (sortBy === "sif") {
      comp = (a.sifPotential === b.sifPotential ? 0 : a.sifPotential ? 1 : -1);
    } else if (sortBy === "confidence") {
      comp = a.confidence - b.confidence;
    } else if (sortBy === "priority") {
      const rank: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
      comp = (rank[a.priority] || 0) - (rank[b.priority] || 0);
    }
    return sortOrder === "desc" ? -comp : comp;
  });

  const handleExportCsv = () => {
    if (reports.length === 0) return;

    const headers = [
      "Report ID",
      "Report Text",
      "SIF Potential",
      "Confidence",
      "Activity",
      "Hazard",
      "Barrier Failure",
      "Potential Consequence",
      "Life-Saving Rule",
      "Priority",
      "Status",
    ];

    const rows = reports.map((r) => [
      `"${r.id}"`,
      `"${r.reportText.replace(/"/g, '""')}"`,
      r.sifPotential ? "YES" : "NO",
      (r.confidence * 100).toFixed(1) + "%",
      `"${r.activity}"`,
      `"${r.hazard}"`,
      `"${r.barrierFailure}"`,
      `"${r.potentialConsequence}"`,
      `"${r.lifeSavingRule}"`,
      r.priority,
      r.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sif_guard_screened_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = (column: "sif" | "confidence" | "priority") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
              Cohort Intelligence
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Batch Ingest Pipeline
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
            Bulk Report Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest structured incident batches into the unified precursor intelligence model
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSample}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sample CSV</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Load Demo Batch</span>
          </button>
        </div>
      </div>

      {/* CSV Upload Dropzone */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/50 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-cyan-500/10 border border-slate-700 group-hover:border-cyan-500/30 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 mx-auto mb-3 transition-colors">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-semibold text-slate-200 mb-1">
            {csvFile ? csvFile.name : "Upload CSV Safety Incident Batch"}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Drag and drop your incident report CSV or click to browse. Expects a single column containing free-text reports.
          </p>

          {parsedRows.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{parsedRows.length} reports parsed from file</span>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="text-xs underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Action button & Progress */}
        {parsedRows.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Batch Size: {parsedRows.length} items
              </span>
              <button
                onClick={() => {
                  setParsedRows([]);
                  setCsvFile(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="flex items-center gap-4">
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing: {progress}%</span>
                </div>
              )}

              <button
                onClick={handleAnalyzeBatch}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Analyze Reports</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Table Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Screened Results Table</span>
              <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                {reports.length} Total Records
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unified database synced across Overview, Analytics and Review Queue
            </p>
          </div>

          {reports.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Results</span>
              </button>
            </div>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <FileSpreadsheet className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-mono text-slate-400">
              No reports analyzed yet
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
              Upload a CSV file or load the sample batch above to populate the screening table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400 bg-slate-950/40">
                <tr>
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Report Text</th>
                  <th
                    onClick={() => toggleSort("sif")}
                    className="py-2.5 px-3 cursor-pointer hover:text-slate-200 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>SIF Potential</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("confidence")}
                    className="py-2.5 px-3 cursor-pointer hover:text-slate-200 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Confidence</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3">Activity</th>
                  <th className="py-2.5 px-3">Hazard</th>
                  <th className="py-2.5 px-3">Barrier Failure</th>
                  <th className="py-2.5 px-3">Life-Saving Rule</th>
                  <th
                    onClick={() => toggleSort("priority")}
                    className="py-2.5 px-3 cursor-pointer hover:text-slate-200 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Priority</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {sortedReports.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => onOpenReview(r)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-400 whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="py-3 px-3 max-w-sm">
                      <p className="text-slate-200 truncate text-xs" title={r.reportText}>
                        {r.reportText}
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          r.sifPotential
                            ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {r.sifPotential ? "YES" : "NO"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                      {(r.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {r.activity}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {r.hazard}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {r.barrierFailure}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {r.lifeSavingRule}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${
                          r.priority === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : r.priority === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
