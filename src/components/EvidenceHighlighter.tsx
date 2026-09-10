import React from "react";
import { EvidenceItem, EvidenceType } from "../types";

interface EvidenceHighlighterProps {
  text: string;
  evidence: EvidenceItem[];
}

export const EvidenceHighlighter: React.FC<EvidenceHighlighterProps> = ({
  text,
  evidence,
}) => {
  const getBadgeStyle = (type: EvidenceType) => {
    switch (type) {
      case "Activity":
        return {
          highlight: "bg-blue-500/20 text-blue-200 border-b-2 border-blue-400 px-1 py-0.5 rounded",
          tagBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        };
      case "Hazard":
        return {
          highlight: "bg-amber-500/20 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded",
          tagBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
      case "Barrier Failure":
        return {
          highlight: "bg-rose-500/20 text-rose-200 border-b-2 border-rose-400 px-1 py-0.5 rounded font-semibold",
          tagBg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        };
      case "Risk Evidence":
      default:
        return {
          highlight: "bg-purple-500/20 text-purple-200 border-b-2 border-purple-400 px-1 py-0.5 rounded",
          tagBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        };
    }
  };

  // Build segments with non-overlapping matches
  interface MatchSpan {
    start: number;
    end: number;
    text: string;
    type: EvidenceType;
  }

  const spans: MatchSpan[] = [];
  const lowerText = text.toLowerCase();

  evidence.forEach((item) => {
    if (!item.text) return;
    const lowerTarget = item.text.toLowerCase().trim();
    let searchStart = 0;

    while (searchStart < lowerText.length) {
      const idx = lowerText.indexOf(lowerTarget, searchStart);
      if (idx === -1) break;

      const end = idx + lowerTarget.length;
      // Ensure no collision with already placed spans
      const overlaps = spans.some(
        (s) => Math.max(s.start, idx) < Math.min(s.end, end)
      );

      if (!overlaps) {
        spans.push({
          start: idx,
          end,
          text: text.substring(idx, end),
          type: item.type,
        });
      }
      searchStart = idx + 1;
    }
  });

  // Sort spans by start index
  spans.sort((a, b) => a.start - b.start);

  // Split into tokens
  const elements: React.ReactNode[] = [];
  let cursor = 0;

  spans.forEach((span, i) => {
    if (span.start > cursor) {
      elements.push(
        <span key={`txt-${cursor}`}>{text.substring(cursor, span.start)}</span>
      );
    }
    const style = getBadgeStyle(span.type);
    elements.push(
      <mark
        key={`match-${i}`}
        className={`inline-block mx-0.5 my-0.5 ${style.highlight}`}
        title={`Classified as: ${span.type}`}
      >
        <span>{span.text}</span>
        <span className="ml-1 text-[9px] font-mono px-1 py-0.2 rounded bg-slate-900/80 text-slate-300 border border-slate-700 select-none">
          {span.type}
        </span>
      </mark>
    );
    cursor = span.end;
  });

  if (cursor < text.length) {
    elements.push(<span key={`txt-end`}>{text.substring(cursor)}</span>);
  }

  return (
    <div className="space-y-3">
      {/* Evidence Tag Legend */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-slate-800">
        <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase font-semibold">
          Precursor Taxonomy:
        </span>
        {(["Activity", "Hazard", "Barrier Failure", "Risk Evidence"] as EvidenceType[]).map(
          (t) => {
            const style = getBadgeStyle(t);
            const count = evidence.filter((e) => e.type === t).length;
            return (
              <span
                key={t}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${style.tagBg} flex items-center gap-1.5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {t}
                {count > 0 && (
                  <span className="px-1 rounded bg-slate-900/60 font-bold">
                    {count}
                  </span>
                )}
              </span>
            );
          }
        )}
      </div>

      {/* Rendered Text with Highlights */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-sans text-sm md:text-base leading-relaxed text-slate-200 shadow-inner">
        {elements.length > 0 ? elements : <span>{text}</span>}
      </div>
    </div>
  );
};
