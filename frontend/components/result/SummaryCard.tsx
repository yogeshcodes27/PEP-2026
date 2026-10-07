'use client';

import React from 'react';
import { Run } from '@/types';
import { Sliders, Info } from 'lucide-react';

interface SummaryCardProps {
  run: Run;
  confidenceThreshold: number;
  onThresholdChange: (value: number) => void;
  visibleCount: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  run,
  confidenceThreshold,
  onThresholdChange,
  visibleCount,
}) => {
  return (
    <div className="border border-slate-200/80 rounded-xl bg-white p-5 sm:p-6 space-y-5 shadow-xs">
      {/* 1. Primary Metric Display */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3.5">
          <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
            {visibleCount}
          </span>
          <div>
            <span className="text-sm sm:text-base font-bold text-slate-800 block leading-tight">
              visible floating-waste {visibleCount === 1 ? 'detection' : 'detections'}
            </span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">
              Detected at confidence &ge; {confidenceThreshold.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Confidence Threshold Slider Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="confidence-slider"
            className="font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Confidence threshold filter</span>
          </label>
          <span className="font-mono font-bold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-xs">
            &ge; {confidenceThreshold.toFixed(2)}
          </span>
        </div>

        <input
          id="confidence-slider"
          type="range"
          min="0.05"
          max="0.90"
          step="0.01"
          value={confidenceThreshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-200"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>0.05 (Higher recall)</span>
          <span>0.90 (Stricter precision)</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Lower thresholds identify more candidate boxes but may capture surface glare or natural froth. Higher thresholds reduce false detections but may omit faint or distant items.
        </p>
      </div>

      {/* 3. Important Interpretation Note (Subtle amber card with Lucide info icon) */}
      <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-950 flex items-start gap-2.5 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold text-amber-950 block">
            Important interpretation note:
          </strong>
          <p className="text-amber-900">
            This result reflects visible surface objects identified in this photograph. It does not measure water quality, chemical contamination, pathogens, or drinking-water safety.
          </p>
        </div>
      </div>
    </div>
  );
};
