import React from "react";

interface ConfidenceRadialProps {
  confidence: number; // e.g. 0.94 or 94.2
  sifPotential: boolean;
  size?: number;
}

export const ConfidenceRadial: React.FC<ConfidenceRadialProps> = ({
  confidence,
  sifPotential,
  size = 120,
}) => {
  // Normalize to 0 - 100
  const normalized = confidence > 1 ? confidence : confidence * 100;
  const formattedPct = normalized.toFixed(1);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  const colorClass = sifPotential ? "#ef4444" : "#10b981";
  const glowClass = sifPotential
    ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
    : "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]";

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform overflow-visible"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className={`transition-all duration-1000 ease-out ${glowClass}`}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-xl font-bold tracking-tight text-slate-100">
            {formattedPct}%
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Model Conf.
          </span>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
          Classification Confidence
        </div>
        <p className="text-xs text-slate-300 mt-1 max-w-[200px] leading-relaxed">
          Posterior probability computed from precursor tokens and barrier feature attributions.
        </p>
      </div>
    </div>
  );
};
