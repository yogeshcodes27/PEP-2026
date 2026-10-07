'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MetricRow } from '@/types';
import { ShieldCheck } from 'lucide-react';

export function ModelMetricsTable() {
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getModelMetrics()
      .then(setMetrics)
      .catch((err) => console.error('Failed to load metrics', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="border border-zinc-200 rounded-card p-6 bg-white space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Benchmark Validation Metrics</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Verified Test Splits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Object detection evaluation metrics on held-out test splits from TUD-GV and IWHR benchmark datasets.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500 font-mono">Loading benchmark metrics...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-zinc-200 text-slate-500 bg-slate-50 font-medium text-[11px]">
                <th className="py-2.5 px-3">DATASET</th>
                <th className="py-2.5 px-3">MODEL</th>
                <th className="py-2.5 px-3">CONF THR</th>
                <th className="py-2.5 px-3 text-right">PRECISION</th>
                <th className="py-2.5 px-3 text-right">RECALL</th>
                <th className="py-2.5 px-3 text-right">F1</th>
                <th className="py-2.5 px-3 text-right">mAP50</th>
                <th className="py-2.5 px-3 text-right">mAP50-95</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-slate-900">
              {metrics.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">{row.dataset}</td>
                  <td className="py-3 px-3 text-slate-600">{row.model}</td>
                  <td className="py-3 px-3 text-slate-500">&ge; {row.threshold}</td>
                  <td className="py-3 px-3 text-right font-bold text-teal-800">{row.precision.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-medium">{row.recall.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-medium">{row.f1.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{row.map50.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{row.map50_95.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-1.5 pt-2 text-[11px] text-slate-500 border-t border-zinc-100 font-sans">
        <p>
          <strong className="text-slate-800 font-semibold">TUD-GV:</strong> 1,501 held-out river and canal surface images. Focuses on close-range urban and riparian debris.
        </p>
        <p>
          <strong className="text-slate-800 font-semibold">IWHR:</strong> 3,000 held-out inland hydrographic reservoir images. Features wide expanses, glint, and variable water turbidity.
        </p>
      </div>
    </div>
  );
}
