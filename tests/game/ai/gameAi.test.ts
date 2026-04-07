import { describe, expect, it } from "vitest";

import { planAiMove } from "@/game/ai/gameAi";
import { applyAction, createGameState } from "@/game/core/gameEngine";
import type { BoardMatrix, GameState } from "@/game/core/types";

function createState(board: BoardMatrix, status: GameState["status"]): GameState {
  let highestTile = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== null && cell > highestTile) {
        highestTile = cell;
      }
    }
  }

  return {
    ...createGameState(),
    board: board.map((row) => [...row]),
    highestTile,
    status,
  };
}

describe("gameAi (2048)", () => {
  it("returns null when the game is not running", () => {
    const state = createState(
      [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2, 4],
        [8, 16, 32, null],
      ],
      "paused"
    );

    expect(planAiMove(state)).toBeNull();
  });

  it("returns null when no legal move exists", () => {
    const state = createState(
      [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2, 4],
        [8, 16, 32, 64],
      ],
      "running"
    );

    expect(planAiMove(state)).toBeNull();
  });

  it("returns a legal action that changes the board", () => {
    const state = createState(
      [
        [2, 2, null, null],
        [4, 8, 16, 32],
        [64, 128, 256, 512],
        [1024, null, null, null],
      ],
      "running"
    );

    const action = planAiMove(state);

    expect(action).not.toBeNull();

    const nextState = applyAction(state, action ?? "left", [0, 0]);
    expect(nextState).not.toBe(state);
    expect(nextState.score).toBeGreaterThan(state.score);
  });
});
