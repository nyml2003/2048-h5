import { useEffect, useEffectEvent } from "react";
import type { Dispatch } from "react";

import {
  resolveKeyboardAction,
  shouldPreventKeyboardScroll,
} from "@/app/appKeyboard";
import type { AppAction, AppState } from "@/app/appState";

export function useAppKeyboard(state: AppState, dispatch: Dispatch<AppAction>) {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (shouldPreventKeyboardScroll(event.code)) {
      event.preventDefault();
    }

    const action = resolveKeyboardAction(state, event.code);

    if (!action) {
      return;
    }

    dispatch(action);
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [handleKeyDown]);
}
