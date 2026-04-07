import type { AppAction, AppState } from "@/app/state/types";
import type { ControlAction } from "@/game/core/types";

const CONTROL_KEYS: Record<string, ControlAction> = {
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
};

function resolveControl(code: string): ControlAction | null {
  return CONTROL_KEYS[code] ?? null;
}

export function shouldPreventKeyboardScroll(code: string): boolean {
  return code in CONTROL_KEYS || code === "Space";
}

export function resolveKeyboardAction(state: AppState, code: string): AppAction | null {
  if (state.screen === "home") {
    if (code === "Enter") {
      return { type: "start" };
    }

    if (code === "KeyA") {
      return { type: "startAi" };
    }

    if (code === "KeyH") {
      return { type: "openHelp" };
    }

    return null;
  }

  if (state.screen === "help") {
    if (code === "Enter") {
      return { type: "start" };
    }

    if (code === "KeyA") {
      return { type: "startAi" };
    }

    if (code === "Escape") {
      return { type: "goHome" };
    }

    if (code === "ArrowLeft") {
      return { type: "setHelpPage", page: state.helpPage - 1 };
    }

    if (code === "ArrowRight") {
      return { type: "setHelpPage", page: state.helpPage + 1 };
    }

    return null;
  }

  if (state.screen === "game") {
    if (code === "Escape" || code === "KeyP") {
      return { type: "openSettings", source: "game" };
    }

    const control = resolveControl(code);
    return control ? { type: "control", control } : null;
  }

  if (state.screen === "settings") {
    if (code === "Escape") {
      return { type: "leaveSettings" };
    }

    if (code === "Enter") {
      return state.settingsSource === "game"
        ? { type: "leaveSettings" }
        : { type: "start" };
    }

    if (code === "KeyR") {
      return { type: "playAgain" };
    }

    if (code === "KeyT") {
      return { type: "takeOver" };
    }

    return null;
  }

  if (state.screen === "result") {
    if (code === "Enter") {
      return { type: "playAgain" };
    }

    if (code === "Escape") {
      return { type: "goHome" };
    }
  }

  return null;
}
