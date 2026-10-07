import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ModelMetricsTable } from '@/components/about/ModelMetricsTable';
import { ShieldCheck, AlertCircle, Info, Layers, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Title */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
            <span>Research Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Methodology, Scope & System Boundaries
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            RobustFloat is an environmental computer vision project designed for detecting surface floating waste across heterogeneous inland waterways.
          </p>
        </div>

        {/* Section 1: What the model does & does not do */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Detection Scope & Boundaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-zinc-200 rounded-card bg-slate-50/50 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-800" />
                <span>What RobustFloat detects</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-900">Single unified class:</strong> Predicts bounding boxes for the class <code className="font-mono text-teal-800 font-semibold">floating_waste</code>.
                </li>
                <li>
                  <strong className="text-slate-900">Water surface debris:</strong> Plastic bottles, bags, cans, foam fragments, food containers, and discarded packaging floating on water surfaces.
                </li>
                <li>
                  <strong className="text-slate-900">Small-object sensitivity:</strong> Employs a P2 high-resolution feature pyramid level specifically preserving distant or small debris signals.
                </li>
              </ul>
            </div>

            <div className="border border-zinc-200 rounded-card bg-slate-50/50 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>What RobustFloat does NOT do</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-900">No chemical water analysis:</strong> Does not measure water quality, chemical contamination, dissolved toxins, pathogens, or potable safety.
                </li>
                <li>
                  <strong className="text-slate-900">No submerged waste detection:</strong> Items submerged more than a few centimeters beneath murky or turbulent water cannot be resolved optically.
                </li>
                <li>
                  <strong className="text-slate-900">Not an absolute census:</strong> Bounding boxes are statistical inferences at a chosen confidence threshold, not ground-truth census counts.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Environmental Sensitivity */}
        <section className="border border-zinc-200 rounded-card bg-white p-6 space-y-3 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Environmental Conditions & Edge Cases</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inland water bodies differ radically in optical depth, color, and reflectance. Performance varies across several challenging conditions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-control border border-zinc-200 space-y-1">
              <span className="font-bold text-slate-900 block">Sun Glint & Specular Reflection</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct sunlight reflection on water ripples can trigger false alarms or obscure low-contrast debris boundaries.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-control border border-zinc-200 space-y-1">
              <span className="font-bold text-slate-900 block">High Turbidity & Sediment</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Sediment-heavy brown water reduces figure-ground contrast, making object boundaries harder to delineate.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-control border border-zinc-200 space-y-1">
              <span className="font-bold text-slate-900 block">Natural Vegetation & Froth</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Duckweed, lily pads, algae mats, and natural river froth can occasionally be flagged as candidate debris anomalies.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Model Metrics Benchmark */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Independent Benchmark Evaluation</h2>
          <p className="text-xs text-slate-600">
            Evaluation was conducted across two distinct benchmark datasets: <strong>TUD-GV</strong> (urban river and canal environments) and <strong>IWHR</strong> (inland hydrographic reservoir imagery).
          </p>
          <ModelMetricsTable />
        </section>

        {/* Section 4: Image Attribution & Dataset Rights */}
        <section className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800 block mb-0.5">Image & Dataset Attribution</span>
            <p>Sample photographs are real waterway captures licensed under Creative Commons.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
