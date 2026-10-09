import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HistoryList } from '@/components/history/HistoryList';

export default function HistoryPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 pb-12 flex-1 max-w-7xl mx-auto px-gutter-lg space-y-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-surface-container-high text-on-secondary-container self-start">
            <span>Local Browser Sessions</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Analysis Session History
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Photographs uploaded and evaluated in this browser. Click any scan to reopen its detection workspace and adjust thresholds.
          </p>
        </div>

        <HistoryList />
      </main>

      <Footer />
    </div>
  );
}
