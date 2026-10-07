'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Detection, BoundingBox } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

interface DetectionCanvasProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  detections: Detection[];
  selectedDetectionId: string | null;
  onSelectDetection: (id: string | null) => void;
  showBoxes: boolean;
  onToggleShowBoxes: () => void;
  isDrawingMode?: boolean;
  onCancelDrawingMode?: () => void;
  onCompleteDrawnBox?: (box: BoundingBox) => void;
}

export const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageUrl,
  imageWidth,
  imageHeight,
  detections,
  selectedDetectionId,
  onSelectDetection,
  showBoxes,
  onToggleShowBoxes,
  isDrawingMode = false,
  onCancelDrawingMode,
  onCompleteDrawnBox,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [drawingStart, setDrawingStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [currentDragBox, setCurrentDragBox] =
    useState<BoundingBox | null>(null);

  // --------------------------------------------------------
  // Format classifier label for display
  // --------------------------------------------------------

  const formatTypeLabel = (label?: string) => {
    if (!label) {
      return 'Floating waste';
    }

    return label
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // --------------------------------------------------------
  // Mouse drawing
  // --------------------------------------------------------

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawingMode || !containerRef.current) return;

    const rect =
      containerRef.current.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(
        1,
        (e.clientX - rect.left) / rect.width
      )
    );

    const y = Math.max(
      0,
      Math.min(
        1,
        (e.clientY - rect.top) / rect.height
      )
    );

    setDrawingStart({
      x,
      y,
    });

    setCurrentDragBox({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      !isDrawingMode ||
      !drawingStart ||
      !containerRef.current
    ) {
      return;
    }

    const rect =
      containerRef.current.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(
        1,
        (e.clientX - rect.left) / rect.width
      )
    );

    const y = Math.max(
      0,
      Math.min(
        1,
        (e.clientY - rect.top) / rect.height
      )
    );

    const x1 = Math.min(
      drawingStart.x,
      x
    );

    const x2 = Math.max(
      drawingStart.x,
      x
    );

    const y1 = Math.min(
      drawingStart.y,
      y
    );

    const y2 = Math.max(
      drawingStart.y,
      y
    );

    setCurrentDragBox({
      x1,
      y1,
      x2,
      y2,
    });
  };

  const handleMouseUp = () => {
    if (
      !isDrawingMode ||
      !currentDragBox ||
      !onCompleteDrawnBox
    ) {
      return;
    }

    // Require minimum box size
    if (
      Math.abs(
        currentDragBox.x2 -
          currentDragBox.x1
      ) > 0.02 &&
      Math.abs(
        currentDragBox.y2 -
          currentDragBox.y1
      ) > 0.02
    ) {
      onCompleteDrawnBox(
        currentDragBox
      );
    }

    setDrawingStart(null);
    setCurrentDragBox(null);
  };

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-xs">

      {/* ====================================================
          CARD HEADER
      ==================================================== */}

      <div className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Detected objects
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Visible floating-waste candidates in this image
          </p>
        </div>

        <div className="flex items-center gap-2">

          {isDrawingMode &&
            onCancelDrawingMode && (
              <button
                type="button"
                onClick={
                  onCancelDrawingMode
                }
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel drawing
              </button>
            )}

          <button
            type="button"
            onClick={
              onToggleShowBoxes
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {showBoxes ? (
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-500" />
            )}

            <span>
              {showBoxes
                ? 'Hide bounding boxes'
                : 'Show bounding boxes'}
            </span>
          </button>

        </div>
      </div>


      {/* ====================================================
          IMAGE + BOUNDING BOXES
      ==================================================== */}

      <div className="p-3 sm:p-4 bg-slate-50/40">

        <div
          ref={containerRef}
          onMouseDown={
            handleMouseDown
          }
          onMouseMove={
            handleMouseMove
          }
          onMouseUp={
            handleMouseUp
          }
          className={`relative w-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-950 select-none ${
            isDrawingMode
              ? 'cursor-crosshair ring-2 ring-blue-600'
              : 'cursor-default'
          }`}
          style={{
            aspectRatio: `${imageWidth} / ${imageHeight}`,
          }}
        >

          {/* ==================================================
              ORIGINAL IMAGE
          ================================================== */}

          <Image
            src={imageUrl}
            alt="Waterway photograph evaluated for floating waste"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover"
          />


          {/* ==================================================
              DETECTION BOXES
          ================================================== */}

          {showBoxes &&
            detections.map(
              (det, index) => {

                const isSelected =
                  selectedDetectionId ===
                  det.id;

                const left =
                  `${det.bbox.x1 * 100}%`;

                const top =
                  `${det.bbox.y1 * 100}%`;

                const width =
                  `${(det.bbox.x2 - det.bbox.x1) * 100}%`;

                const height =
                  `${(det.bbox.y2 - det.bbox.y1) * 100}%`;

                // ----------------------------------------------
                // Auxiliary classifier result
                // ----------------------------------------------

                const typePrediction =
                  det.type_prediction;

                const typeLabel =
                  formatTypeLabel(
                    typePrediction?.class_name
                  );

                const typeConfidence =
                  typePrediction?.confidence;


                return (
                  <div
                    key={det.id}
                    onClick={(e) => {
                      e.stopPropagation();

                      onSelectDetection(
                        isSelected
                          ? null
                          : det.id
                      );
                    }}
                    onMouseEnter={() =>
                      onSelectDetection(
                        det.id
                      )
                    }
                    onMouseLeave={() => {
                      if (!isSelected) {
                        onSelectDetection(
                          null
                        );
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Detection ${
                      index + 1
                    }, ${typeLabel}, detector confidence ${det.confidence.toFixed(
                      2
                    )}`}
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                          'Enter' ||
                        e.key === ' '
                      ) {
                        e.preventDefault();

                        onSelectDetection(
                          isSelected
                            ? null
                            : det.id
                        );
                      }
                    }}
                    className={`absolute transition-all cursor-pointer ${
                      isSelected
                        ? 'detection-box is-selected'
                        : 'detection-box'
                    }`}
                    style={{
                      left,
                      top,
                      width,
                      height,
                    }}
                  >

                    {/* ========================================
                        TYPE + CONFIDENCE LABEL
                    ======================================== */}

                    <div
                      className={`absolute -top-7 left-0 px-1.5 py-1 rounded text-[10px] font-bold leading-tight select-none shadow-xs whitespace-nowrap ${
                        isSelected
                          ? 'bg-slate-900 text-white border border-blue-400'
                          : 'bg-white/95 text-slate-900 border border-slate-300'
                      }`}
                    >

                      {/* Object number + predicted type */}

                      <div>
                        #{index + 1} ·{' '}
                        {typeLabel}
                      </div>

                      {/* Detector confidence */}

                      <div className="text-[9px] opacity-70 font-mono">
                        Detection confidence:{' '}
                        {det.confidence.toFixed(
                          2
                        )}
                      </div>

                      {/* Classifier confidence */}

                      {typePrediction &&
                        typePrediction.class_name &&
                        typeof typeConfidence ===
                          'number' && (
                          <div className="text-[9px] opacity-70 font-mono">
                            Type confidence:{' '}
                            {typeConfidence.toFixed(
                              2
                            )}
                          </div>
                        )}

                    </div>
                  </div>
                );
              }
            )}


          {/* ==================================================
              USER-DRAWN BOX
          ================================================== */}

          {isDrawingMode &&
            currentDragBox && (
              <div
                className="absolute border-2 border-dashed border-blue-400 bg-blue-500/20 pointer-events-none"
                style={{
                  left: `${
                    currentDragBox.x1 * 100
                  }%`,

                  top: `${
                    currentDragBox.y1 * 100
                  }%`,

                  width: `${
                    (currentDragBox.x2 -
                      currentDragBox.x1) *
                    100
                  }%`,

                  height: `${
                    (currentDragBox.y2 -
                      currentDragBox.y1) *
                    100
                  }%`,
                }}
              />
            )}

        </div>


        {/* ====================================================
            DRAWING MODE HELP
        ==================================================== */}

        {isDrawingMode && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">

            <span>
              Click and drag a box across any
              missed floating waste object in
              the photo above.
            </span>

            {onCancelDrawingMode && (
              <button
                type="button"
                onClick={
                  onCancelDrawingMode
                }
                className="text-xs font-semibold underline ml-2 hover:text-blue-950"
              >
                Cancel
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
};