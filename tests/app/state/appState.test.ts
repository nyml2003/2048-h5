import { describe, expect, it } from "vitest";

import { createAppState, reduceAppState } from "@/app/state/appState";
import { createGameState, restartGame } from "@/game/core/gameEngine";

describe("appState", () => {
  it("starts an AI round from the home screen", () => {
    const next = reduceAppState(createAppState(), { type: "startAi" });

    expect(next.playerMode).toBe("ai");
    expect(next.screen).toBe("game");
    expect(next.game.status).toBe("running");
  });

  it("returns to home while preserving the best score", () => {
    const state = {
      ...createAppState(512),
      screen: "game" as const,
      game: restartGame([0, 0, 0, 0]),
    };

    const next = reduceAppState(state, { type: "goHome" });

    expect(next.screen).toBe("home");
    expect(next.bestScore).toBe(512);
    expect(next.game.status).toBe("idle");
  });

  it("lets the player take over from AI settings", () => {
    const state = {
      ...createAppState(),
      playerMode: "ai" as const,
      screen: "settings" as const,
      settingsSource: "game" as const,
      game: {
        ...restartGame([0, 0, 0, 0]),
        status: "paused" as const,
      },
    };

    const next = reduceAppState(state, { type: "takeOver" });

    expect(next.playerMode).toBe("manual");
    expect(next.screen).toBe("game");
    expect(next.game.status).toBe("running");
  });

  it("loads a stored best score without affecting the current round", () => {
    const state = {
      ...createAppState(),
      game: createGameState(),
    };

    const next = reduceAppState(state, { type: "setBestScore", score: 1024 });

    expect(next.bestScore).toBe(1024);
    expect(next.game.status).toBe("idle");
  });
});
