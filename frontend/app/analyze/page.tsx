import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Dropzone } from '@/components/upload/Dropzone';
import { SampleThumbnails } from '@/components/upload/SampleThumbnails';
import { HowItWorksStrip } from '@/components/upload/HowItWorksStrip';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
            <span>Inference Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Analyze Waterway Imagery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Upload an image of a river, canal, or reservoir. RobustFloat localizes visible floating-waste candidate boxes using a cross-domain detector evaluated on public inland-water benchmarks.
          </p>
        </div>

        {/* Concise Scientific Limitation Callout (Requested by User) */}
        <div className="p-4 rounded-card bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-semibold block text-amber-950">
              Important Scope Limitation:
            </strong>
            <p className="text-amber-900">
              The model analyzes visible objects in the image. It does not measure water quality, pathogens, or chemical contamination.
            </p>
          </div>
        </div>

        {/* Upload Dropzone: Main Focus of the Page */}
        <section className="space-y-6">
          <Dropzone />

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-control border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-slate-900">Session confidentiality:</strong> Uploaded images are processed locally in your browser session for candidate detection. Photos are not archived, shared, or used to retrain models without permission.
            </p>
          </div>

          {/* Benchmark Sample Thumbnails */}
          <SampleThumbnails />
        </section>

        {/* How It Works Strip */}
        <HowItWorksStrip />
      </main>

      <Footer />
    </div>
  );
}
