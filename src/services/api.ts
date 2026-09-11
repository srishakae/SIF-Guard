import { AnalyzedReport, RawAnalysisResponse } from "../types";

let customBackendUrl: string | null = "https://sif-guard-backend.onrender.com/api/v1/analyze";

export function setCustomBackendUrl(url: string | null) {
  customBackendUrl = url && url.trim() ? url.trim() : null;
}

export function getCustomBackendUrl(): string | null {
  return customBackendUrl;
}

let reportCounter = 1;

export async function analyzeSafetyReport(reportText: string): Promise<AnalyzedReport> {
  const endpoint = customBackendUrl || "/api/v1/analyze";
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      report_text: reportText,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server returned error status ${response.status}`);
  }

  const data: RawAnalysisResponse = await response.json();

  const id = `REP-${new Date().getFullYear()}-${String(reportCounter++).padStart(4, "0")}`;
  
  const analyzedReport: AnalyzedReport = {
    id,
    reportText,
    sifPotential: data.sif_potential,
    confidence: data.confidence,
    activity: data.activity,
    hazard: data.hazard,
    barrierFailure: data.barrier_failure,
    potentialConsequence: data.potential_consequence,
    lifeSavingRule: data.life_saving_rule,
    priority: data.priority,
    priorityScore: data.priority_score,
    evidence: data.evidence || [],
    status: data.sif_potential || data.priority === "HIGH" || data.priority === "CRITICAL" ? "Needs Review" : "Reviewed",
    timestamp: Date.now(),
    modelAttribution: data.model_attribution,
  };

  return analyzedReport;
}

export async function checkBackendHealth(): Promise<{ status: string; service: string; gemini_enabled: boolean }> {
  const endpoint = customBackendUrl ? `${customBackendUrl.replace(/\/api\/v1\/analyze.*$/, "")}/api/v1/health` : "/api/v1/health";
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (e) {
    return {
      status: "offline",
      service: "Client Fallback Mode",
      gemini_enabled: false,
    };
  }
}
