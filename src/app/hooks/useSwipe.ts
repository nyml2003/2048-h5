import { useRef } from "react";
import type { PointerEventHandler } from "react";

import type { ControlAction } from "@/game/core/types";

const SWIPE_THRESHOLD = 28;

interface SwipeHandlers {
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onPointerCancel: PointerEventHandler<HTMLElement>;
}

interface SwipeState {
  pointerId: number;
  startX: number;
  startY: number;
}

function resolveSwipeAction(deltaX: number, deltaY: number): ControlAction | null {
  if (Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) {
    return null;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  }

  return deltaY > 0 ? "down" : "up";
}

export function useSwipe(onAction: (action: ControlAction) => void): SwipeHandlers {
  const swipeStateRef = useRef<SwipeState | null>(null);

  const onPointerDown: PointerEventHandler<HTMLElement> = (event) => {
    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const onPointerUp: PointerEventHandler<HTMLElement> = (event) => {
    const state = swipeStateRef.current;

    if (!state || state.pointerId !== event.pointerId) {
      return;
    }

    swipeStateRef.current = null;

    const action = resolveSwipeAction(
      event.clientX - state.startX,
      event.clientY - state.startY
    );

    if (action) {
      onAction(action);
    }
  };

  const onPointerCancel: PointerEventHandler<HTMLElement> = () => {
    swipeStateRef.current = null;
  };

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}
