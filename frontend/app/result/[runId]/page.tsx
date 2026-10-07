'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Run, BoundingBox } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DetectionCanvas } from '@/components/result/DetectionCanvas';
import { SummaryCard } from '@/components/result/SummaryCard';
import { TechnicalDetails } from '@/components/result/TechnicalDetails';
import { DetectionList } from '@/components/result/DetectionList';
import { FeedbackDrawer } from '@/components/result/FeedbackDrawer';
import { ChatPanel } from '@/components/result/ChatPanel';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const runId = params?.runId as string;

  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Workspace interactive state
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.25);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);

  // Feedback & Missed Box State
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [drawnBox, setDrawnBox] = useState<BoundingBox | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    api
      .checkHealth()
      .then((res) => setBackendConnected(res.connected))
      .catch(() => setBackendConnected(false));
  }, []);

  useEffect(() => {
    if (!runId) return;

    setLoading(true);
    api
      .getRun(runId)
      .then((data) => {
        setRun(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load run', err);
        setError('Analysis could not be found or loaded.');
      })
      .finally(() => setLoading(false));
  }, [runId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-24 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">Loading analysis workspace...</h2>
            <p className="text-xs text-slate-500 font-mono">Fetching candidate telemetry and model predictions</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Analysis Not Found</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {error || 'This analysis session does not exist or has expired from local browser storage.'}
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to analysis</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter detections by active confidence threshold
  const visibleDetections = run.detections.filter((d) => d.confidence >= confidenceThreshold);

  const handleFeedback = (detectionId: string, type: 'correct' | 'not_waste') => {
    api.sendFeedback({
      runId: run.runId,
      detectionId,
      type,
    });
  };

  const handleCompleteDrawnBox = (box: BoundingBox) => {
    setDrawnBox(box);
    setIsDrawingMode(false);
    setIsFeedbackOpen(true);
  };

  const handleSubmitMissedBox = (box: BoundingBox, note?: string) => {
    api.sendFeedback({
      runId: run.runId,
      type: 'missed_object',
      missedBbox: box,
      note,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 1. COMPACT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1.5">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span>Back to analysis</span>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                Waterway analysis
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Image-based floating-waste detection
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {backendConnected !== null && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100/80 border border-slate-200/60">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{backendConnected ? 'Backend connected' : 'Backend unavailable'}</span>
              </div>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono text-slate-500 bg-slate-100/80 border border-slate-200/60">
              {run.modelVersion || 'YOLO26s-P2 Unified'}
            </span>
          </div>
        </div>

        {/* Warning Banner for Unlike Benchmark Data */}
        {run.imageCheck === 'unlike' && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-semibold block text-amber-950">
                Unlike Benchmark Training Distributions: Results May Be Uncertain
              </strong>
              <p className="text-amber-900">
                This water body exhibits high silt/turbidity, severe specular glare, or an extreme perspective differing from the TUD-GV and IWHR training splits. Candidate detections should be scrutinized carefully for false positives or false negatives.
              </p>
            </div>
          </div>
        )}

        {/* 2. MAIN 60/40 WORKSPACE LAYOUT:
            Desktop:
            LEFT (approx 60%):
              - 1. Image card (DetectionCanvas)
              - 2. What was detected (DetectionList)
              - 3. Technical details (TechnicalDetails collapsible containing telemetry + evaluation reliability)
            RIGHT (approx 40%):
              - 1. Summary card (SummaryCard with dynamic detection count, confidence slider, interpretation note)
              - 2. Chat panel (ChatPanel with assistant & user messages, input, collapsed sources)
            Mobile:
              Stacks vertically in clean reading hierarchy:
              Image -> What was detected -> Technical details -> Summary -> Chat
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60%): Image, What Was Detected, Technical Details */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* 1. Image Card */}
            <DetectionCanvas
              imageUrl={run.imageUrl}
              imageWidth={run.imageWidth}
              imageHeight={run.imageHeight}
              detections={visibleDetections}
              selectedDetectionId={selectedDetectionId}
              onSelectDetection={setSelectedDetectionId}
              showBoxes={showBoxes}
              onToggleShowBoxes={() => setShowBoxes(!showBoxes)}
              isDrawingMode={isDrawingMode}
              onCancelDrawingMode={() => setIsDrawingMode(false)}
              onCompleteDrawnBox={handleCompleteDrawnBox}
            />

            {/* 2. What was detected (Detection List) */}
            <DetectionList
              detections={visibleDetections}
              selectedDetectionId={selectedDetectionId}
              onSelectDetection={setSelectedDetectionId}
              onSendFeedback={handleFeedback}
              onTriggerDrawMissed={() => setIsDrawingMode(true)}
            />

            {/* 3. Secondary Technical Details & Benchmark Evaluation Collapsible */}
            <TechnicalDetails
              run={run}
              confidenceThreshold={confidenceThreshold}
              visibleCount={visibleDetections.length}
            />
          </div>

          {/* Right Column (40%): Summary & Chat Assistant */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            {/* 1. Detection Summary */}
            <SummaryCard
              run={run}
              confidenceThreshold={confidenceThreshold}
              onThresholdChange={setConfidenceThreshold}
              visibleCount={visibleDetections.length}
            />

            {/* 2. Chat Assistant */}
            <ChatPanel runId={run.runId} />
          </div>
        </div>
      </main>

      {/* Missed Box Annotation Modal */}
      <FeedbackDrawer
        isOpen={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setDrawnBox(null);
        }}
        drawnBox={drawnBox}
        onSubmitMissedBox={handleSubmitMissedBox}
      />

      <Footer />
    </div>
  );
}
