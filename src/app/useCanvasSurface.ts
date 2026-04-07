import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";

import type { CanvasRenderer } from "@/canvas/canvasRenderer";
import { useResizeObserver } from "@/app/useResizeObserver";

export function useCanvasSurface<T>(
  value: T,
  renderer: CanvasRenderer<T>
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const scheduleRender = useEffectEvent(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;

      if (!canvasRef.current) {
        return;
      }

      renderer.render(canvasRef.current, value);
    });
  });

  useResizeObserver(canvasRef, scheduleRender);

  useLayoutEffect(() => {
    scheduleRender();
  }, [renderer, scheduleRender, value]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return canvasRef;
}
