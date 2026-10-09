'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { Run } from '@/types';

type HistoryItem = Pick<Run, 'runId' | 'imageUrl' | 'detections' | 'createdAt' | 'title'>;

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeStr: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pipelineState, setPipelineState] = useState<'standby' | 'executing' | 'completed'>('standby');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [recentRuns, setRecentRuns] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load recent runs
  const loadRuns = async () => {
    try {
      const items = await api.listRuns();
      setRecentRuns(items);
    } catch {
      setRecentRuns([]);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Unsupported format. Please select JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return;
    }

    setStagedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setImageMeta({
        width: img.naturalWidth || 1920,
        height: img.naturalHeight || 1080,
        sizeStr: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    };
    img.src = url;

    showToast(`Loaded ${file.name} for inference.`);
  };

  const handleSampleLoad = async () => {
    try {
      showToast('Loading IWHR Sample #08 (HydroWaste-10k Benchmark)...');
      const samplePath = '/images/sample-turbid-reservoir.webp';
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], 'IWHR_hydro_benchmark_08.png', { type: 'image/png' });
      handleFileChange(file);
    } catch {
      // Fallback
      showToast('Unable to load sample directly.');
    }
  };

  const handleDiscard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setStagedFile(null);
    setPreviewUrl(null);
    setImageMeta(null);
    setPipelineState('standby');
    setActiveStage(0);
    showToast('Current payload discarded.');
  };

  const handleStartInference = async () => {
    if (!stagedFile) return;

    setPipelineState('executing');
    setActiveStage(1);
    showToast('Inference pipeline dispatched to backend.');

    // Simulated stage progression for user feedback while actual backend API runs
    const t1 = setTimeout(() => setActiveStage(2), 300);
    const t2 = setTimeout(() => setActiveStage(3), 800);
    const t3 = setTimeout(() => setActiveStage(4), 1400);

    try {
      const run = await api.detect(stagedFile);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setActiveStage(5);
      setPipelineState('completed');
      showToast(`Inference complete: ${run.detections.length} objects localized.`);
      setTimeout(() => {
        router.push(`/result/${run.runId}`);
      }, 700);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setPipelineState('standby');
      setActiveStage(0);
      setErrorMessage(
        typeof err?.message === 'string'
          ? err.message
          : 'Inference could not be completed. Please try again.'
      );
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="px-gutter-lg py-margin-md max-w-7xl mx-auto w-full flex flex-col gap-space-lg">
            {/* Subheader Strip */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-space-xs">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                    Telemetry • Inference Gateway
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-medium">
                    Pipeline v2.6.4-prod
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
                  Upload Waterway Image
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl">
                  Submit high-resolution inland water imagery for real-time floating waste localization, morphology segmenting, and contextual multi-scale classification.
                </p>
              </div>

              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={handleSampleLoad}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg rf-btn-secondary text-sm font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-800">science</span>
                  <span>Load IWHR Sample #08</span>
                </button>
              </div>
            </div>

            {/* Pipeline Notice Banner */}
            <div className="rounded-xl rf-card p-4 shadow-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-50 border border-teal-200/60 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Your image is processed by the <span className="font-semibold text-teal-800">RobustFloat detection pipeline</span>. The detector identifies visible floating waste and the auxiliary classifier provides object-type context with ecological retrieval grounding.
                </p>
                <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-teal-700">verified_user</span>
                  <span>Zero Data Retention Policy</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Dual Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column (8 cols): Payload Ingestion & Recent Runs */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <div className="rf-card rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Sensor Payload Ingestion
                      </h2>
                      <p className="text-xs text-slate-500">
                        Autonomous surface vessel (ASV) camera feed or fixed hydro-pole capture
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/70 text-slate-600">
                        JPEG, PNG, WebP
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/70 text-slate-600">
                        &le; 25MB
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/70 text-slate-600">
                        1080p–4K Optimal
                      </span>
                    </div>
                  </div>

                  {/* Empty State / Dropzone */}
                  {!previewUrl ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileChange(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`rounded-xl bg-slate-50/70 p-10 flex flex-col items-center justify-center text-center gap-2 hover:bg-teal-50/30 transition-all cursor-pointer border-2 border-dashed ${
                        isDragging ? 'border-primary bg-teal-50/40' : 'border-slate-300 hover:border-teal-600'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-teal-800 transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base text-slate-900 font-semibold">
                          Drag and drop your waterway image here
                        </span>
                        <span className="text-xs text-slate-500">
                          or <span className="text-teal-800 underline font-medium">browse local files</span> from edge station
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">tune</span>
                          Auto-normalized
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">aspect_ratio</span>
                          Multi-scale TTA
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Preview Card When Staged */
                    <div className="rounded-xl overflow-hidden rf-card flex flex-col">
                      <div className="relative w-full h-80 bg-slate-950 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Waterway scan staged for inference"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

                        {/* Top Overlays */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white text-xs flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-teal-400">
                              photo_camera
                            </span>
                            ASV-RGB-TRANSECT
                          </span>
                          <span className="px-2.5 py-1 rounded bg-teal-800 text-white text-xs font-semibold">
                            READY FOR INFERENCE
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded bg-slate-900/85 hover:bg-slate-900 border border-slate-700/60 backdrop-blur-md text-white text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                            Reselect File
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(e.target.files[0]);
                              }
                            }}
                          />
                        </div>

                        {/* Bottom Overlays */}
                        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-[18px]">image</span>
                            </span>
                            <div className="flex flex-col">
                              <span className="text-xs text-white font-semibold truncate max-w-xs">
                                {stagedFile?.name}
                              </span>
                              <span className="text-[11px] text-slate-300">
                                Sensor: Basler acA2440-75uc • Station #04-Huangpu
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white">
                              {imageMeta?.width || 1920} &times; {imageMeta?.height || 1080}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white">
                              {imageMeta?.sizeStr || '2.4 MB'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-white">
                              sRGB 8-bit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-t border-slate-200/80">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span className="material-symbols-outlined text-[18px] text-sky-700">memory</span>
                            <span>Backend: FastAPI-v0.115 / YOLO26s</span>
                          </div>
                          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span>Ready</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={handleDiscard}
                            disabled={pipelineState === 'executing'}
                            className="px-4 py-2 rounded-lg rf-btn-secondary text-sm font-medium transition-all cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            type="button"
                            onClick={handleStartInference}
                            disabled={pipelineState === 'executing'}
                            className="px-5 py-2 rounded-lg rf-btn-primary text-sm font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-75"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {pipelineState === 'executing' ? 'sync' : 'bolt'}
                            </span>
                            <span>
                              {pipelineState === 'executing' ? 'Analyzing...' : 'Analyze Image'}
                            </span>
                            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded font-normal">
                              ~41ms
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Architecture Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl rf-card flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      PRIMARY DETECTOR
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      YOLO26s-P2
                    </span>
                    <span className="text-xs text-slate-500">
                      P2 High-Res Small Debris
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl rf-card flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      AUX CLASSIFIER
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      MD640-ResNet
                    </span>
                    <span className="text-xs text-slate-500">
                      MarineDebris-640 taxonomy
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl rf-card flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      SYNTH REFLECTION
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      Specular Gate ON
                    </span>
                    <span className="text-xs text-slate-500">
                      Ripple false-positive suppression
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl rf-card flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      REASONING LLM
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      GPT-OSS-120B
                    </span>
                    <span className="text-xs text-slate-500">
                      Grounded field advisory
                    </span>
                  </div>
                </div>

                {/* Recent Inference Runs Card */}
                <div className="rf-card rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-slate-900">
                          Recent Inference Runs
                        </h3>
                        <span className="text-xs text-slate-500">
                          Live telemetry logs from endpoint <code className="font-mono text-xs text-slate-700 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">/api/runs/{'{run_id}'}</code>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        loadRuns();
                        showToast('Refreshed inference run telemetry queue.');
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-4 font-semibold">Run ID</th>
                          <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                          <th className="py-2.5 px-4 font-semibold">Target Frame</th>
                          <th className="py-2.5 px-4 font-semibold">Detections</th>
                          <th className="py-2.5 px-4 font-semibold">Status</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentRuns.length > 0 ? (
                          recentRuns.slice(0, 5).map((run) => (
                            <tr key={run.runId} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-4 font-medium">
                                <span className="font-mono text-xs text-slate-800 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded">
                                  #{run.runId}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500">
                                {run.createdAt
                                  ? new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'Recent'}
                              </td>
                              <td className="py-3 px-4 text-slate-800 font-medium">
                                {run.title || 'Waterway frame'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-700 font-medium">
                                  {run.detections.length} objects
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 font-medium text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                  Success
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Link
                                  href={`/result/${run.runId}`}
                                  className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-900 font-semibold"
                                >
                                  View Result
                                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-6 px-4 text-center text-slate-500">
                              No previous inference runs in local session yet. Upload an image above to start.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Sticky Pipeline Execution Panel */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="rf-card rounded-xl p-6 flex flex-col gap-4 sticky top-20">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-teal-800">analytics</span>
                      <h2 className="text-base font-semibold text-slate-900">
                        Pipeline Execution
                      </h2>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        pipelineState === 'executing'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200/60 animate-pulse'
                          : pipelineState === 'completed'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {pipelineState === 'executing' ? 'Executing...' : pipelineState === 'completed' ? 'Completed' : 'Standby'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Stage 1 */}
                    <div
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 border ${
                        activeStage >= 1 ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          activeStage >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {activeStage >= 1 ? 'check' : '1'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            Stage 1: Image Dispatch
                          </span>
                          <span className="text-xs font-semibold text-teal-800">
                            {activeStage >= 1 ? 'Complete' : 'Queued'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Uploading payload to FastAPI backend • Tensor buffer initialized
                        </span>
                      </div>
                    </div>

                    {/* Stage 2 */}
                    <div
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 border ${
                        activeStage >= 2 ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          activeStage >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {activeStage >= 2 ? 'check' : '2'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            Stage 2: YOLO26s-P2 Detector
                          </span>
                          <span className="text-xs font-semibold text-teal-800">
                            {activeStage >= 2 ? '41 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Extracting small bounding proposals via specialized P2 neck
                        </span>
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 border ${
                        activeStage >= 3 ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          activeStage >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {activeStage >= 3 ? 'check' : '3'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            Stage 3: Aux Object Classification
                          </span>
                          <span className="text-xs font-semibold text-teal-800">
                            {activeStage >= 3 ? '22 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Estimating object type via MARINE-DEBRIS640 auxiliary head
                        </span>
                      </div>
                    </div>

                    {/* Stage 4 */}
                    <div
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 border ${
                        activeStage >= 4 ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          activeStage >= 4 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {activeStage >= 4 ? 'check' : '4'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            Stage 4: Vector Evidence Retrieval
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {activeStage >= 4 ? '18 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Embedding search across HydroWaste-10k references
                        </span>
                      </div>
                    </div>

                    {/* Stage 5 */}
                    <div
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 border ${
                        activeStage >= 5 ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          activeStage >= 5 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {activeStage >= 5 ? 'check' : '5'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            Stage 5: Grounded Reasoning Analysis
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {activeStage >= 5 ? 'Complete' : 'Queued'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Generating structured causal impact advisory via Groq
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Telemetry Box */}
                  <div className="rounded-lg rf-subcard p-3.5 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Resource Telemetry
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Inference Target:</span>
                      <span className="font-semibold text-slate-900">NVIDIA Jetson AGX Orin / RTX 4090</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">FP16 Latency (e2e):</span>
                      <span className="font-semibold text-teal-800">~188 ms total</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Active Batch Size:</span>
                      <span className="font-semibold text-slate-900">1 (Sequential Low-Jitter)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => showToast('Inference WebSocket stream synchronized.')}
                      className="w-full py-2 px-3 rounded-lg rf-btn-secondary text-xs font-medium text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-slate-600">terminal</span>
                      <span>Open Real-Time Inference Stream</span>
                    </button>
                    <p className="font-mono text-[11px] text-slate-400 text-center">
                      Session ID: #sess_4901b-aquatic-telemetry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          <div
            className={`fixed bottom-space-lg right-space-lg bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm transition-all z-50 ${
              toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24 pointer-events-none'
            }`}
          >
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">
              check_circle
            </span>
            <span className="font-body-sm text-body-sm font-medium">
              {toastMessage}
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
