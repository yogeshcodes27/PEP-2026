'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Upload, AlertCircle, X, Cpu, Eye, HelpCircle, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onAnalyzingStart?: (file: File) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onAnalyzingStart }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState<File | null>(null);
  const [analyzingPreviewUrl, setAnalyzingPreviewUrl] = useState<string | null>(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateAndUpload = async (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, PNG, or WEBP photograph.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size exceeds the 25 MB limit. Please select a smaller photo.');
      return;
    }

    // Set analyzing state
    setIsAnalyzing(true);
    setAnalyzingFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAnalyzingPreviewUrl(objectUrl);

    if (onAnalyzingStart) {
      onAnalyzingStart(file);
    }

    try {
      const run = await api.detect(file);
      router.push(`/result/${run.runId}`);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(
        typeof err?.message === 'string'
          ? err.message
          : 'Analysis could not be completed. Please try again.'
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setIsAnalyzing(false);
    setAnalyzingFile(null);
    if (analyzingPreviewUrl) {
      URL.revokeObjectURL(analyzingPreviewUrl);
      setAnalyzingPreviewUrl(null);
    }
  };

  // If currently analyzing, show technical Progress State
  if (isAnalyzing && analyzingPreviewUrl) {
    return (
      <div className="border border-zinc-200 rounded-card bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-700 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Running Neural Inference...
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Model: YOLO26s-P2 Unified &bull; Class: floating_waste
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-control border border-zinc-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 aspect-[4/3] bg-slate-100 rounded-control overflow-hidden border border-zinc-200 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={analyzingPreviewUrl}
              alt="Uploaded waterway being analyzed"
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-teal-900/10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600 animate-pulse" />
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-600">
                <span>Inference stage</span>
                <span className="text-teal-800 font-semibold">Extracting feature pyramid</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-zinc-200">
                <div className="h-full bg-teal-700 rounded-full animate-pulse w-3/4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-50 border border-zinc-200">
                <span className="text-[10px] uppercase text-slate-500 block">P2 High-Res Layer</span>
                <span className="font-semibold text-slate-800">80×80 grid active</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-zinc-200">
                <span className="text-[10px] uppercase text-slate-500 block">Domain Check</span>
                <span className="font-semibold text-slate-800">TUD-GV / IWHR benchmark</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Evaluating surface bounding boxes and calculating empirical confidence distributions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error alert if validation failed */}
      {errorMessage && (
        <div className="p-3.5 rounded-control bg-danger-bg text-danger border border-danger-border flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Upload Error</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-danger hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        id="upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload photo of waterway"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-card p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-teal-700 bg-teal-50/50 ring-4 ring-teal-700/10'
            : 'border-zinc-300 hover:border-teal-700 bg-slate-50/40 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-teal-800 shadow-2xs group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 stroke-[1.75]" />
          </div>

          <div className="space-y-1.5">
            <p className="text-base sm:text-lg font-bold text-slate-900">
              Drop a waterway image here, or <span className="text-teal-800 underline decoration-teal-700">browse files</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Accepts JPG, PNG, or WEBP up to 25 MB. Captured from shore, bridge, boat, or drone.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white text-slate-600 border border-zinc-200">
              Format: JPG &bull; PNG &bull; WEBP
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white text-slate-600 border border-zinc-200">
              Max size: 25 MB
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white text-slate-600 border border-zinc-200">
              Single-class detection
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory: What happens after upload */}
      <div className="border border-zinc-200 rounded-control bg-white p-4 space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
          What happens after you upload:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-teal-800 shrink-0">1.</span>
            <span>
              <strong>Local Image Intake:</strong> The photo is processed directly in your browser session without server retention.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-teal-800 shrink-0">2.</span>
            <span>
              <strong>P2 Feature Detection:</strong> The YOLO26s-P2 detector localizes candidate bounding boxes across the water surface.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-teal-800 shrink-0">3.</span>
            <span>
              <strong>Grounded Workspace:</strong> You can tune the confidence threshold, inspect boxes, and ask evidence-backed questions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
