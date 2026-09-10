export type LifeSavingRule =
  | "Energy Isolation"
  | "Confined Space"
  | "Line of Fire"
  | "Working at Height"
  | "Process Safety / PPE"
  | "Hot Work"
  | "Lifting Operations"
  | "Driving Safety"
  | "None Applicable";

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type EvidenceType = "Activity" | "Hazard" | "Barrier Failure" | "Risk Evidence";

export interface EvidenceItem {
  text: string;
  type: EvidenceType;
}

export interface AttributionToken {
  token: string;
  weight: number;
  class: "SIF" | "Non-SIF";
}

export interface ModelAttribution {
  engine: string;
  tokens?: AttributionToken[];
  rationale?: string;
}

export interface AnalyzedReport {
  id: string;
  reportText: string;
  sifPotential: boolean;
  confidence: number; // 0.00 to 1.00
  activity: string;
  hazard: string;
  barrierFailure: string;
  potentialConsequence: string;
  lifeSavingRule: LifeSavingRule | string;
  priority: PriorityLevel;
  priorityScore: number; // 0.00 to 1.00
  evidence: EvidenceItem[];
  status: "Needs Review" | "Reviewed";
  timestamp: number;
  reviewNotes?: string;
  reviewedBy?: string;
  modelAttribution?: ModelAttribution;
}

export interface RawAnalysisResponse {
  sif_potential: boolean;
  confidence: number;
  activity: string;
  hazard: string;
  barrier_failure: string;
  potential_consequence: string;
  life_saving_rule: string;
  priority: PriorityLevel;
  priority_score: number;
  evidence: EvidenceItem[];
  model_attribution?: ModelAttribution;
}

export type PageId = "overview" | "analyze" | "bulk" | "analytics" | "review";
