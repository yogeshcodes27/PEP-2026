import React from 'react';
import Link from 'next/link';
import { Droplets } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-zinc-200 py-10 mt-auto text-xs text-slate-600">
      <div className="max-w-content mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-control bg-teal-800 text-white flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">RobustFloat</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 text-slate-700">Research Release</span>
              </div>
              <p className="text-xs text-slate-500">
                Cross-domain floating-waste detection for heterogeneous inland waters.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-600">
            <Link href="/analyze" className="hover:text-teal-800 transition-colors">
              Analyze Image
            </Link>
            <Link href="/history" className="hover:text-teal-800 transition-colors">
              Session History
            </Link>
            <Link href="/about" className="hover:text-teal-800 transition-colors">
              Methodology & Benchmarks
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="max-w-xl">
            Evaluated on TUD-GV and IWHR test datasets. Detections are image-based predictions at a selected confidence threshold. This tool does not measure chemical water quality, pathogens, or drinking-water safety.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Client-side local analysis</span>
            <span>&bull;</span>
            <Link href="/about" className="hover:underline">Research limits</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
