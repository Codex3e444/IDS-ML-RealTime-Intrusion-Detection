import { useEffect } from "react";

export type FeatureImportance = {
  feature?: string;
  importance?: number | string;
};

export type RealtimeDetectionPayload = {
  id?: string;
  pred_label?: string;
  label?: string;
  predicted?: string;
  true_label?: string;
  trueLabel?: string;
  actual?: string;
  score?: number | string;
  severity?: string;
  timestamp?: string;
  features?: Record<string, string | number | boolean | null | undefined>;
  feature_importance?: FeatureImportance[];
};

export type RealtimeMessage = {
  event?: string;
  payload?: RealtimeDetectionPayload;
};

export function useRealtime(onMessage: (data: RealtimeMessage) => void) {
  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/stream";
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("✅ WebSocket connected:", url);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as RealtimeMessage;
        onMessage(msg);
      } catch (err) {
        console.error("❌ WS parse error:", err);
      }
    };
    ws.onclose = () => console.log("🔌 WebSocket closed");
    ws.onerror = (err) => console.error("⚠️ WebSocket error", err);

    return () => ws.close();
  }, [onMessage]);
}
