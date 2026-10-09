'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Run } from '@/types';
import { Clock, ArrowRight, Trash2, Layers } from 'lucide-react';

type HistoryItem = Pick<Run, 'runId' | 'imageUrl' | 'detections' | 'createdAt' | 'title'>;

export function HistoryList() {
  const [runs, setRuns] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const items = await api.listRuns();
      setRuns(items);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      if (window.confirm('Clear all local analysis history? This cannot be undone.')) {
        localStorage.removeItem('robustfloat_user_runs_v2');
        setRuns([]);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="inline-block w-6 h-6 border-2 border-zinc-200 border-t-teal-800 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Loading analysis history...</p>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 bg-white rf-card">
        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">No session scans recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Photographs you upload for floating waste inspection will appear here in your browser session.
          </p>
        </div>
        <div>
          <Link
            href="/analyze"
            className="rf-btn-primary text-xs py-2"
          >
            <span>Analyze a photograph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <p className="text-xs text-slate-600">
          <strong className="font-semibold text-slate-900">{runs.length}</strong> {runs.length === 1 ? 'analysis' : 'analyses'} saved in this browser.
        </p>
        <button
          onClick={handleClearHistory}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear history</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {runs.map((run) => {
          const countAtDefault = run.detections.filter((d) => d.confidence >= 0.25).length;
          const formattedDate = run.createdAt
            ? new Date(run.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent';

          return (
            <Link
              key={run.runId}
              href={`/result/${run.runId}`}
              className="group rf-card hover:border-teal-700/60 overflow-hidden transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      run.imageUrl?.startsWith('/api/')
                        ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}${run.imageUrl}`
                        : run.imageUrl
                    }
                    alt={run.title || 'Waterway analysis'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-black/75 text-white backdrop-blur-xs">
                    {countAtDefault} visible (&ge;0.25)
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors truncate">
                    {run.title || 'Waterway analysis'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{formattedDate}</p>
                </div>
              </div>

              <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="text-[11px] text-slate-500 font-mono">
                  {run.detections.length} candidate boxes
                </span>
                <span className="text-teal-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Open workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
