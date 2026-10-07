import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ModelMetricsTable } from '@/components/about/ModelMetricsTable';
import {
  ArrowRight,
  Crosshair,
  ShieldCheck,
  Tag,
  ExternalLink,
  Layers,
  FileSearch,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function LandingPage() {
  const workflowSteps = [
    {
      step: '01',
      title: 'Image Intake',
      subtitle: 'Waterway Photography',
      description:
        'Upload surface photography captured from riverbank, bridge, vessel, or aerial survey under natural lighting.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Detection',
      subtitle: 'P2 Multi-Scale Feature Map',
      description:
        'The YOLO26s-P2 detector predicts candidate bounding boxes specifically tuned for small and distant surface floating debris.',
      icon: Crosshair,
    },
    {
      step: '03',
      title: 'Evidence',
      subtitle: 'Benchmark Grounding',
      description:
        'Detections are calibrated against empirical precision bands from held-out TUD-GV and IWHR benchmark datasets.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Analysis',
      subtitle: 'Interactive Inspection',
      description:
        'Tune confidence thresholds live, inspect individual candidate boxes, and ask evidence-grounded research questions.',
      icon: FileSearch,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* 1. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Primary Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>Environmental Computer Vision Research</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Upload a waterway image and understand what visible floating waste the model detects.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                RobustFloat uses a cross-domain deep learning detector to identify visible floating waste in inland-water images across rivers, canals, and reservoirs.
              </p>

              {/* Research Scope Clarification Banner */}
              <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-control p-3 max-w-xl">
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="font-semibold text-slate-800">Scientific scope:</strong> Analyzes visible floating objects in image pixels. Does not measure chemical water quality, dissolved toxins, pathogens, or drinking-water safety.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control bg-teal-800 text-white text-xs sm:text-sm font-semibold hover:bg-teal-900 transition-colors shadow-xs"
              >
                <span>Analyze an image</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control border border-zinc-200 bg-white text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <span>Methodology & benchmarks</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Benchmark Sample Preview */}
          <div className="lg:col-span-5">
            <Link
              href="/result/run-danube-bottle"
              className="group block border border-zinc-200 rounded-card bg-slate-50/50 overflow-hidden shadow-xs hover:border-teal-700/60 hover:shadow-sm transition-all duration-200"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image
                  src="/images/sample-danube-bottle.webp"
                  alt="Danube River floating waste inspection preview"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Simulated Normalized Detection Overlay (Demonstrating Core UI) */}
                <div
                  className="absolute border-2 border-teal-700 bg-teal-900/10 pointer-events-none"
                  style={{ left: '38%', top: '44%', width: '11%', height: '10%' }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-teal-800 text-white leading-tight shadow-xs">
                    #1 (0.82)
                  </span>
                </div>

                <div
                  className="absolute border-2 border-teal-700/80 bg-teal-900/5 pointer-events-none"
                  style={{ left: '56%', top: '52%', width: '9%', height: '9%' }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-white text-slate-900 border border-zinc-300 leading-tight shadow-xs">
                    #2 (0.71)
                  </span>
                </div>

                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-white/95 text-slate-800 border border-zinc-200 shadow-xs">
                  Danube River &bull; TUD-GV Test Split
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between text-xs text-slate-600 border-t border-zinc-200 bg-white">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-teal-800 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                    YOLO26s-P2
                  </span>
                  <span>&bull;</span>
                  <span>Class: <code className="font-mono font-medium text-slate-800">floating_waste</code></span>
                </div>
                <span className="font-medium text-teal-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Open workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 2. Structured Workflow Strip: Image -> Detection -> Evidence -> Analysis */}
        <section className="space-y-6 pt-4 border-t border-zinc-200">
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-800">
              Pipeline Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Image &rarr; Detection &rarr; Evidence &rarr; Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every inference follows a verifiable, four-stage technical workflow connecting input pixels directly to evaluation-grounded answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {workflowSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="border border-zinc-200 rounded-card bg-slate-50/60 p-5 flex flex-col justify-between hover:border-teal-700/50 hover:bg-white transition-all duration-150"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-800">
                        {s.step}
                      </span>
                      <div className="w-8 h-8 rounded-control bg-white border border-zinc-200 flex items-center justify-center text-teal-800 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {s.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 mb-1.5">
                        {s.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Research Contribution Highlight: Unified Cross-Domain Detector */}
        <section className="space-y-6 pt-4 border-t border-zinc-200">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-800">
              Research Contribution
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              One unified detector evaluated across heterogeneous inland-water domains.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Existing models frequently degrade when transferred between urban waterways and open reservoirs. RobustFloat demonstrates robust generalization across two distinct public benchmarks without separate domain heads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Contribution 1 */}
            <div className="border border-zinc-200 rounded-card bg-white p-5 space-y-3 hover:border-zinc-300 transition-colors">
              <div className="w-8 h-8 rounded-control bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                <Crosshair className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                High-Resolution P2 Feature Pyramid
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporates an 80×80 high-resolution feature level (P2) specifically preserving small, partially submerged debris signals that are commonly discarded by standard P3–P5 backbones.
              </p>
              <div className="pt-2 border-t border-zinc-100">
                <span className="text-[11px] font-mono text-slate-500">
                  Target: Small & distant debris
                </span>
              </div>
            </div>

            {/* Contribution 2 */}
            <div className="border border-zinc-200 rounded-card bg-white p-5 space-y-3 hover:border-zinc-300 transition-colors">
              <div className="w-8 h-8 rounded-control bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Cross-Domain Benchmark Evaluation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained and evaluated across both TUD-GV (urban river/canal current) and IWHR (hydrographic reservoir surface) test splits, measuring cross-domain generalization under varied water turbidity.
              </p>
              <div className="pt-2 border-t border-zinc-100">
                <span className="text-[11px] font-mono text-slate-500">
                  Datasets: TUD-GV + IWHR
                </span>
              </div>
            </div>

            {/* Contribution 3 */}
            <div className="border border-zinc-200 rounded-card bg-white p-5 space-y-3 hover:border-zinc-300 transition-colors">
              <div className="w-8 h-8 rounded-control bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Transparent Single-Class Scope
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eliminates unsupported fine-grained classification claims in the core detector by focusing strictly on high-recall localization for the single class <code className="font-mono text-teal-800">floating_waste</code>.
              </p>
              <div className="pt-2 border-t border-zinc-100">
                <span className="text-[11px] font-mono text-slate-500">
                  Single class: floating_waste
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Empirical Evaluation Table */}
        <section className="space-y-5 pt-4 border-t border-zinc-200">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-800">
              Empirical Benchmarks
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Held-Out Test Set Performance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard object detection evaluation metrics computed on held-out test splits. Detections are predictions at a selected confidence threshold, not an absolute census count.
            </p>
          </div>

          <ModelMetricsTable />

          <div className="pt-1 flex items-center gap-4 text-xs">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-teal-800 hover:text-teal-900 font-medium underline"
            >
              <span>Review environmental sensitivity & boundary conditions</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* 5. Primary Action Section */}
        <section className="border border-zinc-200 rounded-card bg-slate-50/70 p-8 sm:p-12 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ready to analyze waterway imagery?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload an image from riverbank, bridge, vessel, or aerial capture to localize visible floating-waste objects.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-control bg-teal-800 text-white text-xs sm:text-sm font-semibold hover:bg-teal-900 transition-colors shadow-xs"
            >
              <span>Start analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
