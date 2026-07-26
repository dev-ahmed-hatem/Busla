"use client";

import { useEffect, useRef } from "react";

/**
 * Subscribe to a backend Channels WebSocket topic. Phase 0 provides the hook shape;
 * a shared connection manager + Query-cache patching land with Live Tracking (Phase 4).
 */
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";

export function useChannel<T = unknown>(
  path: string,
  onMessage: (msg: T) => void,
  enabled = true,
) {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (!enabled) return;
    const ws = new WebSocket(`${WS_BASE}${path}`);
    ws.onmessage = (event) => {
      try {
        handlerRef.current(JSON.parse(event.data) as T);
      } catch {
        /* ignore malformed frames */
      }
    };
    return () => ws.close();
  }, [path, enabled]);
}
