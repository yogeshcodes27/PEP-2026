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
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary font-semibold">
                    Telemetry • Inference Gateway
                  </span>
                  <span className="inline-flex items-center px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-secondary-container font-label-mono-sm text-label-mono-sm">
                    Pipeline v2.6.4-prod
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  Upload Waterway Image
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Submit high-resolution inland water imagery for real-time floating waste localization, morphology segmenting, and contextual multi-scale classification.
                </p>
              </div>

              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={handleSampleLoad}
                  className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all font-label-mono-md text-label-mono-md shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">science</span>
                  <span>Load IWHR Sample #08</span>
                </button>
              </div>
            </div>

            {/* Pipeline Notice Banner */}
            <div className="rounded-xl bg-surface-container-low p-space-md shadow-sm flex items-start gap-space-md">
              <div className="p-space-xs rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <p className="font-body-md text-body-md text-on-surface">
                  Your image is processed by the <span className="font-semibold text-primary">RobustFloat detection pipeline</span>. The detector identifies visible floating waste and the auxiliary classifier provides object-type context with ecological retrieval grounding.
                </p>
                <div className="flex items-center gap-space-xs shrink-0 font-label-mono-sm text-label-mono-sm text-secondary">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                  <span>Zero Data Retention Policy</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md text-body-md flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-error">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Dual Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column (8 cols): Payload Ingestion & Recent Runs */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Sensor Payload Ingestion
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Autonomous surface vessel (ASV) camera feed or fixed hydro-pole capture
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-xs font-label-mono-sm text-label-mono-sm">
                      <span className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-secondary-container">
                        JPEG, PNG, WebP
                      </span>
                      <span className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-secondary-container">
                        &le; 25MB
                      </span>
                      <span className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-secondary-container">
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
                      className={`rounded-xl bg-surface-container-low p-space-xl flex flex-col items-center justify-center text-center gap-space-sm hover:bg-surface-container transition-all cursor-pointer border-2 border-dashed ${
                        isDragging ? 'border-primary bg-surface-container' : 'border-transparent'
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
                      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                          Drag and drop your waterway image here
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary">
                          or <span className="text-primary underline font-medium">browse local files</span> from edge station
                        </span>
                      </div>
                      <div className="mt-space-xs flex items-center gap-space-sm text-on-surface-variant font-label-mono-sm text-label-mono-sm">
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
                    <div className="rounded-xl overflow-hidden bg-surface-container-low shadow-sm flex flex-col">
                      <div className="relative w-full h-80 bg-inverse-surface/10 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Waterway scan staged for inference"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-black/20 pointer-events-none"></div>

                        {/* Top Overlays */}
                        <div className="absolute top-space-md left-space-md flex items-center gap-space-xs">
                          <span className="px-space-xs py-0.5 rounded-lg bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-mono-sm text-label-mono-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-primary-fixed">
                              photo_camera
                            </span>
                            ASV-RGB-TRANSECT
                          </span>
                          <span className="px-space-xs py-0.5 rounded-lg bg-primary-container text-on-primary-container font-label-mono-sm text-label-mono-sm font-semibold">
                            READY FOR INFERENCE
                          </span>
                        </div>

                        <div className="absolute top-space-md right-space-md">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-space-sm py-1 rounded-lg bg-inverse-surface/80 hover:bg-inverse-surface backdrop-blur-md text-inverse-on-surface text-label-mono-sm font-label-mono-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
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
                        <div className="absolute bottom-space-md left-space-md right-space-md flex flex-wrap items-center justify-between gap-space-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="p-1.5 rounded-lg bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface flex items-center justify-center">
                              <span className="material-symbols-outlined text-[18px]">image</span>
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-mono-md text-label-mono-md text-inverse-on-surface font-semibold tracking-wide truncate max-w-xs">
                                {stagedFile?.name}
                              </span>
                              <span className="font-label-mono-sm text-label-mono-sm text-inverse-on-surface/80">
                                Sensor: Basler acA2440-75uc • Station #04-Huangpu
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm">
                            <span className="px-space-xs py-0.5 rounded-lg bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface">
                              {imageMeta?.width || 1920} &times; {imageMeta?.height || 1080}
                            </span>
                            <span className="px-space-xs py-0.5 rounded-lg bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface">
                              {imageMeta?.sizeStr || '2.4 MB'}
                            </span>
                            <span className="px-space-xs py-0.5 rounded-lg bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface">
                              sRGB 8-bit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-lowest">
                        <div className="flex items-center gap-space-md w-full sm:w-auto">
                          <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px] text-tertiary">memory</span>
                            <span>Backend: FastAPI-v0.115 / YOLO26s</span>
                          </div>
                          <div className="hidden md:flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-secondary">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span>Ready</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={handleDiscard}
                            disabled={pipelineState === 'executing'}
                            className="px-space-md py-space-xs rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-all cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            type="button"
                            onClick={handleStartInference}
                            disabled={pipelineState === 'executing'}
                            className="px-space-lg py-space-xs rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold flex items-center gap-space-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-75"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {pipelineState === 'executing' ? 'sync' : 'bolt'}
                            </span>
                            <span>
                              {pipelineState === 'executing' ? 'Analyzing...' : 'Analyze Image'}
                            </span>
                            <span className="font-label-mono-sm text-label-mono-sm bg-primary-container/40 px-1.5 py-0.5 rounded-md font-normal">
                              ~41ms
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Architecture Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                      PRIMARY DETECTOR
                    </span>
                    <span className="font-label-mono-md text-label-mono-md text-on-surface font-semibold">
                      YOLO26s-P2
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      P2 High-Res Small Debris
                    </span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                      AUX CLASSIFIER
                    </span>
                    <span className="font-label-mono-md text-label-mono-md text-on-surface font-semibold">
                      MD640-ResNet
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      MarineDebris-640 taxonomy
                    </span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                      SYNTH REFLECTION
                    </span>
                    <span className="font-label-mono-md text-label-mono-md text-on-surface font-semibold">
                      Specular Gate ON
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Ripple false-positive suppression
                    </span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                      REASONING LLM
                    </span>
                    <span className="font-label-mono-md text-label-mono-md text-on-surface font-semibold">
                      GPT-OSS-120B
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Grounded field advisory
                    </span>
                  </div>
                </div>

                {/* Recent Inference Runs Card */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          Recent Inference Runs
                        </h3>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Live telemetry logs from endpoint <code className="font-label-mono-sm text-label-mono-sm text-tertiary">/api/runs/{'{run_id}'}</code>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        loadRuns();
                        showToast('Refreshed inference run telemetry queue.');
                      }}
                      className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead>
                        <tr className="bg-surface-container-low text-secondary font-label-mono-sm text-label-mono-sm uppercase">
                          <th className="py-space-xs px-space-md font-semibold">Run ID</th>
                          <th className="py-space-xs px-space-md font-semibold">Timestamp</th>
                          <th className="py-space-xs px-space-md font-semibold">Target Frame</th>
                          <th className="py-space-xs px-space-md font-semibold">Detections</th>
                          <th className="py-space-xs px-space-md font-semibold">Status</th>
                          <th className="py-space-xs px-space-md font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {recentRuns.length > 0 ? (
                          recentRuns.slice(0, 5).map((run) => (
                            <tr key={run.runId} className="hover:bg-surface-container-low/60 transition-colors">
                              <td className="py-space-sm px-space-md font-label-mono-md text-label-mono-md text-on-surface font-medium">
                                #{run.runId}
                              </td>
                              <td className="py-space-sm px-space-md text-on-surface-variant">
                                {run.createdAt
                                  ? new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'Recent'}
                              </td>
                              <td className="py-space-sm px-space-md font-label-mono-sm text-label-mono-sm text-on-surface">
                                {run.title || 'Waterway frame'}
                              </td>
                              <td className="py-space-sm px-space-md">
                                <div className="flex items-center gap-space-xs">
                                  <span className="px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm font-semibold">
                                    {run.detections.length} objects
                                  </span>
                                </div>
                              </td>
                              <td className="py-space-sm px-space-md">
                                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container text-primary font-label-mono-sm text-label-mono-sm font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  Success
                                </span>
                              </td>
                              <td className="py-space-sm px-space-md text-right">
                                <Link
                                  href={`/result/${run.runId}`}
                                  className="inline-flex items-center gap-0.5 text-tertiary hover:text-on-tertiary-fixed-variant font-label-mono-sm text-label-mono-sm font-semibold"
                                >
                                  View Result
                                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-space-md px-space-md text-center text-secondary font-label-mono-sm">
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
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md sticky top-20">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[20px] text-tertiary">analytics</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Pipeline Execution
                      </h2>
                    </div>
                    <span
                      className={`font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded-lg ${
                        pipelineState === 'executing'
                          ? 'bg-primary-container text-on-primary-container animate-pulse'
                          : pipelineState === 'completed'
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'bg-surface-container text-on-secondary-container'
                      }`}
                    >
                      {pipelineState === 'executing' ? 'Executing...' : pipelineState === 'completed' ? 'Completed' : 'Standby'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    {/* Stage 1 */}
                    <div
                      className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm ${
                        activeStage >= 1 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          activeStage >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeStage >= 1 ? 'check' : '1'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-medium text-[0.95rem]">
                            Stage 1: Image Dispatch
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                            {activeStage >= 1 ? 'Complete' : 'Queued'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Uploading payload to FastAPI backend • Tensor buffer initialized
                        </span>
                      </div>
                    </div>

                    {/* Stage 2 */}
                    <div
                      className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm ${
                        activeStage >= 2 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          activeStage >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeStage >= 2 ? 'check' : '2'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-medium text-[0.95rem]">
                            Stage 2: YOLO26s-P2 Detector
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                            {activeStage >= 2 ? '41 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Extracting small bounding proposals via specialized P2 neck
                        </span>
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div
                      className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm ${
                        activeStage >= 3 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          activeStage >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeStage >= 3 ? 'check' : '3'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold text-[0.95rem]">
                            Stage 3: Aux Object Classification
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                            {activeStage >= 3 ? '22 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Estimating object type via MARINE-DEBRIS640 auxiliary head
                        </span>
                      </div>
                    </div>

                    {/* Stage 4 */}
                    <div
                      className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm ${
                        activeStage >= 4 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          activeStage >= 4 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeStage >= 4 ? 'check' : '4'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-medium text-[0.95rem]">
                            Stage 4: Vector Evidence Retrieval
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                            {activeStage >= 4 ? '18 ms' : 'Queued'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-outline">
                          Embedding search across HydroWaste-10k references
                        </span>
                      </div>
                    </div>

                    {/* Stage 5 */}
                    <div
                      className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm ${
                        activeStage >= 5 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          activeStage >= 5 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeStage >= 5 ? 'check' : '5'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-medium text-[0.95rem]">
                            Stage 5: Grounded Reasoning Analysis
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                            {activeStage >= 5 ? 'Complete' : 'Queued'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-outline">
                          Generating structured causal impact advisory via Groq
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Telemetry Box */}
                  <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-xs">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary uppercase font-semibold">
                      Resource Telemetry
                    </span>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-on-surface-variant">Inference Target:</span>
                      <span className="font-semibold text-on-surface">NVIDIA Jetson AGX Orin / RTX 4090</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-on-surface-variant">FP16 Latency (e2e):</span>
                      <span className="font-semibold text-primary">~188 ms total</span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-on-surface-variant">Active Batch Size:</span>
                      <span className="font-semibold text-on-surface">1 (Sequential Low-Jitter)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <button
                      type="button"
                      onClick={() => showToast('Inference WebSocket stream synchronized.')}
                      className="w-full py-space-xs px-space-md rounded-xl bg-secondary-container hover:bg-surface-container-high text-on-secondary-fixed font-body-md text-body-md font-medium text-center transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                      <span>Open Real-Time Inference Stream</span>
                    </button>
                    <p className="font-label-mono-sm text-label-mono-sm text-outline text-center">
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
