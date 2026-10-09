import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.02)] mt-margin-lg border-t border-outline-variant/20">
      <div className="w-full px-gutter-lg py-space-xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg pb-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                RobustFloat
              </span>
              <span className="font-body-sm text-body-sm text-secondary">
                — Cross-Domain Floating-Waste Detection in Inland Waters
              </span>
            </div>
            <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              Research Prototype • Next.js + FastAPI + YOLO26s-P2
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-md">
            <Link
              href="/system"
              className="font-label-mono-sm text-label-mono-sm text-tertiary hover:text-on-tertiary-fixed-variant transition-colors flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              arXiv:2502.xPaper
            </Link>
            <Link
              href="/system"
              className="font-label-mono-sm text-label-mono-sm text-tertiary hover:text-on-tertiary-fixed-variant transition-colors flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              Code &amp; Model Weights
            </Link>
            <Link
              href="/system"
              className="font-label-mono-sm text-label-mono-sm text-tertiary hover:text-on-tertiary-fixed-variant transition-colors flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[16px]">dataset</span>
              HydroWaste-10k Benchmark
            </Link>
          </div>
        </div>

        <div className="pt-space-md border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body-sm text-body-sm text-outline">
            Ecological Computer Vision &amp; Autonomous Aquatic Telemetry Laboratory © 2025. Released under Open Research License.
          </p>
          <div className="flex items-center gap-space-md">
            <span className="font-label-mono-sm text-label-mono-sm text-secondary">Edge FPS: 58.4</span>
            <span className="font-label-mono-sm text-label-mono-sm text-secondary">Precision: mAP@50 91.2%</span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">Cuda v12.4 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
