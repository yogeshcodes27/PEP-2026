'use client';

import React, { useState } from 'react';
import { Run } from '@/types';
import { TrustBadge } from '@/components/common/TrustBadge';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Hash,
  Clock,
  Maximize2,
  Filter,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface TechnicalDetailsProps {
  run: Run;
  confidenceThreshold: number;
  visibleCount: number;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
  run,
  confidenceThreshold,
  visibleCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const bands = run.reliability?.bands || [];

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">
              Technical details
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Model specifications, inference runtime, and benchmark evaluation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <span className="hidden sm:inline-block">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-5 text-xs font-mono">
          {/* 1. Telemetry Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Model Name */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>Model Architecture</span>
              </span>
              <span className="font-bold text-slate-900 block truncate">
                {run.modelVersion}
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                Single-class cross-domain detector
              </span>
            </div>

            {/* Image Dimensions */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                <span>Image Dimensions</span>
              </span>
              <span className="font-bold text-slate-900 block">
                {run.imageWidth} &times; {run.imageHeight} px
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                Normalized coordinate mapping
              </span>
            </div>

            {/* Inference Latency */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Inference Runtime</span>
              </span>
              <span className="font-bold text-slate-900 block">
                {run.inferenceMs} ms
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                Forward pass latency
              </span>
            </div>

            {/* Stored Candidates */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-400" />
                <span>Stored Candidates</span>
              </span>
              <span className="font-bold text-slate-900 block">
                {run.detections.length} candidate boxes
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                Cached at raw conf &ge; 0.05
              </span>
            </div>

            {/* Active Threshold */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Active Threshold</span>
              </span>
              <span className="font-bold text-blue-700 block">
                &ge; {confidenceThreshold.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                {visibleCount} active of {run.detections.length} total
              </span>
            </div>

            {/* Target Class */}
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-sans font-medium flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span>Target Class</span>
              </span>
              <span className="font-bold text-slate-900 block">
                floating_waste
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">
                Single unified class
              </span>
            </div>
          </div>

          {/* 2. Secondary Benchmark Reliability & Precision Table */}
          {run.reliability && (
            <div className="pt-4 border-t border-slate-200/80 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Evaluation Precision & Reliability
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Held-Out Test Splits
                </span>
              </div>

              {/* Domain distribution check */}
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">
                  Domain distribution check:
                </span>
                <TrustBadge status={run.imageCheck} />
              </div>

              {/* Precision Bands Table */}
              {bands.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Measured Precision by Score Band:
                  </span>
                  <div className="overflow-x-auto rounded-lg border border-slate-200/80 bg-white">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50/80">
                          <th className="py-2 pr-3 pl-3 font-medium">CONFIDENCE BAND</th>
                          <th className="py-2 px-3 font-medium">PRECISION</th>
                          <th className="py-2 pl-3 font-medium">DATASET</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bands.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-1.5 pr-3 pl-3 text-slate-800 font-medium">{b.range}</td>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{b.precision.toFixed(1)}%</td>
                            <td className="py-1.5 pl-3 text-slate-500 font-sans">{b.dataset}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                    Measured on public TUD-GV and IWHR held-out test splits. Precision may vary under extreme turbidity, waves, or camera glint.
                  </p>
                </div>
              )}

              {/* Permanent Scientific Disclaimer */}
              <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-500">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <p className="leading-relaxed">
                  Detections represent model predictions at the selected threshold, not an absolute census count. Some objects may be missed and false alarms may occur.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
