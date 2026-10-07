'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye } from 'lucide-react';

export const SampleThumbnails = () => {
  const samples = [
    {
      runId: 'run-danube-bottle',
      title: 'Danube River surface',
      domain: 'TUD-GV Urban River',
      description: 'Multiple floating-waste objects in surface current with reflection.',
      imageUrl: '/images/sample-danube-bottle.webp',
      badge: 'Typical inland river',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      runId: 'run-clean-water',
      title: 'Calm lake reservoir',
      domain: 'IWHR Reservoir Split',
      description: 'Clear water surface to verify true-negative and zero-detection handling.',
      imageUrl: '/images/sample-clean-water.webp',
      badge: 'Zero detections',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      runId: 'run-turbid-reservoir',
      title: 'Turbid waterway channel',
      domain: 'Domain Shift Test',
      description: 'High silt environment flagged as unlike benchmark distributions.',
      imageUrl: '/images/sample-turbid-reservoir.webp',
      badge: 'Unlike benchmarks',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="pt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Or inspect sample benchmark images:
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-zinc-200">
            Verified Test Captures
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {samples.map((sample) => (
          <Link
            key={sample.runId}
            href={`/result/${sample.runId}`}
            className="group border border-zinc-200 hover:border-teal-700/60 rounded-card bg-white overflow-hidden transition-all duration-200 hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-slate-100 border-b border-zinc-200 overflow-hidden">
                <Image
                  src={sample.imageUrl}
                  alt={sample.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium border shadow-xs ${sample.badgeStyle}`}
                >
                  {sample.badge}
                </span>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs">
                  {sample.domain}
                </span>
              </div>

              <div className="p-3.5 space-y-1">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {sample.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {sample.description}
                </p>
              </div>
            </div>

            <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[11px] font-medium text-teal-800">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Open sample workspace</span>
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
