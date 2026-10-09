import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HistoryList } from '@/components/history/HistoryList';

export default function HistoryPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 pb-12 flex-1 max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/80 self-start">
            <span>Local Browser Sessions</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Analysis Session History
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Photographs uploaded and evaluated in this browser. Click any scan to reopen its detection workspace and adjust thresholds.
          </p>
        </div>

        <HistoryList />
      </main>

      <Footer />
    </div>
  );
}
