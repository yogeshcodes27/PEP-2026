import React from 'react';
import { Upload, Eye, HelpCircle, ShieldCheck } from 'lucide-react';

export const HowItWorksStrip = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Waterway Imagery',
      desc: 'Provide a photograph of an inland water surface taken from riverbank, bridge, boat, or drone under ambient daylight.',
      icon: Upload,
    },
    {
      num: '02',
      title: 'Inspect Visible Detections',
      desc: 'Review candidate bounding boxes and tune the live confidence threshold slider to filter high vs lower-scoring objects.',
      icon: Eye,
    },
    {
      num: '03',
      title: 'Ask Grounded Questions',
      desc: 'Query detection counts, score reliability, and benchmark boundaries with evidence citations directly from the research base.',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="pt-8 pb-4 border-t border-zinc-200 mt-10">
      <div className="mb-5 space-y-1">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-800">
          User Guide
        </span>
        <h3 className="text-base font-bold text-slate-900">
          How to evaluate waterway imagery
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="border border-zinc-200 rounded-card p-5 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-800">
                  Step {s.num}
                </span>
                <div className="w-8 h-8 rounded-control bg-white border border-zinc-200 flex items-center justify-center text-teal-800 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                {s.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
