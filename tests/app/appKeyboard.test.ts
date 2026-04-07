import { describe, expect, it } from "vitest";

import { resolveKeyboardAction } from "@/app/appKeyboard";
import { createAppState } from "@/app/appState";
import { restartGame } from "@/app/gameGateway";

describe("appKeyboard", () => {
  it("maps home shortcuts to the expected entry actions", () => {
    const state = createAppState();

    expect(resolveKeyboardAction(state, "Enter")).toEqual({ type: "start" });
    expect(resolveKeyboardAction(state, "KeyA")).toEqual({ type: "startAi" });
    expect(resolveKeyboardAction(state, "KeyH")).toEqual({ type: "openHelp" });
  });

  it("maps gameplay keys to controls and pause", () => {
    const state = {
      ...createAppState(),
      screen: "game" as const,
      game: restartGame([0, 0, 0, 0]),
    };

    expect(resolveKeyboardAction(state, "ArrowLeft")).toEqual({
      type: "control",
      control: "left",
    });
    expect(resolveKeyboardAction(state, "KeyP")).toEqual({
      type: "openSettings",
      source: "game",
    });
  });

  it("supports settings and result shortcuts", () => {
    const settingsState = {
      ...createAppState(),
      screen: "settings" as const,
      settingsSource: "game" as const,
    };
    const resultState = {
      ...createAppState(),
      screen: "result" as const,
    };

    expect(resolveKeyboardAction(settingsState, "Enter")).toEqual({
      type: "leaveSettings",
    });
    expect(resolveKeyboardAction(settingsState, "KeyT")).toEqual({
      type: "takeOver",
    });
    expect(resolveKeyboardAction(resultState, "Enter")).toEqual({
      type: "playAgain",
    });
  });
});
