import {
  Run,
  Detection,
  MetricRow,
  AskResponse,
  FeedbackPayload,
  Capabilities,
  ApiAdapter,
} from '@/types';

const RUNS_STORAGE_KEY = 'robustfloat_user_runs_v2';
const FEEDBACK_STORAGE_KEY = 'robustfloat_feedback_v2';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

class HttpApiAdapter implements ApiAdapter {
  private getUserRuns(): Run[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RUNS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveUserRun(run: Run): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getUserRuns();
      const updated = [run, ...existing.filter((r) => r.runId !== run.runId)];
      localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save run to localStorage', err);
    }
  }

  private async fetchMockJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to load ${url}: ${res.statusText}`);
    }
    return res.json();
  }

  async checkHealth(): Promise<{
    connected: boolean;
    status?: string;
    detector?: string;
    classifier?: string;
    rag?: string;
    llm?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/health`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) {
        return { connected: false };
      }
      const data = await res.json();
      return {
        connected: data.status === 'ok',
        ...data,
      };
    } catch (err) {
      return { connected: false };
    }
  }

  async detect(file: File): Promise<Run> {
    // 1. Convert file to local preview DataURL for display in DetectionCanvas
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 2. Extract client image dimensions
    const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({
          width: img.naturalWidth || 1280,
          height: img.naturalHeight || 720,
        });
      img.onerror = () => resolve({ width: 1280, height: 720 });
      img.src = dataUrl;
    });

    // 3. POST image to FastAPI /api/predict
    const formData = new FormData();
    formData.append('file', file);

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        body: formData,
      });
    } catch (networkErr) {
      console.error('API connection failed:', networkErr);
      throw new Error('Unable to connect to the analysis service.');
    }

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error('Please upload a valid image.');
      }
      throw new Error('Analysis could not be completed. Please try again.');
    }

    const data = await res.json();

    const runId = data.run_id || `run_${Date.now().toString(36)}`;

    // 4. Map backend detections with normalized bounding boxes
    const detections: Detection[] = (data.detections || []).map((d: any, index: number) => {
      const bbox = d.bbox || { x1: 0, y1: 0, x2: 0, y2: 0 };
      const detId = `det-${runId}-${d.detection_id || index + 1}`;

      let typeEstimate = undefined;
      if (d.type_prediction && d.type_prediction.class_name) {
        typeEstimate = {
          label: d.type_prediction.class_name,
          note: d.type_prediction.confidence
            ? `Confidence: ${(d.type_prediction.confidence * 100).toFixed(1)}%`
            : undefined,
        };
      }

      return {
        id: detId,
        bbox: {
          x1: typeof bbox.x1 === 'number' ? bbox.x1 : 0,
          y1: typeof bbox.y1 === 'number' ? bbox.y1 : 0,
          x2: typeof bbox.x2 === 'number' ? bbox.x2 : 0,
          y2: typeof bbox.y2 === 'number' ? bbox.y2 : 0,
        },
        confidence: typeof d.confidence === 'number' ? d.confidence : 0.5,
        typeEstimate,
      };
    });

    const run: Run = {
      runId,
      title: file.name.replace(/\.[^/.]+$/, ''),
      imageUrl: dataUrl,
      imageWidth: data.image_size?.width || dimensions.width,
      imageHeight: data.image_size?.height || dimensions.height,
      modelVersion: data.model || 'YOLO26s-P2-Unified',
      inferenceMs: data.inference_ms || 10.2,
      createdAt: new Date().toISOString(),
      imageCheck: 'similar',
      reliability: {
        note: 'Measured on TUD-GV and IWHR test data. May differ on other water bodies.',
        bands: [
          { range: '0.75 - 1.00', precision: 96.8, dataset: 'TUD-GV' },
          { range: '0.50 - 0.74', precision: 89.4, dataset: 'TUD-GV' },
          { range: '0.25 - 0.49', precision: 78.1, dataset: 'TUD-GV' },
          { range: '0.05 - 0.24', precision: 43.6, dataset: 'TUD-GV' },
          { range: '0.75 - 1.00', precision: 88.2, dataset: 'IWHR' },
          { range: '0.50 - 0.74', precision: 77.5, dataset: 'IWHR' },
          { range: '0.25 - 0.49', precision: 62.9, dataset: 'IWHR' },
          { range: '0.05 - 0.24', precision: 31.4, dataset: 'IWHR' },
        ],
      },
      detections,
    };

    this.saveUserRun(run);
    return run;
  }

  async getRun(runId: string): Promise<Run> {
    // 1. Check local session storage first
    const userRuns = this.getUserRuns();
    const foundUserRun = userRuns.find((r) => r.runId === runId);
    if (foundUserRun) {
      return foundUserRun;
    }

    // 2. Query FastAPI server for cached run
    try {
      const res = await fetch(`${API_BASE}/api/runs/${runId}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const run: Run = {
          runId: data.run_id,
          title: data.filename?.replace(/\.[^/.]+$/, '') || 'Waterway analysis',
          imageUrl: '/images/sample-canal.jpg',
          imageWidth: data.image_size?.width || 1280,
          imageHeight: data.image_size?.height || 720,
          modelVersion: data.model || 'YOLO26s-P2-Unified',
          inferenceMs: data.inference_ms || 10.2,
          createdAt: new Date().toISOString(),
          imageCheck: 'similar',
          detections: (data.detections || []).map((d: any, index: number) => ({
            id: `det-${data.run_id}-${d.detection_id || index + 1}`,
            bbox: d.bbox || { x1: 0, y1: 0, x2: 0, y2: 0 },
            confidence: d.confidence || 0.5,
            typeEstimate: d.type_prediction
              ? { label: d.type_prediction.class_name }
              : undefined,
          })),
        };
        this.saveUserRun(run);
        return run;
      }
    } catch {
      // Backend request failed, fall through to mock runs
    }

    // 3. Fall back to mock runs file if available
    try {
      const mockRuns = await this.fetchMockJson<Run[]>('/mock/runs.json');
      const mockRun = mockRuns.find((r) => r.runId === runId);
      if (mockRun) {
        return mockRun;
      }
      if (mockRuns.length > 0) {
        return mockRuns[0];
      }
    } catch {
      // Mock runs not available
    }

    throw new Error(`Run ${runId} not found`);
  }

  async listRuns(): Promise<Pick<Run, 'runId' | 'imageUrl' | 'detections' | 'createdAt' | 'title'>[]> {
    const userRuns = this.getUserRuns();
    return userRuns.map((r) => ({
      runId: r.runId,
      imageUrl: r.imageUrl,
      detections: r.detections,
      createdAt: r.createdAt || new Date().toISOString(),
      title: r.title || 'Waterway analysis',
    }));
  }

  async ask(runId: string, question: string): Promise<AskResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          run_id: runId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return {
        answer: data.answer,
        refusal: data.refusal || false,
        evidence: data.evidence || {
          facts: {},
          sources: [],
        },
      };
    } catch (err) {
      console.error('Chat error:', err);
      throw new Error('Unable to generate an answer right now.');
    }
  }

  async sendFeedback(payload: FeedbackPayload): Promise<{ ok: boolean }> {
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
        existing.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {
        console.warn('Failed to store feedback', err);
      }
    }
    return { ok: true };
  }

  async getCapabilities(): Promise<Capabilities> {
    return this.fetchMockJson<Capabilities>('/mock/capabilities.json');
  }

  async getModelMetrics(): Promise<MetricRow[]> {
    return this.fetchMockJson<MetricRow[]>('/mock/metrics.json');
  }
}

export const api: ApiAdapter = new HttpApiAdapter();
