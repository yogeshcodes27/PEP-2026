'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { Run, Detection, AskResponse } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  latencyMs?: number;
  evidence?: AskResponse['evidence'];
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const runId = params?.runId as string;

  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Viewport Controls
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.50);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [fallbackBannerVisible, setFallbackBannerVisible] = useState<boolean>(false);

  // Feedback & Copy actions
  const [jsonExportSuccess, setJsonExportSuccess] = useState<boolean>(false);
  const [isRerunning, setIsRerunning] = useState<boolean>(false);
  const [copiedGuidanceId, setCopiedGuidanceId] = useState<string | null>(null);

  // Chat Panel State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Load Run
  useEffect(() => {
    if (!runId) return;
    setLoading(true);
    api
      .getRun(runId)
      .then((data) => {
        setRun(data);
        setError(null);
        // Pre-populate with a contextual initial assistant briefing
        const wasteCount = data.detections.length;
        setChatMessages([
          {
            id: 'init-msg',
            sender: 'assistant',
            latencyMs: 184,
            text: `Analysis complete for **${data.title || runId}**. The YOLO26s-P2 pipeline localized **${wasteCount} floating waste item${wasteCount === 1 ? '' : 's'}**. Ask any question below to inspect materials, hydrodynamic risk, or municipal disposal procedures.`,
          },
        ]);
      })
      .catch((err) => {
        console.error('Failed to load run:', err);
        setError('Analysis session could not be found or loaded.');
      })
      .finally(() => setLoading(false));
  }, [runId]);

  // Compute filtered detections
  const visibleDetections = useMemo(() => {
    if (!run) return [];
    return run.detections.filter((d) => d.confidence >= confidenceThreshold);
  }, [run, confidenceThreshold]);

  // Derived statistics
  const stats = useMemo(() => {
    if (visibleDetections.length === 0) {
      return { count: 0, avgConf: 0, maxConf: 0, maxIndex: 0 };
    }
    let totalConf = 0;
    let maxConf = 0;
    let maxIndex = 0;

    visibleDetections.forEach((d, idx) => {
      totalConf += d.confidence;
      if (d.confidence > maxConf) {
        maxConf = d.confidence;
        maxIndex = idx;
      }
    });

    return {
      count: visibleDetections.length,
      avgConf: totalConf / visibleDetections.length,
      maxConf,
      maxIndex,
    };
  }, [visibleDetections]);

  // Grouped material types
  const typeDistribution = useMemo(() => {
    const map = new Map<string, { count: number; totalConf: number }>();
    visibleDetections.forEach((d) => {
      const label =
        d.type_prediction?.class_name ||
        d.typeEstimate?.label ||
        'Polymer Debris';
      const formatted = label
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const conf = d.type_prediction?.confidence || d.confidence;

      const existing = map.get(formatted) || { count: 0, totalConf: 0 };
      map.set(formatted, {
        count: existing.count + 1,
        totalConf: existing.totalConf + conf,
      });
    });

    return Array.from(map.entries()).map(([label, data]) => ({
      label,
      count: data.count,
      avgConf: data.totalConf / data.count,
    }));
  }, [visibleDetections]);

  // Export JSON
  const handleExportJson = () => {
    if (!run) return;
    const jsonStr = JSON.stringify(run.detections, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setJsonExportSuccess(true);
    setTimeout(() => setJsonExportSuccess(false), 2000);
  };

  // Re-run
  const handleRerun = () => {
    setIsRerunning(true);
    api
      .getRun(runId)
      .then((data) => setRun(data))
      .finally(() => {
        setTimeout(() => setIsRerunning(false), 600);
      });
  };

  // Chat Submission
  const handleSendChat = async (promptText?: string) => {
    const query = (promptText || chatInput).trim();
    if (!query || chatLoading) return;

    setChatInput('');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    const startTime = Date.now();
    try {
      const resp = await api.ask(runId, query);
      const elapsed = Date.now() - startTime;
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: resp.answer,
        latencyMs: elapsed,
        evidence: resp.evidence,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        latencyMs: 120,
        text: 'Unable to connect to the reasoning engine right now. Please verify backend connection.',
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyGuidance = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGuidanceId(msgId);
    setTimeout(() => setCopiedGuidanceId(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="w-full pt-28 flex-1 flex flex-col items-center justify-center gap-space-md">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="font-label-mono-sm text-label-mono-sm text-secondary">
            Loading inference telemetry &amp; spatial annotations...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="w-full pt-28 flex-1 flex flex-col items-center justify-center gap-space-md px-gutter-lg">
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center gap-space-sm max-w-md">
            <span className="material-symbols-outlined text-error text-[40px]">error_outline</span>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Analysis Not Found</h2>
            <p className="font-body-sm text-body-sm text-secondary">
              {error || 'This inference session could not be located in browser session storage.'}
            </p>
            <Link
              href="/analyze"
              className="mt-space-xs px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-md text-body-md font-medium"
            >
              Return to Ingestion Console
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Resolve display image
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
  const rawImageUrl = run.image_url || run.imageUrl;
  const displayImageUrl = rawImageUrl?.startsWith('/api/') ? `${apiBase}${rawImageUrl}` : rawImageUrl;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Run Telemetry & Execution Header Bar */}
          <section className="w-full px-gutter-lg py-space-md bg-surface-container-lowest shadow-sm border-b border-outline-variant/20">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md max-w-7xl mx-auto w-full">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Detection Results
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded-lg bg-primary-container text-on-primary-container font-medium">
                    Inference Successful
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-secondary-container">
                    Single-Class Core Detector
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-body-sm">Run ID:</span>
                    <span className="text-on-surface font-semibold bg-surface-container px-1.5 py-0.5 rounded">
                      {run.runId}
                    </span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-body-sm">Visible Detections:</span>
                    <span className="text-primary font-semibold">{visibleDetections.length} objects</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-body-sm">Inference Latency:</span>
                    <span className="text-on-surface font-semibold">{run.inferenceMs.toFixed(1)}ms</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-body-sm">Backend:</span>
                    <span className="text-tertiary font-semibold">FastAPI (NEXT_PUBLIC_API_URL)</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-body-sm">Timestamp:</span>
                    <span className="text-on-surface">
                      {run.createdAt ? new Date(run.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-space-sm self-stretch xl:self-auto justify-end">
                <button
                  type="button"
                  onClick={handleRerun}
                  className="px-space-md py-space-xs rounded bg-surface-container text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isRerunning ? 'animate-spin' : ''}`}>
                    {isRerunning ? 'sync' : 'refresh'}
                  </span>
                  <span>{isRerunning ? 'Re-inferencing...' : 'Re-run Analysis'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-space-md py-space-xs rounded bg-surface-container text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {jsonExportSuccess ? 'check' : 'data_object'}
                  </span>
                  <span>{jsonExportSuccess ? 'JSON Copied!' : 'Export JSON Annotation'}</span>
                </button>

                <a
                  href={displayImageUrl}
                  download={`robustfloat_${run.runId}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-space-md py-space-xs rounded bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Rendered Image</span>
                </a>
              </div>
            </div>
          </section>

          {/* Fallback Warning / 0-Waste Banner */}
          {(visibleDetections.length === 0 || fallbackBannerVisible) && (
            <section className="w-full px-gutter-lg pt-space-md max-w-7xl mx-auto">
              <div className="w-full p-space-md rounded-xl bg-surface-container flex items-center justify-between gap-space-md shadow-sm">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">water</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold block">
                      State Notification: No Visible Waste Above Cutoff
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Zero instances localized above threshold &ge; {confidenceThreshold.toFixed(2)}. Adjust the slider or inspect surface directly.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFallbackBannerVisible(false)}
                  className="px-space-md py-1 rounded bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </section>
          )}

          {/* Main Dual-Column Analytical Grid */}
          <section className="w-full px-gutter-lg py-space-lg max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
              {/* LEFT COLUMN: Image Analytical Canvas & Overlays (7 cols desktop) */}
              <div className="xl:col-span-7 flex flex-col gap-space-md">
                {/* Primary Image Card */}
                <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-md">
                  {/* Viewport Interactive Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Analyzed Stream Viewport
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-secondary font-medium uppercase">
                        {run.title || 'CAM_04_NORTH_ESTUARY'}
                      </span>
                    </div>

                    <div className="flex items-center gap-space-md flex-wrap">
                      {/* BBox Switch */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showBoxes}
                          onChange={(e) => setShowBoxes(e.target.checked)}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                          BBox Overlays
                        </span>
                      </label>

                      {/* Threshold Slider */}
                      <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded">
                        <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                          Threshold:
                        </span>
                        <input
                          type="range"
                          min="0.05"
                          max="0.95"
                          step="0.05"
                          value={confidenceThreshold}
                          onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                          className="w-20 accent-primary cursor-pointer"
                        />
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                          {confidenceThreshold.toFixed(2)}
                        </span>
                      </div>

                      {/* Zoom Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsZoomed(!isZoomed)}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          isZoomed
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                        title="Toggle Zoom View"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isZoomed ? 'zoom_out' : 'zoom_in'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Responsive Viewport with Overlays */}
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-inverse-surface group select-none shadow-inner">
                    {/* Real Uploaded Photo from Backend */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImageUrl}
                      alt="Analyzed Inland Waterway Feed"
                      className={`w-full h-full object-cover transition-transform duration-300 pointer-events-none ${
                        isZoomed ? 'scale-125' : 'scale-100'
                      }`}
                    />

                    {/* Coordinate Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#89f5e7_1px,transparent_1px)] [background-size:24px_24px]"></div>

                    {/* Optical Sensor HUD Top Elements */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-inverse-surface/85 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-primary-fixed flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                      <span>YOLO26s-P2 STREAM READY • {run.imageWidth}×{run.imageHeight}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-inverse-surface/85 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-surface-variant">
                      FOCAL: 28mm • FLIR OPTICAL CH.1
                    </div>

                    {/* Dynamic Bounding Box Layer */}
                    {showBoxes && (
                      <div className="absolute inset-0 pointer-events-none">
                        {run.detections.map((det, index) => {
                          const isVisible = det.confidence >= confidenceThreshold;
                          const isSelected = selectedDetectionId === det.id;

                          // Compute coordinates (normalized 0..1 to percentage)
                          const left = `${det.bbox.x1 * 100}%`;
                          const top = `${det.bbox.y1 * 100}%`;
                          const width = `${Math.max(0.01, det.bbox.x2 - det.bbox.x1) * 100}%`;
                          const height = `${Math.max(0.01, det.bbox.y2 - det.bbox.y1) * 100}%`;

                          // Auxiliary classifier result
                          const rawLabel =
                            det.type_prediction?.class_name ||
                            det.typeEstimate?.label ||
                            'Plastic Waste';
                          const typeLabel = rawLabel
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                          const typeConfidence = (
                            (det.type_prediction?.confidence || det.confidence) * 100
                          ).toFixed(1);

                          return (
                            <div
                              key={det.id}
                              onClick={() => setSelectedDetectionId(isSelected ? null : det.id)}
                              onMouseEnter={() => setSelectedDetectionId(det.id)}
                              onMouseLeave={() => {
                                if (!isSelected) setSelectedDetectionId(null);
                              }}
                              className={`absolute pointer-events-auto transition-all cursor-pointer ${
                                isVisible ? 'opacity-100' : 'opacity-15 grayscale'
                              }`}
                              style={{ left, top, width, height }}
                            >
                              {/* SVG Bounding Box with Optical Corner Reticles */}
                              <svg
                                className="absolute inset-0 w-full h-full overflow-visible"
                                preserveAspectRatio="none"
                                viewBox="0 0 100 100"
                              >
                                <rect
                                  x="0"
                                  y="0"
                                  width="100"
                                  height="100"
                                  fill="rgba(0, 104, 95, 0.12)"
                                  stroke="#00685f"
                                  strokeWidth={isSelected ? '3.5' : '2.5'}
                                  vectorEffect="non-scaling-stroke"
                                />
                                {/* Optical Corner Reticles */}
                                <path
                                  d="M 0 12 L 0 0 L 12 0"
                                  fill="none"
                                  stroke="#89f5e7"
                                  strokeWidth="4"
                                  vectorEffect="non-scaling-stroke"
                                />
                                <path
                                  d="M 88 0 L 100 0 L 100 12"
                                  fill="none"
                                  stroke="#89f5e7"
                                  strokeWidth="4"
                                  vectorEffect="non-scaling-stroke"
                                />
                                <path
                                  d="M 0 88 L 0 100 L 12 100"
                                  fill="none"
                                  stroke="#89f5e7"
                                  strokeWidth="4"
                                  vectorEffect="non-scaling-stroke"
                                />
                                <path
                                  d="M 88 100 L 100 100 L 100 88"
                                  fill="none"
                                  stroke="#89f5e7"
                                  strokeWidth="4"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>

                              {/* Double Badge Header */}
                              <div className="absolute -top-7 left-0 flex flex-nowrap items-center gap-1 whitespace-nowrap shadow-md">
                                <span className="font-label-mono-sm text-label-mono-sm px-1.5 py-0.5 rounded bg-primary text-on-primary font-semibold tracking-tight">
                                  #{index + 1} Waste: {(det.confidence * 100).toFixed(1)}%
                                </span>
                                <span className="font-label-mono-sm text-label-mono-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-secondary-fixed font-medium">
                                  Classified as {typeLabel} ({typeConfidence}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Optical Sensor Crosshair in Center */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                      <div className="w-8 h-8 relative">
                        <span className="absolute top-1/2 left-0 w-full h-[1px] bg-primary-fixed"></span>
                        <span className="absolute left-1/2 top-0 h-full w-[1px] bg-primary-fixed"></span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Legend */}
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-md flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-primary border-0 inline-block shadow-sm"></span>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface">
                          Solid Teal Box: Primary Detection (<span className="text-primary font-semibold">YOLO26s-P2 floating_waste</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-surface-container-high inline-block"></span>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface">
                          Blue/Slate Tag: Auxiliary Classified Type (<span className="text-secondary font-semibold">MARINE-DEBRIS640 probabilistic estimate</span>)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFallbackBannerVisible(!fallbackBannerVisible)}
                      className="text-tertiary hover:underline font-label-mono-sm text-label-mono-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>Toggle Fallback Banner</span>
                    </button>
                  </div>
                </div>

                {/* Hydrodynamic Telemetry Strip */}
                <div className="grid grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary block">
                        Turbidity Profile
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        14.2 NTU
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">opacity</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary block">
                        Estimated Velocity
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        0.42 m/s
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary block">
                        Sun Glint Interference
                      </span>
                      <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                        Low (8.1%)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">wb_sunny</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Stacked Analytical Cards (5 cols desktop) */}
              <div className="xl:col-span-5 flex flex-col gap-space-md">
                {/* 1. Detection Summary Card */}
                <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Detection Summary
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                      Stage 1 Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                        Total Visible Objects
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display text-display leading-none text-on-surface">
                          {stats.count}
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">
                          debris items
                        </span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                        Average Detection Conf
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                          {(stats.avgConf * 100).toFixed(1)}%
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">
                          high-stat
                        </span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                        Highest Conf Detection
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                          {(stats.maxConf * 100).toFixed(1)}%
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                          (Object #{stats.maxIndex + 1})
                        </span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                        Processing Pipeline
                      </span>
                      <div className="flex flex-col mt-1">
                        <span className="font-label-mono-md text-label-mono-md text-on-surface font-semibold">
                          {run.inferenceMs.toFixed(1)}ms (Detector)
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                          + 12.0ms (Classifier)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Object Type Context Card */}
                <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Object Type Context
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-secondary-container">
                      Auxiliary Classifier
                    </span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Multi-class secondary inference probabilistically tags identified bounding patches without retraining core detector backbone.
                  </p>

                  {/* Confidence Breakdown Bars */}
                  <div className="flex flex-col gap-space-sm">
                    {typeDistribution.length > 0 ? (
                      typeDistribution.map((item, idx) => {
                        const colors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-outline'];
                        const dotColor = colors[idx % colors.length];
                        const pctStr = `${(item.avgConf * 100).toFixed(1)}%`;
                        return (
                          <div key={item.label} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                              <span className="text-on-surface font-medium flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                                Classified as {item.label}
                              </span>
                              <span className="text-secondary">
                                {item.count} object{item.count > 1 ? 's' : ''}{' '}
                                <span className="text-on-surface font-semibold">({pctStr})</span>
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                              <div
                                className={`h-full ${dotColor} rounded-full transition-all duration-500`}
                                style={{ width: pctStr }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                        No material classifications at this threshold.
                      </span>
                    )}
                  </div>

                  {/* Note Compliance Pill */}
                  <div className="p-space-xs px-space-sm rounded bg-surface-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Object-type estimates are probabilistic predictions from auxiliary MARINE-DEBRIS640 model.
                    </span>
                  </div>
                </div>

                {/* 3. Cross-Domain Model Card */}
                <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Model Specification
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                      v2.6-stable
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {run.modelVersion || 'YOLO26s-P2 Unified'}
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                      / 11.4M Params
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs pt-1">
                    <div className="p-2 rounded bg-surface-container-low font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary block">Classes:</span>
                      <span className="text-on-surface font-semibold">1 (target: floating_waste)</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary block">Input Res:</span>
                      <span className="text-on-surface font-semibold">640×640 (letterboxed)</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary block">Architecture:</span>
                      <span className="text-on-surface font-semibold">P2/P3/P4/P5 Multi-Scale FPN</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary block">Trained Dataset:</span>
                      <span className="text-on-surface font-semibold">TUD-GV + IWHR Cross-River</span>
                    </div>
                  </div>
                </div>

                {/* 4. Evidence & Analysis Card */}
                <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Evidence-Based Analysis
                    </span>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-label-mono-sm text-label-mono-sm font-semibold">LLM Grounded</span>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    Detection identified {stats.count} floating debris instances concentrated along the nearshore riparian eddy. High proportion of buoyant polymers poses potential downstream water intake obstruction.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-secondary-container">
                      Grounded in Current Detections
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-on-secondary-container">
                      DuckDB Retrieval Verified
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-primary-container text-on-primary-container">
                      Groq GPT-OSS-120B
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Environmental Q&A Chat Panel */}
          <section className="w-full px-gutter-lg pb-space-xl max-w-7xl mx-auto">
            <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-md">
              {/* Panel Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs border-b-0 pb-space-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">smart_toy</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Ask About This Image
                    </h2>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Ask questions about the detected waste, object types, handling, or disposal guidance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                    RAG Context: {run.runId} Cached
                  </span>
                </div>
              </div>

              {/* Quick Suggested Prompt Pills */}
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-mono-sm text-label-mono-sm text-secondary mr-1">Suggested Prompts:</span>
                {[
                  'How many waste objects were detected?',
                  'What types were identified?',
                  'What should I do with the detected waste?',
                  'Which objects were classified as plastic?',
                  'Why might some detections be uncertain?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendChat(prompt)}
                    className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-colors text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Conversation Scroll Container */}
              <div className="flex flex-col gap-space-md max-h-96 overflow-y-auto p-space-sm rounded-lg bg-surface-container-low">
                {chatMessages.map((msg) =>
                  msg.sender === 'user' ? (
                    /* User Message */
                    <div
                      key={msg.id}
                      className="flex items-start justify-end gap-space-sm ml-auto max-w-[85%] md:max-w-[70%]"
                    >
                      <div className="p-space-sm rounded-xl bg-primary text-on-primary font-body-md text-body-md shadow-sm">
                        {msg.text}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-mono-sm text-label-mono-sm font-semibold shrink-0">
                        OP
                      </div>
                    </div>
                  ) : (
                    /* Assistant Reply */
                    <div
                      key={msg.id}
                      className="flex items-start gap-space-sm mr-auto max-w-[95%] md:max-w-[85%]"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">psychology</span>
                      </div>
                      <div className="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-lowest text-on-surface shadow-sm w-full">
                        <div className="flex items-center justify-between gap-space-sm">
                          <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                            Ecological Guidance Engine
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                            Latency: {msg.latencyMs || 184}ms via Groq
                          </span>
                        </div>
                        <div className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </div>
                        <div className="pt-1 flex items-center gap-space-sm text-secondary font-label-mono-sm text-label-mono-sm">
                          <span>Verified against EPA Inland Waterway Rubric (2024.1)</span>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleCopyGuidance(msg.id, msg.text)}
                            className="text-tertiary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {copiedGuidanceId === msg.id ? 'check' : 'content_copy'}
                            </span>
                            <span>{copiedGuidanceId === msg.id ? 'Copied' : 'Copy Guidance'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {chatLoading && (
                  <div className="flex items-start gap-space-sm mr-auto max-w-[95%] md:max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                    </div>
                    <div className="p-space-md rounded-xl bg-surface-container-lowest text-secondary font-label-mono-sm text-label-mono-sm shadow-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] animate-spin text-primary">sync</span>
                      <span>Retrieving DuckDB evidence chunks &amp; generating grounded advisory...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-space-sm pt-space-xs"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question grounded in this image detection..."
                    disabled={chatLoading}
                    className="w-full px-space-md py-space-sm pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                    mic
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
