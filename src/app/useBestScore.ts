import { useEffect } from "react";
import type { Dispatch } from "react";

import type { AppAction, AppState } from "@/app/appState";

const BEST_SCORE_KEY = "2048-h5.best-score";

function parseStoredScore(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.floor(parsed);
}

export function useBestScorePersistence(state: AppState, dispatch: Dispatch<AppAction>) {
  useEffect(() => {
    const stored = parseStoredScore(window.localStorage.getItem(BEST_SCORE_KEY));

    if (stored > state.bestScore) {
      dispatch({ type: "setBestScore", score: stored });
    }
  }, [dispatch, state.bestScore]);

  useEffect(() => {
    window.localStorage.setItem(BEST_SCORE_KEY, String(state.bestScore));
  }, [state.bestScore]);
}
