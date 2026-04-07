import { describe, expect, it, vi } from "vitest";

import { drawGameBoard, drawPreview } from "@/game/render";
import { createGameState, restartGame } from "@/game/tetrisEngine";

describe("render (2048)", () => {
  it("does not throw when canvas context is unavailable", () => {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(null);

    expect(() => drawGameBoard(canvas, createGameState())).not.toThrow();
    expect(() => drawPreview(canvas, 2)).not.toThrow();
  });

  it("can draw a running board with a real 2d context when available", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 220;
    canvas.height = 220;
    const state = restartGame([0, 0, 0, 0]);

    expect(() => drawGameBoard(canvas, state)).not.toThrow();
    expect(() => drawPreview(canvas, state.highestTile)).not.toThrow();
  });
});
