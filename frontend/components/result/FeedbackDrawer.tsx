'use client';

import React, { useState } from 'react';
import { BoundingBox } from '@/types';
import { X, CheckCircle, Info } from 'lucide-react';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawnBox: BoundingBox | null;
  onSubmitMissedBox: (box: BoundingBox, note?: string) => void;
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({
  isOpen,
  onClose,
  drawnBox,
  onSubmitMissedBox,
}) => {
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawnBox) return;
    onSubmitMissedBox(drawnBox, note);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNote('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Submit Missed Floating Object
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">Feedback Recorded</p>
            <p className="text-xs text-slate-500">
              The bounding coordinates have been stored locally for dataset error analysis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs text-slate-600">
              {drawnBox ? (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <span className="font-semibold text-slate-800 block mb-0.5 font-sans">
                    Captured Box Coordinates:
                  </span>
                  <span>
                    X: [{(drawnBox.x1 * 100).toFixed(0)}% &rarr; {(drawnBox.x2 * 100).toFixed(0)}%], Y:{' '}
                    [{(drawnBox.y1 * 100).toFixed(0)}% &rarr; {(drawnBox.y2 * 100).toFixed(0)}%]
                  </span>
                </div>
              ) : (
                <p>Please drag a box over the missed object on the photo.</p>
              )}
            </div>

            <div>
              <label htmlFor="feedback-note" className="text-xs font-semibold text-slate-800 block mb-1">
                Optional Annotation Context:
              </label>
              <textarea
                id="feedback-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Small bottle partially obscured by sunlight reflection or current wake..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
              <span>
                Feedback is retained for research inspection and does not alter server weights automatically.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!drawnBox}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Save Annotation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
