import { useEffect, useEffectEvent } from "react";
import type { Dispatch } from "react";

import { planAiAction } from "@/app/gameGateway";
import type { AppAction, AppState } from "@/app/appState";

function canAutoplay(state: AppState): boolean {
  return (
    state.playerMode === "ai" &&
    state.screen === "game" &&
    (state.game as { status?: unknown }).status === "running"
  );
}

export function useAutoplay(state: AppState, dispatch: Dispatch<AppAction>) {
  const autoplayEnabled = canAutoplay(state);

  const runAutoplayFrame = useEffectEvent(() => {
    if (!canAutoplay(state)) {
      return;
    }

    const action = planAiAction(state.game);

    if (!action) {
      return;
    }

    dispatch({ type: "control", control: action });
  });

  useEffect(() => {
    if (!autoplayEnabled) {
      return undefined;
    }

    let frameId = 0;

    const run = () => {
      runAutoplayFrame();
      frameId = window.requestAnimationFrame(run);
    };

    frameId = window.requestAnimationFrame(run);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [autoplayEnabled, runAutoplayFrame]);
}
