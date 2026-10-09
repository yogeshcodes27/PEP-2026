'use client';

import React, { useState } from 'react';
import { Detection } from '@/types';
import { Plus, AlertCircle, Check, X } from 'lucide-react';

interface DetectionListProps {
  detections: Detection[];
  selectedDetectionId: string | null;
  onSelectDetection: (id: string | null) => void;
  onSendFeedback: (detectionId: string, type: 'correct' | 'not_waste') => void;
  onTriggerDrawMissed: () => void;
  enableTypeEstimate?: boolean;
}

export const DetectionList: React.FC<DetectionListProps> = ({
  detections,
  selectedDetectionId,
  onSelectDetection,
  onSendFeedback,
  onTriggerDrawMissed,
  enableTypeEstimate = true,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<
    Record<string, 'correct' | 'not_waste'>
  >({});

  const handleFeedback = (
    detectionId: string,
    type: 'correct' | 'not_waste'
  ) => {
    setFeedbackGiven((prev) => ({ ...prev, [detectionId]: type }));
    onSendFeedback(detectionId, type);
  };

  if (detections.length === 0) {
    return (
      <div className="border border-slate-200/80 rounded-xl bg-white p-5 sm:p-6 text-center space-y-3.5 shadow-xs">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center mx-auto text-slate-500">
          <AlertCircle className="w-4 h-4" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">
            No visible floating-waste detections at this threshold
          </p>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            No bounding candidates meet the current confidence cutoff. Try
            lowering the confidence slider or inspecting the image directly.
          </p>
        </div>

        <button
          type="button"
          onClick={onTriggerDrawMissed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Report a missed object</span>
        </button>
      </div>
    );
  }

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white p-4 sm:p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Visible detections
            </h3>

            <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200/60">
              {detections.length}
            </span>
          </div>

          <span className="text-xs text-slate-500 mt-0.5 block">
            Select a row to highlight its position in the image
          </span>
        </div>

        <button
          type="button"
          onClick={onTriggerDrawMissed}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Mark a missed object on the photo"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Report missed</span>
        </button>
      </div>

      {/* Detections List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {detections.map((det, index) => {
          const isSelected = selectedDetectionId === det.id;

          const boxAreaPct = (
            (det.bbox.x2 - det.bbox.x1) *
            (det.bbox.y2 - det.bbox.y1) *
            100
          ).toFixed(1);

          const feedbackStatus = feedbackGiven[det.id];

          return (
            <div
              key={det.id}
              onClick={() =>
                onSelectDetection(isSelected ? null : det.id)
              }
              onMouseEnter={() => onSelectDetection(det.id)}
              className={`p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-600 shadow-2xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                {/* Left: Compact ID + Confidence + Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-slate-800">
                      #{index + 1}
                    </span>

                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-slate-900">
                      {det.confidence.toFixed(2)}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {boxAreaPct}% of frame
                    </span>
                  </div>

                  {/* Actual runtime classifier prediction */}
                  {enableTypeEstimate && det.typeEstimate && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                      <span className="font-medium text-slate-700">
                        Classified as:
                      </span>

                      <span className="font-mono text-slate-900 font-semibold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                        {det.typeEstimate.label}
                      </span>

                      {det.typeEstimate.note && (
                        <span className="text-slate-400 text-[10px] hidden sm:inline">
                          &bull; {det.typeEstimate.note}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Feedback Controls */}
                <div
                  className="flex items-center gap-1.5 text-xs shrink-0 self-end sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {feedbackStatus ? (
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {feedbackStatus === 'correct'
                        ? 'Confirmed waste'
                        : 'Flagged false positive'}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleFeedback(det.id, 'correct')
                        }
                        className="px-2 py-1 rounded-md text-[11px] font-medium border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="Confirm this detection is floating waste"
                      >
                        Confirm waste
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleFeedback(det.id, 'not_waste')
                        }
                        className="px-2 py-1 rounded-md text-[11px] font-medium border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="Mark this detection as false positive (not waste)"
                      >
                        Not waste
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};