import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewPage } from "./pages/OverviewPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { BulkAnalysisPage } from "./pages/BulkAnalysisPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ReviewQueuePage } from "./pages/ReviewQueuePage";
import { ReviewModal } from "./components/ReviewModal";
import { ReportDetailsModal } from "./components/ReportDetailsModal";
import { AnalyzedReport, PageId } from "./types";

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("overview");

  // Global shared state: Starts completely EMPTY as mandated by the instructions
  // "The dashboard must start with ZERO fake reports, zero fake graphs, and zero fake KPIs."
  const [analyzedReports, setAnalyzedReports] = useState<AnalyzedReport[]>([]);

  // Modal states
  const [reviewingReport, setReviewingReport] = useState<AnalyzedReport | null>(null);
  const [inspectingReport, setInspectingReport] = useState<AnalyzedReport | null>(null);

  // Single report analyzed handler
  const handleReportAnalyzed = (report: AnalyzedReport) => {
    setAnalyzedReports((prev) => [report, ...prev]);
  };

  // Bulk reports analyzed handler - added to the SAME shared state
  const handleAddBulkReports = (newBatch: AnalyzedReport[]) => {
    setAnalyzedReports((prev) => [...newBatch, ...prev]);
  };

  // Human HSE Review Save Handler
  const handleSaveReview = (
    reportId: string,
    notes: string,
    reviewedBy: string,
    status: "Reviewed" | "Needs Review",
    overrideSif?: boolean
  ) => {
    setAnalyzedReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            reviewNotes: notes,
            reviewedBy,
            status,
            sifPotential: overrideSif !== undefined ? overrideSif : r.sifPotential,
          };
        }
        return r;
      })
    );
  };

  const needsReviewCount = analyzedReports.filter((r) => r.status === "Needs Review").length;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        reviewCount={needsReviewCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header currentPage={currentPage} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === "overview" && (
              <OverviewPage
                reports={analyzedReports}
                onNavigate={setCurrentPage}
                onOpenReview={setReviewingReport}
              />
            )}

            {currentPage === "analyze" && (
              <AnalyzePage
                onReportAnalyzed={handleReportAnalyzed}
                onNavigate={setCurrentPage}
                onOpenReview={setReviewingReport}
              />
            )}

            {currentPage === "bulk" && (
              <BulkAnalysisPage
                reports={analyzedReports}
                onAddBulkReports={handleAddBulkReports}
                onOpenReview={setReviewingReport}
              />
            )}

            {currentPage === "analytics" && (
              <AnalyticsPage
                reports={analyzedReports}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === "review" && (
              <ReviewQueuePage
                reports={analyzedReports}
                onOpenReview={setReviewingReport}
                onOpenDetails={setInspectingReport}
              />
            )}
          </div>
        </main>
      </div>

      {/* Human HSE Review Modal */}
      <ReviewModal
        report={reviewingReport}
        onClose={() => setReviewingReport(null)}
        onSaveReview={handleSaveReview}
      />

      {/* Detailed Inspection Modal */}
      <ReportDetailsModal
        report={inspectingReport}
        onClose={() => setInspectingReport(null)}
        onOpenReview={(rep) => {
          setInspectingReport(null);
          setReviewingReport(rep);
        }}
      />
    </div>
  );
}

export default App;
