import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white mt-margin-lg border-t border-slate-200/80 shadow-[0_-1px_3px_0_rgba(15,23,42,0.02)]">
      <div className="w-full px-gutter-lg py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg pb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base text-slate-900 font-bold tracking-tight">
                RobustFloat
              </span>
              <span className="text-xs text-slate-500">
                — Cross-Domain Floating-Waste Detection in Inland Waters
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Research Prototype • Next.js + FastAPI + YOLO26s-P2
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/system"
              className="text-xs font-medium text-slate-600 hover:text-teal-800 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              arXiv:2502.xPaper
            </Link>
            <Link
              href="/system"
              className="text-xs font-medium text-slate-600 hover:text-teal-800 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              Code &amp; Model Weights
            </Link>
            <Link
              href="/system"
              className="text-xs font-medium text-slate-600 hover:text-teal-800 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">dataset</span>
              HydroWaste-10k Benchmark
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            Ecological Computer Vision &amp; Autonomous Aquatic Telemetry Laboratory © 2025. Released under Open Research License.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">Edge FPS: 58.4</span>
            <span className="text-slate-500">Precision: mAP@50 91.2%</span>
            <span className="text-teal-800 font-medium">Cuda v12.4 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
