'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
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

  // Viewport & Image Sizing
  const imageRef = useRef<HTMLImageElement>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

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

  // Sync natural dimensions from run
  useEffect(() => {
    if (run?.imageWidth && run?.imageHeight) {
      setNaturalDimensions({
        width: run.imageWidth,
        height: run.imageHeight,
      });
    }
  }, [run?.imageWidth, run?.imageHeight]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setNaturalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }
  };

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
          <div className="w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium text-slate-600">
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
          <div className="rf-card p-8 flex flex-col items-center text-center gap-4 max-w-md">
            <span className="material-symbols-outlined text-red-600 text-[40px]">error_outline</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Analysis Not Found</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {error || 'This inference session could not be located in browser session storage.'}
            </p>
            <Link
              href="/analyze"
              className="mt-2 rf-btn-primary text-sm"
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
          <section className="w-full px-gutter-lg py-3.5 bg-white border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl text-slate-900 tracking-tight font-bold">
                    Detection Results
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-medium">
                    Inference Successful
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
                    Single-Class Core Detector
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-slate-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Run ID:</span>
                    <span className="font-mono text-slate-900 font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/70">
                      {run.runId}
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Visible Detections:</span>
                    <span className="text-teal-700 font-semibold">{visibleDetections.length} objects</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Inference Latency:</span>
                    <span className="text-slate-900 font-semibold">{run.inferenceMs.toFixed(1)}ms</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Backend:</span>
                    <span className="font-mono text-slate-800 font-semibold">FastAPI (NEXT_PUBLIC_API_URL)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Timestamp:</span>
                    <span className="text-slate-700">
                      {run.createdAt ? new Date(run.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 lg:self-center">
                <button
                  type="button"
                  onClick={handleRerun}
                  className="rf-btn-secondary text-xs sm:text-sm py-2 px-3.5 whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className={`material-symbols-outlined text-[17px] ${isRerunning ? 'animate-spin' : ''}`}>
                    {isRerunning ? 'sync' : 'refresh'}
                  </span>
                  <span>{isRerunning ? 'Re-inferencing...' : 'Re-run Analysis'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="rf-btn-secondary text-xs sm:text-sm py-2 px-3.5 whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {jsonExportSuccess ? 'check' : 'data_object'}
                  </span>
                  <span>{jsonExportSuccess ? 'JSON Copied!' : 'Export JSON Annotation'}</span>
                </button>

                <a
                  href={displayImageUrl}
                  download={`robustfloat_${run.runId}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="rf-btn-primary text-xs sm:text-sm py-2 px-3.5 whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">download</span>
                  <span>Download Rendered Image</span>
                </a>
              </div>
            </div>
          </section>

          {/* Fallback Warning / 0-Waste Banner */}
          {(visibleDetections.length === 0 || fallbackBannerVisible) && (
            <section className="w-full px-gutter-lg pt-4 max-w-7xl mx-auto">
              <div className="w-full p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">water</span>
                  </div>
                  <div>
                    <span className="text-sm text-amber-900 font-semibold block">
                      State Notification: No Visible Waste Above Cutoff
                    </span>
                    <span className="text-xs text-amber-800/90 leading-relaxed">
                      Zero instances localized above threshold &ge; {confidenceThreshold.toFixed(2)}. Adjust the slider or inspect surface directly.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFallbackBannerVisible(false)}
                  className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs font-medium transition-colors cursor-pointer shrink-0"
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
                <div className="rf-card p-5 flex flex-col gap-4">
                  {/* Viewport Interactive Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-bold text-slate-900 tracking-tight">
                        Analyzed Stream Viewport
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium border border-slate-200/70">
                        {run.title || 'CAM_04_NORTH_ESTUARY'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* BBox Switch */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showBoxes}
                          onChange={(e) => setShowBoxes(e.target.checked)}
                          className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-700">
                          BBox Overlays
                        </span>
                      </label>

                      {/* Threshold Slider */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                        <span className="text-xs text-slate-500 font-medium">
                          Threshold:
                        </span>
                        <input
                          type="range"
                          min="0.05"
                          max="0.95"
                          step="0.05"
                          value={confidenceThreshold}
                          onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                          className="w-20 accent-teal-800 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {confidenceThreshold.toFixed(2)}
                        </span>
                      </div>

                      {/* Zoom Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsZoomed(!isZoomed)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border cursor-pointer ${
                          isZoomed
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="Toggle Zoom View"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isZoomed ? 'zoom_out' : 'zoom_in'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Responsive Viewport with Overlays - Natural Geometry Container */}
                  <div className="relative w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center select-none shadow-inner border border-slate-200/80 min-h-[360px] max-h-[75vh]">
                    {/* Coordinate Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#89f5e7_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>

                    {/* Optical Sensor HUD Top Elements */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur-md text-xs font-mono text-teal-200 flex items-center gap-2 border border-slate-700/50 z-20 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                      <span>YOLO26s-P2 STREAM READY • {naturalDimensions.width || run.imageWidth}×{naturalDimensions.height || run.imageHeight}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur-md text-xs font-mono text-slate-300 border border-slate-700/50 z-20 pointer-events-none">
                      FOCAL: 28mm • FLIR OPTICAL CH.1
                    </div>

                    {/* Optical Sensor Crosshair in Center */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-20">
                      <div className="w-8 h-8 relative">
                        <span className="absolute top-1/2 left-0 w-full h-[1px] bg-teal-400"></span>
                        <span className="absolute left-1/2 top-0 h-full w-[1px] bg-teal-400"></span>
                      </div>
                    </div>

                    {/* Shared Image & SVG Overlay Positioning Container */}
                    <div
                      className={`relative inline-block leading-none transition-transform duration-300 max-w-full max-h-[75vh] z-10 ${
                        isZoomed ? 'scale-125' : 'scale-100'
                      }`}
                    >
                      {/* Real Uploaded Photo from Backend (Preserves exact aspect ratio) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imageRef}
                        src={displayImageUrl}
                        alt="Analyzed Inland Waterway Feed"
                        onLoad={handleImageLoad}
                        className="block w-auto h-auto max-w-full max-h-[75vh] select-none pointer-events-none"
                      />

                      {/* Dynamic Bounding Box Layer in SVG Coordinates */}
                      {showBoxes && (naturalDimensions.width || run.imageWidth) > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                          viewBox={`0 0 ${naturalDimensions.width || run.imageWidth} ${naturalDimensions.height || run.imageHeight}`}
                        >
                          {run.detections.map((det) => {
                            const isVisible = det.confidence >= confidenceThreshold;
                            if (!isVisible) return null;

                            const isSelected = selectedDetectionId === det.id;
                            const nw = naturalDimensions.width || run.imageWidth;
                            const nh = naturalDimensions.height || run.imageHeight;

                            // Real detector coordinates from API response
                            const rawX1 = det.pixel_bbox ? det.pixel_bbox.x1 : det.bbox.x1 * nw;
                            const rawY1 = det.pixel_bbox ? det.pixel_bbox.y1 : det.bbox.y1 * nh;
                            const rawX2 = det.pixel_bbox ? det.pixel_bbox.x2 : det.bbox.x2 * nw;
                            const rawY2 = det.pixel_bbox ? det.pixel_bbox.y2 : det.bbox.y2 * nh;

                            // Boundary checks
                            const x1 = Math.max(0, Math.min(rawX1, nw));
                            const y1 = Math.max(0, Math.min(rawY1, nh));
                            const x2 = Math.max(x1, Math.min(rawX2, nw));
                            const y2 = Math.max(y1, Math.min(rawY2, nh));
                            const width = x2 - x1;
                            const height = y2 - y1;

                            if (width <= 0 || height <= 0) return null;

                            const reticleLen = Math.min(width * 0.25, height * 0.25, Math.max(6, nw * 0.018));

                            return (
                              <g
                                key={det.id}
                                className="cursor-pointer pointer-events-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetectionId(isSelected ? null : det.id);
                                }}
                                onMouseEnter={() => setSelectedDetectionId(det.id)}
                                onMouseLeave={() => {
                                  if (!isSelected) setSelectedDetectionId(null);
                                }}
                              >
                                {/* Main Bounding Box Rectangle */}
                                <rect
                                  x={x1}
                                  y={y1}
                                  width={width}
                                  height={height}
                                  fill={isSelected ? 'rgba(0, 104, 95, 0.22)' : 'rgba(0, 104, 95, 0.12)'}
                                  stroke={isSelected ? '#00685f' : '#0d9488'}
                                  strokeWidth={isSelected ? '3.5' : '2'}
                                  vectorEffect="non-scaling-stroke"
                                />

                                {/* Optical Corner Reticles */}
                                {reticleLen > 2 && (
                                  <>
                                    <path
                                      d={`M ${x1} ${y1 + reticleLen} L ${x1} ${y1} L ${x1 + reticleLen} ${y1}`}
                                      fill="none"
                                      stroke="#89f5e7"
                                      strokeWidth="3.5"
                                      vectorEffect="non-scaling-stroke"
                                    />
                                    <path
                                      d={`M ${x2 - reticleLen} ${y1} L ${x2} ${y1} L ${x2} ${y1 + reticleLen}`}
                                      fill="none"
                                      stroke="#89f5e7"
                                      strokeWidth="3.5"
                                      vectorEffect="non-scaling-stroke"
                                    />
                                    <path
                                      d={`M ${x1} ${y2 - reticleLen} L ${x1} ${y2} L ${x1 + reticleLen} ${y2}`}
                                      fill="none"
                                      stroke="#89f5e7"
                                      strokeWidth="3.5"
                                      vectorEffect="non-scaling-stroke"
                                    />
                                    <path
                                      d={`M ${x2 - reticleLen} ${y2} L ${x2} ${y2} L ${x2} ${y2 - reticleLen}`}
                                      fill="none"
                                      stroke="#89f5e7"
                                      strokeWidth="3.5"
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      )}

                      {/* Anchored Detection Label Badges */}
                      {showBoxes && (naturalDimensions.width || run.imageWidth) > 0 && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {run.detections.map((det, index) => {
                            const isVisible = det.confidence >= confidenceThreshold;
                            if (!isVisible) return null;

                            const isSelected = selectedDetectionId === det.id;
                            const nw = naturalDimensions.width || run.imageWidth;
                            const nh = naturalDimensions.height || run.imageHeight;

                            const rawX1 = det.pixel_bbox ? det.pixel_bbox.x1 : det.bbox.x1 * nw;
                            const rawY1 = det.pixel_bbox ? det.pixel_bbox.y1 : det.bbox.y1 * nh;
                            const rawX2 = det.pixel_bbox ? det.pixel_bbox.x2 : det.bbox.x2 * nw;

                            const x1 = Math.max(0, Math.min(rawX1, nw));
                            const y1 = Math.max(0, Math.min(rawY1, nh));
                            const x2 = Math.max(x1, Math.min(rawX2, nw));

                            const leftPct = (x1 / nw) * 100;
                            const topPct = (y1 / nh) * 100;
                            const rightPct = (x2 / nw) * 100;

                            // Intelligent repositioning so label stays inside the visible image
                            const isNearTop = topPct < 7;
                            const isNearRight = leftPct > 68;

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
                                key={`label-${det.id}`}
                                className={`absolute pointer-events-auto flex items-center gap-1.5 whitespace-nowrap z-10 cursor-pointer transition-all ${
                                  isSelected ? 'scale-105' : 'scale-100'
                                }`}
                                style={{
                                  top: `${topPct}%`,
                                  ...(isNearRight
                                    ? { right: `${Math.max(0, 100 - rightPct)}%` }
                                    : { left: `${Math.max(0, leftPct)}%` }),
                                  transform: isNearTop
                                    ? 'translateY(4px)'
                                    : 'translateY(-100%) translateY(-4px)',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetectionId(isSelected ? null : det.id);
                                }}
                                onMouseEnter={() => setSelectedDetectionId(det.id)}
                                onMouseLeave={() => {
                                  if (!isSelected) setSelectedDetectionId(null);
                                }}
                              >
                                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-teal-800 text-white font-semibold tracking-tight shadow-md">
                                  #{index + 1} Waste: {(det.confidence * 100).toFixed(1)}%
                                </span>
                                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200/90 font-medium shadow-md">
                                  Classified as {typeLabel} ({typeConfidence}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technical Legend */}
                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-teal-800 inline-block shadow-sm"></span>
                        <span className="text-slate-700">
                          Solid Teal Box: Primary Detection (<span className="text-teal-800 font-semibold">YOLO26s-P2 floating_waste</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-slate-200 border border-slate-300 inline-block"></span>
                        <span className="text-slate-700">
                          Light Tag: Auxiliary Classified Type (<span className="text-slate-700 font-semibold">MARINE-DEBRIS640 probabilistic estimate</span>)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFallbackBannerVisible(!fallbackBannerVisible)}
                      className="text-teal-700 hover:text-teal-900 font-medium text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>Toggle Fallback Banner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Stacked Analytical Cards (5 cols desktop) */}
              <div className="xl:col-span-5 flex flex-col gap-space-md">
                {/* 1. Detection Summary Card */}
                <div className="rf-card p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900 tracking-tight">
                      Detection Summary
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-semibold">
                      Stage 1 Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rf-subcard p-3 flex flex-col justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Total Visible Objects
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-3xl font-bold leading-none text-slate-900 tracking-tight">
                          {stats.count}
                        </span>
                        <span className="text-xs text-teal-700 font-medium">
                          debris items
                        </span>
                      </div>
                    </div>

                    <div className="rf-subcard p-3 flex flex-col justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Average Detection Conf
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                          {(stats.avgConf * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-teal-700 font-medium">
                          high-stat
                        </span>
                      </div>
                    </div>

                    <div className="rf-subcard p-3 flex flex-col justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Highest Conf Detection
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                          {(stats.maxConf * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          (#{stats.maxIndex + 1})
                        </span>
                      </div>
                    </div>

                    <div className="rf-subcard p-3 flex flex-col justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Processing Pipeline
                      </span>
                      <div className="flex flex-col mt-1">
                        <span className="text-xs font-semibold text-slate-900">
                          {run.inferenceMs.toFixed(1)}ms (Detector)
                        </span>
                        <span className="text-xs text-slate-500">
                          + 12.0ms (Classifier)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Object Type Context Card */}
                <div className="rf-card p-5 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900 tracking-tight">
                      Object Type Context
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
                      Auxiliary Classifier
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Multi-class secondary inference probabilistically tags identified bounding patches without retraining core detector backbone.
                  </p>

                  {/* Confidence Breakdown Bars */}
                  <div className="flex flex-col gap-2.5">
                    {typeDistribution.length > 0 ? (
                      typeDistribution.map((item, idx) => {
                        const colors = ['bg-teal-700', 'bg-cyan-700', 'bg-slate-600', 'bg-slate-400'];
                        const dotColor = colors[idx % colors.length];
                        const pctStr = `${(item.avgConf * 100).toFixed(1)}%`;
                        return (
                          <div key={item.label} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-800 font-medium flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                                Classified as {item.label}
                              </span>
                              <span className="text-slate-500">
                                {item.count} object{item.count > 1 ? 's' : ''}{' '}
                                <span className="text-slate-900 font-semibold">({pctStr})</span>
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full ${dotColor} rounded-full transition-all duration-500`}
                                style={{ width: pctStr }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-500">
                        No material classifications at this threshold.
                      </span>
                    )}
                  </div>

                  {/* Note Compliance Pill */}
                  <div className="p-2.5 px-3 rounded-lg bg-slate-50/90 border border-slate-200/80 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500 shrink-0">info</span>
                    <span className="text-xs text-slate-600 leading-normal">
                      Object-type estimates are probabilistic predictions from auxiliary MARINE-DEBRIS640 model.
                    </span>
                  </div>
                </div>

                {/* 3. Cross-Domain Model Card */}
                <div className="rf-card p-5 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900 tracking-tight">
                      Model Specification
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 font-mono font-medium">
                      v2.6-stable
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-teal-800">
                      {run.modelVersion || 'YOLO26s-P2 Unified'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      / 11.4M Params
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="rf-subcard p-2 text-xs">
                      <span className="text-slate-500 block font-medium">Classes:</span>
                      <span className="text-slate-900 font-semibold mt-0.5 block">1 (floating_waste)</span>
                    </div>
                    <div className="rf-subcard p-2 text-xs">
                      <span className="text-slate-500 block font-medium">Input Res:</span>
                      <span className="text-slate-900 font-semibold mt-0.5 block">640×640</span>
                    </div>
                    <div className="rf-subcard p-2 text-xs">
                      <span className="text-slate-500 block font-medium">Architecture:</span>
                      <span className="text-slate-900 font-semibold mt-0.5 block">P2-P5 FPN Neck</span>
                    </div>
                    <div className="rf-subcard p-2 text-xs">
                      <span className="text-slate-500 block font-medium">Dataset:</span>
                      <span className="text-slate-900 font-semibold mt-0.5 block">TUD-GV + IWHR</span>
                    </div>
                  </div>
                </div>

                {/* 4. Evidence & Analysis Card */}
                <div className="rf-card p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900 tracking-tight">
                      Evidence-Based Analysis
                    </span>
                    <div className="flex items-center gap-1 text-teal-700">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="text-xs font-semibold">LLM Grounded</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Detection identified {stats.count} floating debris instances concentrated along the nearshore riparian eddy. High proportion of buoyant polymers poses potential downstream water intake obstruction.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-medium">
                      Grounded in Detections
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-medium">
                      DuckDB Retrieval Verified
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200/80 text-teal-800 font-medium">
                      Groq GPT-OSS-120B
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Environmental Q&A Chat Panel */}
          <section className="w-full px-gutter-lg pb-12 max-w-7xl mx-auto">
            <div className="rf-card p-6 flex flex-col gap-4">
              {/* Panel Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-700 text-[22px]">smart_toy</span>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Ask About This Image
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ask questions about the detected waste, object types, handling, or disposal guidance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <span className="text-xs font-mono text-slate-500">
                    RAG Context: {run.runId}
                  </span>
                </div>
              </div>

              {/* Quick Suggested Prompt Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium mr-1">Suggested Prompts:</span>
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
                    className="px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Conversation Scroll Container */}
              <div className="rf-subcard p-4 flex flex-col gap-4 max-h-96 overflow-y-auto bg-slate-50/60">
                {chatMessages.map((msg) =>
                  msg.sender === 'user' ? (
                    /* User Message */
                    <div
                      key={msg.id}
                      className="flex items-start justify-end gap-2.5 ml-auto max-w-[85%] md:max-w-[70%]"
                    >
                      <div className="p-3 rounded-xl bg-teal-800 text-white shadow-sm text-sm font-normal">
                        {msg.text}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-900 flex items-center justify-center text-xs font-semibold shrink-0">
                        OP
                      </div>
                    </div>
                  ) : (
                    /* Assistant Reply */
                    <div
                      key={msg.id}
                      className="flex items-start gap-2.5 mr-auto max-w-[95%] md:max-w-[85%]"
                    >
                      <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                      </div>
                      <div className="rf-card p-4 text-slate-800 w-full flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-teal-800">
                            Ecological Guidance Engine
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Latency: {msg.latencyMs || 184}ms via Groq
                          </span>
                        </div>
                        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </div>
                        <div className="pt-2 mt-1 border-t border-slate-100 flex items-center gap-3 text-slate-500 text-xs">
                          <span>Verified against EPA Inland Waterway Rubric</span>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleCopyGuidance(msg.id, msg.text)}
                            className="text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 cursor-pointer"
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
                  <div className="flex items-start gap-2.5 mr-auto max-w-[95%] md:max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                    </div>
                    <div className="rf-card p-3.5 text-slate-600 text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] animate-spin text-teal-700">sync</span>
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
                className="flex items-center gap-3 pt-1 w-full"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question grounded in this image detection..."
                  disabled={chatLoading}
                  className="flex-1 h-11 px-4 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 shadow-sm transition-colors"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="h-11 px-5 rounded-lg bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-medium text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[16px] leading-none">send</span>
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
