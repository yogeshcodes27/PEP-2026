import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HistoryList } from '@/components/history/HistoryList';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
            <span>Local Browser Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis Session History
          </h1>
          <p className="text-sm text-slate-600">
            Photographs uploaded and evaluated in this browser. Click any scan to reopen its detection workspace and adjust thresholds.
          </p>
        </div>

        <HistoryList />
      </main>

      <Footer />
    </div>
  );
}
