export type BoundingBox = {
  x1: number; // normalized 0..1 (left)
  y1: number; // normalized 0..1 (top)
  x2: number; // normalized 0..1 (right)
  y2: number; // normalized 0..1 (bottom)
};

export type MaterialEstimateLabel =
  | 'plastic bottle'
  | 'plastic bag'
  | 'plastic container'
  | 'metal can'
  | 'foam'
  | 'paper or cardboard'
  | 'glass'
  | 'organic debris'
  | 'mixed waste'
  | 'not waste'
  | 'unknown'
  | 'Too small to assess';

/*
 * Auxiliary MARINE-DEBRIS640 classifier result.
 *
 * These are model predictions, not guaranteed ground truth.
 */
export type TypePrediction = {
  class_id?: number;
  class_name: string;
  confidence?: number;
};

export type Detection = {
  id: string;

  bbox: BoundingBox;

  confidence: number; // 0..1

  /*
   * Existing frontend material estimate.
   * Kept for compatibility with the rest of the application.
   */
  typeEstimate?: {
    label: MaterialEstimateLabel;
    note?: string;
  };

  /*
   * MARINE-DEBRIS640 auxiliary classifier result.
   *
   * This matches the backend field:
   * type_prediction
   */
  type_prediction?: TypePrediction;
};

export type ReliabilityBand = {
  range: string;
  precision: number;
  dataset: string;
};

export type ImageCheckStatus =
  | 'similar'
  | 'borderline'
  | 'unlike';

export type Run = {
  runId: string;
  imageUrl: string;
  image_url?: string;
  imageWidth: number;
  imageHeight: number;
  modelVersion: string;
  inferenceMs: number;

  /*
   * Stored at low confidence (~0.05)
   */
  detections: Detection[];

  reliability?: {
    bands: ReliabilityBand[];
    note: string;
  };

  imageCheck?: ImageCheckStatus;

  createdAt?: string;

  title?: string;
};

export type MetricRow = {
  model: string;
  dataset: string;
  threshold: number;
  precision: number;
  recall: number;
  f1: number;
  map50: number;
  map50_95: number;
  note: string;
};

export type AskResponse = {
  answer: string;
  refusal?: boolean;

  evidence: {
    facts: Record<string, string | number>;
    sources: {
      name: string;
      chunkId: string;
    }[];
  };
};

export type FeedbackPayload = {
  runId: string;
  detectionId?: string;

  type:
    | 'correct'
    | 'not_waste'
    | 'missed_object';

  missedBbox?: BoundingBox;

  note?: string;
};

export type Capabilities = {
  disposalGuidance: boolean;
  typeEstimate: boolean;
};

export interface ApiAdapter {
  detect(file: File): Promise<Run>;

  getRun(runId: string): Promise<Run>;

  listRuns(): Promise<
    Pick<
      Run,
      | 'runId'
      | 'imageUrl'
      | 'detections'
      | 'createdAt'
      | 'title'
    >[]
  >;

  ask(
    runId: string,
    question: string
  ): Promise<AskResponse>;

  sendFeedback(
    payload: FeedbackPayload
  ): Promise<{ ok: boolean }>;

  getCapabilities(): Promise<Capabilities>;

  getModelMetrics(): Promise<MetricRow[]>;

  checkHealth(): Promise<{
    connected: boolean;
    status?: string;
    detector?: string;
    rag?: string;
    llm?: string;
  }>;
}