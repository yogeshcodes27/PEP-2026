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
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider">
                    Computer Vision Research • Inland Waterway Ecological AI
                  </span>
                </div>

                {/* Typography Stack */}
                <div className="flex flex-col gap-1">
                  <h1 className="font-display text-display text-on-surface tracking-tight font-bold">
                    RobustFloat
                  </h1>
                  <p className="font-headline-lg text-headline-lg text-tertiary font-semibold tracking-tight">
                    Cross-Domain Floating-Waste Detection
                  </p>
                </div>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Detect floating waste in inland waters using a unified deep-learning model with object-type context and evidence-based analysis. Built to resist turbid flows, surface glare, and fluctuating riparian scales.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                  <Link
                    href="/analyze"
                    className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center gap-space-xs group"
                  >
                    <span>Analyze Image</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </Link>

                  <a
                    href="#pipeline"
                    className="px-space-lg py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container transition-all shadow-sm flex items-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      account_tree
                    </span>
                    <span>View How It Works</span>
                  </a>
                </div>

                {/* Quick Telemetry Chips Underneath CTA */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm w-full pt-space-md">
                  <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase">
                      Accuracy
                    </span>
                    <span className="font-headline-sm text-headline-sm font-semibold text-primary">
                      89.4%
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant truncate">
                      mAP@50 Cross-Basin
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase">
                      Resolution
                    </span>
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      640px
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Tiled Native Res
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase">
                      Latency
                    </span>
                    <span className="font-headline-sm text-headline-sm font-semibold text-tertiary">
                      &lt;45ms
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Edge Jetson Orin
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase">
                      Domain Corpus
                    </span>
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      Dual
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      TUD-GV + IWHR
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Optical Sensor Simulation Viewport */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative z-10">
                <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl p-space-xs">
                  {/* Glassmorphic Viewport Frame */}
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-inverse-surface group">
                    {/* Real Waterway Feed Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeXU7-Hs9h36oCswz0vnTe_dFpmwTHuSWScMCwrMFNcSogeA8_4azWKuK6dJQPQo2-LDD7eBEBk-Lbb1pe9_YTa6WD4eEjXLMPkvaKDophS_7xsF0ZoPjeRJM6w-SFgBZ2cHatck4iZpsEaadgAyBe2c6YdAUXjvAtkri0Ui7iP2U1Uc9AgnAoLTDo8irHN5UftEjWrxmdiZ8RCcTy8fh0fgpdeeUGxypnpan_thTwuVQt2ZUxGWk"
                      alt="Waterway optical sensor simulation"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Sensor Telemetry HUD Top Bar */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between p-space-xs rounded-md bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface">
                      <div className="flex items-center gap-space-xs">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-primary-fixed">
                          STREAM: CAM_CANAL_04B
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm font-label-mono-sm text-label-mono-sm">
                        <span className="text-surface-dim">EXP: 1/850s</span>
                        <span className="text-surface-dim">ISO: 120</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary font-bold">
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
                      <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-inverse-surface/90 backdrop-blur-md shadow-sm flex items-center gap-1">
                        <span className="font-label-mono-sm text-label-mono-sm text-primary-fixed font-semibold">
                          PET BOTTLE
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-inverse-on-surface">
                          94.7%
                        </span>
                      </div>
                    </div>

                    {/* Precision Detection Bounding Box 2 (Organic Driftwood) */}
                    <div className="absolute bottom-[18%] right-[12%] w-[24%] h-[22%] rounded-sm">
                      <div className="absolute inset-0 bg-secondary/10"></div>
                      <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-secondary-fixed"></span>
                      <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-secondary-fixed"></span>
                      <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-secondary-fixed"></span>
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-secondary-fixed"></span>
                      <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-inverse-surface/90 backdrop-blur-md shadow-sm flex items-center gap-1">
                        <span className="font-label-mono-sm text-label-mono-sm text-secondary-fixed font-semibold">
                          DRIFTWOOD
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-surface-dim">
                          78.1%
                        </span>
                      </div>
                    </div>

                    {/* Sensor Telemetry HUD Bottom Bar */}
                    <div className="absolute bottom-3 left-3 right-3 p-space-sm rounded-md bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface flex items-center justify-between">
                      <div className="flex items-center gap-space-md">
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-label-mono-sm text-surface-dim uppercase">
                            Inference
                          </span>
                          <span className="font-label-mono-md text-label-mono-md text-primary-fixed font-medium">
                            32.4ms (YOLO26s)
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-label-mono-sm text-surface-dim uppercase">
                            Context Prior
                          </span>
                          <span className="font-label-mono-md text-label-mono-md text-inverse-on-surface font-medium">
                            High Turbidity [0.82]
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high/20 font-label-mono-sm text-label-mono-sm text-primary-fixed">
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
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase tracking-wider font-semibold">
                    Technological Triad
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                    Core Algorithmic Innovations
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Overcoming reflection artifacts, partial submersion, and variable fluvial lighting through specialized multi-head architectures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Card 1: Cross-Domain Detection */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-lg group">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim/30 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">filter_center_focus</span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-medium">
                        YOLO26s-P2
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Cross-Domain Detection
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        One unified detector trained across heterogeneous inland-water datasets. Dynamically aligns feature distributions between turbid canals, calm reservoirs, and fast-flowing rivers.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm text-secondary">
                      <span>Domain Invariance</span>
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
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-lg group">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-tertiary-fixed-dim/30 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[24px]">category</span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-medium">
                        Probabilistic Material Prior
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Object-Type Context
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Estimate likely waste type using the auxiliary MARINE-DEBRIS640 classifier. Classifies chemical composition, buoyancy degradation, and physical buoyancy lifespan.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-on-surface">Rigid Plastic (PET)</span>
                      <span className="text-tertiary font-semibold">78%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full bg-tertiary rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm pt-1">
                      <span className="text-on-surface">Polystyrene Foam</span>
                      <span className="text-secondary font-semibold">16%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '16%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Evidence-Based Analysis */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-lg group">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-secondary-fixed-dim/40 flex items-center justify-center text-on-secondary-fixed">
                        <span className="material-symbols-outlined text-[24px]">psychology_alt</span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-medium">
                        GPT-OSS-120B / FAISS
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Evidence-Based Analysis
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Combine structured detection facts, vector retrieval, and LLM reasoning for grounded answers. Ingests municipal remediation manuals and hydraulic risk indexes.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">database</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                        FAISS (1024-dim)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[16px]">arrow_forward</span>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">memory</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                        Grounded Output
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM ARCHITECTURE VISUAL PIPELINE */}
          <div className="w-full bg-surface-container-low px-gutter-lg py-space-xl" id="pipeline">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col items-center text-center gap-space-xs max-w-2xl mx-auto">
                <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-wider font-semibold">
                  Sequential Computation
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  End-to-End Inference &amp; Reasoning Architecture
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  From uncompressed sensor ingestion to grounded mitigation dispatch. Each node operates with deterministic latency budgets.
                </p>
              </div>

              {/* Horizontal Flowchart Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-space-sm relative">
                {/* Node 1 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">STAGE 01</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                        0.8ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[28px]">file_upload</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Image Upload
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      640px normalizer, RGB sensor stream, affine tile tiling.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    Raw Payload
                  </span>
                </div>

                {/* Node 2 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">STAGE 02</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed-dim/30 text-on-primary-fixed-variant font-label-mono-sm text-label-mono-sm font-bold">
                        14.2ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[28px]">view_in_ar</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      YOLO26s-P2
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Unified multi-scale bounding box and surface confidence regression.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">
                    Coordinates [x,y,w,h]
                  </span>
                </div>

                {/* Node 3 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-tertiary">STAGE 03</span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant font-label-mono-sm text-label-mono-sm">
                        6.5ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-[28px]">biotech</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Type Classifier
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      MARINE-DEBRIS640 auxiliary head for polymer verification.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-medium">
                    Material Likelihood
                  </span>
                </div>

                {/* Node 4 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">STAGE 04</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                        4.1ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[28px]">schema</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      RAG Retrieval
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      DuckDB and FAISS cosine index queries for site-specific hydro metrics.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    Context Packets
                  </span>
                </div>

                {/* Node 5 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">STAGE 05</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                        18.4ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface text-[28px]">bolt</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      GPT-OSS-120B
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Groq LPU hardware accelerated prompt synthesizer &amp; fact syntheses.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-medium">
                    Synthesized Facts
                  </span>
                </div>

                {/* Node 6 */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:bg-surface-bright transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">STAGE 06</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed-dim/30 text-on-primary-fixed-variant font-label-mono-sm text-label-mono-sm font-bold">
                        1.0ms
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[28px]">task_alt</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Disposal Action
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Ecological remediation instructions delivered via API webhook.
                    </p>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">
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
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase tracking-wider font-semibold">
                    Empirical Verification
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                    Benchmark Comparisons &amp; Datasets
                  </h2>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm font-semibold">
                    TUD-GV Corpus
                  </span>
                  <span className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm font-semibold">
                    IWHR Hydro-Data
                  </span>
                </div>
              </div>

              {/* Comparative Matrix Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
                {/* Dataset Breakdown 1 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                          TUD-GV Benchmark
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-primary-fixed-dim/30 text-on-primary-fixed-variant font-bold">
                        Urban Canals
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      TUD-GV features extreme reflection noise, varied industrial embankment materials, and overcast weather conditions across Delft waterways.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-space-xs">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">RobustFloat (YOLO26s-P2)</span>
                      <span className="text-primary font-bold">91.8% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">Baseline YOLOv8s</span>
                      <span className="text-on-surface-variant">82.3% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">RT-DETR-R18</span>
                      <span className="text-on-surface-variant">84.1% mAP@50</span>
                    </div>
                  </div>
                </div>

                {/* Dataset Breakdown 2 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">water</span>
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                          IWHR Hydro Benchmark
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant font-bold">
                        Turbid Reservoirs
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      China Institute of Water Resources collection documenting high-silt river junctions, heavy wave chop, and partially submerged bio-waste.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-space-xs">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">RobustFloat (YOLO26s-P2)</span>
                      <span className="text-tertiary font-bold">87.1% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">Baseline YOLOv8s</span>
                      <span className="text-on-surface-variant">76.4% mAP@50</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary">RT-DETR-R18</span>
                      <span className="text-on-surface-variant">79.9% mAP@50</span>
                    </div>
                  </div>
                </div>

                {/* Unified Dual-Domain Composite Results */}
                <div className="p-space-lg rounded-xl bg-surface-container shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                          Cross-Domain Zero-Shot
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                        Generalization
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Model cross-evaluated on unseen aquatic nature reserve monitoring feeds without fine-tuning, demonstrating zero catastrophic forgetting.
                    </p>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-baseline justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">Combined Mean Score</span>
                      <span className="font-headline-md text-headline-md text-primary font-bold">89.4%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '89.4%' }}></div>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant pt-1">
                      +10.7% average margin over baseline edge architectures
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo CTA Banner */}
          <div className="w-full px-gutter-lg pb-space-xl">
            <div className="max-w-7xl mx-auto rounded-xl bg-inverse-surface text-inverse-on-surface p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-xl relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-2xl pointer-events-none"></div>
              <div className="flex flex-col gap-space-xs max-w-xl z-10">
                <span className="font-label-mono-sm text-label-mono-sm text-primary-fixed uppercase tracking-wider font-semibold">
                  Instant Ecological Audit
                </span>
                <h3 className="font-headline-lg text-headline-lg text-inverse-on-surface font-bold tracking-tight">
                  Ready to evaluate floating waste streams?
                </h3>
                <p className="font-body-md text-body-md text-surface-dim">
                  Upload waterway imagery or connect RTSP streams to receive instant semantic bounding boxes, material breakdowns, and remediation plans.
                </p>
              </div>
              <div className="flex items-center gap-space-md z-10">
                <Link
                  href="/analyze"
                  className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center gap-space-xs"
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
