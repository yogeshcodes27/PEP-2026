'use client';

import React from 'react';
import { Run } from '@/types';
import { TrustBadge } from '@/components/common/TrustBadge';
import { ShieldCheck, Info } from 'lucide-react';

interface TrustPanelProps {
  run: Run;
}

export const TrustPanel: React.FC<TrustPanelProps> = ({ run }) => {
  if (!run.reliability) {
    return (
      <div className="border border-zinc-200 rounded-card bg-white p-5 text-xs text-slate-500 shadow-2xs">
        <span className="font-bold text-slate-900 block mb-1">
          Evaluation Reliability
        </span>
        <span>Benchmark reliability data is not available for this session.</span>
      </div>
    );
  }

  const bands = run.reliability.bands || [];

  return (
    <div className="border border-zinc-200 rounded-card bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-800" />
          <h3 className="text-sm font-bold text-slate-900">
            Evaluation Precision & Reliability
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
          Held-Out Test Splits
        </span>
      </div>

      {/* Image Scene Check State */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 block">
          Domain distribution check:
        </span>
        <TrustBadge status={run.imageCheck} />
      </div>

      {/* Score-band Precision Table */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold text-slate-900 block">
          Measured Precision by Score Band:
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-slate-500 text-[11px] bg-slate-50">
                <th className="py-2 pr-3 pl-2 font-medium">CONFIDENCE BAND</th>
                <th className="py-2 px-3 font-medium">PRECISION</th>
                <th className="py-2 pl-3 font-medium">DATASET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bands.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 pr-3 pl-2 text-slate-800 font-medium">{b.range}</td>
                  <td className="py-1.5 px-3 font-bold text-teal-800">{b.precision.toFixed(1)}%</td>
                  <td className="py-1.5 pl-3 text-slate-500 font-sans">{b.dataset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          Measured on public TUD-GV and IWHR held-out test splits. Precision may vary under extreme turbidity, waves, or camera glint.
        </p>
      </div>

      {/* Permanent Scientific Disclaimer */}
      <div className="pt-3 border-t border-zinc-100 flex items-start gap-2 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-800" />
        <p className="leading-relaxed">
          Detections represent model predictions at the selected threshold, not an absolute census count. Some objects may be missed and false alarms may occur.
        </p>
      </div>
    </div>
  );
};
