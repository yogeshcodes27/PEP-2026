import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Top Ambient Glow Field */}
          <div className="relative w-full overflow-hidden px-gutter-lg pt-space-xl pb-space-lg">
            <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
            <div className="absolute top-10 right-0 w-[30rem] h-[30rem] rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>

            {/* Main Hero Grid Layout */}
            <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-space-xl pt-space-md">
              {/* Left Column: Typographic Narrative & Actions */}
              <div className="flex-1 flex flex-col items-start gap-space-md min-w-0 z-10">
                {/* Category Overline Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-medium text-slate-600">
                    Computer Vision Research • Inland Waterway Ecological AI
                  </span>
                </div>

                {/* Typography Stack */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight font-extrabold leading-[1.1]">
                    RobustFloat
                  </h1>
                  <p className="text-xl sm:text-2xl text-teal-800 font-semibold tracking-tight mt-1">
                    Cross-Domain Floating-Waste Detection
                  </p>
                </div>

                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Detect floating waste in inland waters using a unified deep-learning model with object-type context and evidence-based analysis. Built to resist turbid flows, surface glare, and fluctuating riparian scales.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href="/analyze"
                    className="px-5 py-2.5 rounded-lg rf-btn-primary text-sm flex items-center gap-2 group"
                  >
                    <span>Analyze Image</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </Link>

                  <a
                    href="#pipeline"
                    className="px-5 py-2.5 rounded-lg rf-btn-secondary text-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-slate-500 text-[18px]">
                      account_tree
                    </span>
                    <span>View How It Works</span>
                  </a>
                </div>

                {/* Quick Telemetry Chips Underneath CTA */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-4">
                  <div className="p-3.5 rounded-xl rf-card flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Accuracy
                    </span>
                    <span className="text-xl font-bold text-primary tracking-tight mt-0.5">
                      89.4%
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 truncate">
                      mAP@50 Cross-Basin
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl rf-card flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Resolution
                    </span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                      640px
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Tiled Native Res
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl rf-card flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Latency
                    </span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                      &lt;45ms
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Edge Jetson Orin
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl rf-card flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Domain Corpus
                    </span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                      Dual
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      TUD-GV + IWHR
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Optical Sensor Simulation Viewport */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative z-10">
                <div className="rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)] p-1.5">
                  {/* Viewport Frame */}
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 group border border-slate-800">
                    {/* Real Waterway Feed Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeXU7-Hs9h36oCswz0vnTe_dFpmwTHuSWScMCwrMFNcSogeA8_4azWKuK6dJQPQo2-LDD7eBEBk-Lbb1pe9_YTa6WD4eEjXLMPkvaKDophS_7xsF0ZoPjeRJM6w-SFgBZ2cHatck4iZpsEaadgAyBe2c6YdAUXjvAtkri0Ui7iP2U1Uc9AgnAoLTDo8irHN5UftEjWrxmdiZ8RCcTy8fh0fgpdeeUGxypnpan_thTwuVQt2ZUxGWk"
                      alt="Waterway optical sensor simulation"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Sensor Telemetry HUD Top Bar */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between p-2 rounded-md bg-slate-900/85 backdrop-blur-md text-white border border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                        <span className="text-xs font-semibold text-teal-300">
                          STREAM: CAM_CANAL_04B
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-300">EXP: 1/850s</span>
                        <span className="text-slate-300">ISO: 120</span>
                        <span className="px-2 py-0.5 rounded bg-teal-800 text-white font-medium">
                          58.2 FPS
                        </span>
                      </div>
                    </div>

                    {/* Precision Detection Bounding Box 1 (High Confidence Plastic) */}
                    <div className="absolute top-[32%] left-[26%] w-[38%] h-[28%] rounded-sm transition-all duration-300">
                      <div className="absolute inset-0 bg-primary/10"></div>
                      {/* Corner ticks */}
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-fixed"></span>
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-primary-fixed"></span>
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-primary-fixed"></span>
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-primary-fixed"></span>
                      {/* Tag badge */}
                      <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/60 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                        <span className="text-xs text-teal-300 font-semibold">
                          PET BOTTLE
                        </span>
                        <span className="text-xs text-white">
                          94.7%
                        </span>
                      </div>
                    </div>

                    {/* Precision Detection Bounding Box 2 (Organic Driftwood) */}
                    <div className="absolute bottom-[18%] right-[12%] w-[24%] h-[22%] rounded-sm">
                      <div className="absolute inset-0 bg-slate-400/10"></div>
                      <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-slate-300"></span>
                      <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-300"></span>
                      <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-slate-300"></span>
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-slate-300"></span>
                      <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/60 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                        <span className="text-xs text-slate-300 font-semibold">
                          DRIFTWOOD
                        </span>
                        <span className="text-xs text-slate-400">
                          78.1%
                        </span>
                      </div>
                    </div>

                    {/* Sensor Telemetry HUD Bottom Bar */}
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-md bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[11px]">
                            Inference
                          </span>
                          <span className="text-teal-300 font-medium">
                            32.4ms (YOLO26s)
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[11px]">
                            Context Prior
                          </span>
                          <span className="text-slate-200 font-medium">
                            High Turbidity [0.82]
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-teal-900/60 border border-teal-500/40 text-xs text-teal-300">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>RAG Validated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: THREE COMPACT CAPABILITY CARDS */}
          <div className="w-full px-gutter-lg py-space-xl">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                    Technological Triad
                  </span>
                  <h2 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
                    Core Algorithmic Innovations
                  </h2>
                </div>
                <p className="text-sm text-slate-600 max-w-md">
                  Overcoming reflection artifacts, partial submersion, and variable fluvial lighting through specialized multi-head architectures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Card 1: Cross-Domain Detection */}
                <div className="p-6 rounded-xl rf-card hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-6 group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800">
                        <span className="material-symbols-outlined text-[22px]">filter_center_focus</span>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 text-slate-700">
                        YOLO26s-P2
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg text-slate-900 font-semibold tracking-tight">
                        Cross-Domain Detection
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        One unified detector trained across heterogeneous inland-water datasets. Dynamically aligns feature distributions between turbid canals, calm reservoirs, and fast-flowing rivers.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg rf-subcard flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Domain Invariance</span>
                      <span className="text-primary font-semibold">+14.2% F1 Gain</span>
                    </div>
                    <svg className="w-full h-12 text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 240 48">
                      <path d="M0 38 C 40 38, 50 12, 90 12 C 130 12, 140 28, 180 28 C 210 28, 220 8, 240 8" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                      <path d="M0 38 C 40 38, 50 12, 90 12 C 130 12, 140 28, 180 28 C 210 28, 220 8, 240 8 L 240 48 L 0 48 Z" fill="currentColor" fillOpacity="0.08"></path>
                      <circle className="fill-primary" cx="90" cy="12" r="3"></circle>
                      <circle className="fill-primary" cx="240" cy="8" r="3"></circle>
                    </svg>
                  </div>
                </div>

                {/* Card 2: Object-Type Context */}
                <div className="p-6 rounded-xl rf-card hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-6 group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-800">
                        <span className="material-symbols-outlined text-[22px]">category</span>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 text-slate-700">
                        Probabilistic Material Prior
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg text-slate-900 font-semibold tracking-tight">
                        Object-Type Context
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Estimate likely waste type using the auxiliary MARINE-DEBRIS640 classifier. Classifies chemical composition, buoyancy degradation, and physical buoyancy lifespan.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg rf-subcard flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-medium">Rigid Plastic (PET)</span>
                      <span className="text-sky-700 font-semibold">78%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-800 font-medium">Polystyrene Foam</span>
                      <span className="text-slate-600 font-semibold">16%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: '16%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Evidence-Based Analysis */}
                <div className="p-6 rounded-xl rf-card hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-6 group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-[22px]">psychology_alt</span>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 text-slate-700">
                        GPT-OSS-120B / FAISS
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg text-slate-900 font-semibold tracking-tight">
                        Evidence-Based Analysis
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Combine structured detection facts, vector retrieval, and LLM reasoning for grounded answers. Ingests municipal remediation manuals and hydraulic risk indexes.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg rf-subcard flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-teal-700 text-[18px]">database</span>
                      <span className="text-xs text-slate-900 font-semibold">
                        FAISS (1024-dim)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">arrow_forward</span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sky-700 text-[18px]">memory</span>
                      <span className="text-xs text-slate-900 font-semibold">
                        Grounded Output
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM ARCHITECTURE VISUAL PIPELINE */}
          <div className="w-full bg-slate-50/70 border-y border-slate-200/70 px-gutter-lg py-16" id="pipeline">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              <div className="flex flex-col items-center text-center gap-1 max-w-2xl mx-auto">
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                  Sequential Computation
                </span>
                <h2 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
                  End-to-End Inference &amp; Reasoning Architecture
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  From uncompressed sensor ingestion to grounded mitigation dispatch. Each node operates with deterministic latency budgets.
                </p>
              </div>

              {/* Horizontal Flowchart Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
                {/* Node 1 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">STAGE 01</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium">
                        0.8ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[26px]">file_upload</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      Image Upload
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      640px normalizer, RGB sensor stream, affine tile tiling.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Raw Payload
                  </span>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-800">STAGE 02</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold">
                        14.2ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[26px]">view_in_ar</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      YOLO26s-P2
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      Unified multi-scale bounding box and surface confidence regression.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    Coordinates [x,y,w,h]
                  </span>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-sky-800">STAGE 03</span>
                      <span className="px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200/60 text-sky-800 text-xs font-semibold">
                        6.5ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-sky-700 text-[26px]">biotech</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      Type Classifier
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      MARINE-DEBRIS640 auxiliary head for polymer verification.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-sky-700">
                    Material Likelihood
                  </span>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">STAGE 04</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium">
                        4.1ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-600 text-[26px]">schema</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      RAG Retrieval
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      DuckDB and FAISS cosine index queries for site-specific hydro metrics.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Context Packets
                  </span>
                </div>

                {/* Node 5 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">STAGE 05</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium">
                        18.4ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-800 text-[26px]">bolt</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      GPT-OSS-120B
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      Groq LPU hardware accelerated prompt synthesizer &amp; fact syntheses.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    Synthesized Facts
                  </span>
                </div>

                {/* Node 6 */}
                <div className="p-4 rounded-xl rf-card flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-800">STAGE 06</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold">
                        1.0ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[26px]">task_alt</span>
                    <span className="text-base text-slate-900 font-semibold tracking-tight">
                      Disposal Action
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      Ecological remediation instructions delivered via API webhook.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    Dispatched Triage
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: BENCHMARK COMPARISONS & DATASETS */}
          <div className="w-full px-gutter-lg py-space-xl">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Empirical Verification
                  </span>
                  <h2 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
                    Benchmark Comparisons &amp; Datasets
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 text-xs font-medium shadow-2xs">
                    TUD-GV Corpus
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 text-xs font-medium shadow-2xs">
                    IWHR Hydro-Data
                  </span>
                </div>
              </div>

              {/* Comparative Matrix Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
                {/* Dataset Breakdown 1 */}
                <div className="p-6 rounded-xl rf-card flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                        <span className="text-base font-semibold text-slate-900">
                          TUD-GV Benchmark
                        </span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-50 border border-teal-200/60 text-teal-800">
                        Urban Canals
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      TUD-GV features extreme reflection noise, varied industrial embankment materials, and overcast weather conditions across Delft waterways.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">RobustFloat (YOLO26s-P2)</span>
                      <span className="text-teal-800 font-bold">91.8% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Baseline YOLOv8s</span>
                      <span className="text-slate-700 font-medium">82.3% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">RT-DETR-R18</span>
                      <span className="text-slate-700 font-medium">84.1% mAP@50</span>
                    </div>
                  </div>
                </div>

                {/* Dataset Breakdown 2 */}
                <div className="p-6 rounded-xl rf-card flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sky-700 text-[20px]">water</span>
                        <span className="text-base font-semibold text-slate-900">
                          IWHR Hydro Benchmark
                        </span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-50 border border-sky-200/60 text-sky-800">
                        Turbid Reservoirs
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      China Institute of Water Resources collection documenting high-silt river junctions, heavy wave chop, and partially submerged bio-waste.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">RobustFloat (YOLO26s-P2)</span>
                      <span className="text-sky-800 font-bold">87.1% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Baseline YOLOv8s</span>
                      <span className="text-slate-700 font-medium">76.4% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">RT-DETR-R18</span>
                      <span className="text-slate-700 font-medium">79.9% mAP@50</span>
                    </div>
                  </div>
                </div>

                {/* Unified Dual-Domain Composite Results */}
                <div className="p-6 rounded-xl rf-card flex flex-col justify-between gap-space-md bg-white">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
                        <span className="text-base font-semibold text-slate-900">
                          Cross-Domain Zero-Shot
                        </span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        Generalization
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Model cross-evaluated on unseen aquatic nature reserve monitoring feeds without fine-tuning, demonstrating zero catastrophic forgetting.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Combined Mean Score</span>
                      <span className="text-xl font-bold text-teal-800">89.4%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '89.4%' }}></div>
                    </div>
                    <span className="text-[11px] text-slate-500 pt-1">
                      +10.7% average margin over baseline edge architectures
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo CTA Banner */}
          <div className="w-full px-gutter-lg pb-space-xl">
            <div className="max-w-7xl mx-auto rounded-xl bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800 relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-2xl pointer-events-none"></div>
              <div className="flex flex-col gap-1.5 max-w-xl z-10">
                <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                  Instant Ecological Audit
                </span>
                <h3 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
                  Ready to evaluate floating waste streams?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Upload waterway imagery or connect RTSP streams to receive instant semantic bounding boxes, material breakdowns, and remediation plans.
                </p>
              </div>
              <div className="flex items-center gap-space-md z-10">
                <Link
                  href="/analyze"
                  className="px-6 py-2.5 rounded-lg rf-btn-primary font-medium text-sm flex items-center gap-2"
                >
                  <span>Launch Inference Console</span>
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
