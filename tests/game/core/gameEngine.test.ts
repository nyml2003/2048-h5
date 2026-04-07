import { describe, expect, it } from "vitest";

import {
  applyAction,
  canMove,
  createGameState,
  restartGame,
} from "@/game/core/gameEngine";
import type { BoardMatrix, GameState } from "@/game/core/types";

function createRunningState(board: BoardMatrix): GameState {
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
    status: "running",
  };
}

function countTiles(board: BoardMatrix): number {
  return board.flat().filter((cell) => cell !== null).length;
}

describe("gameEngine (2048)", () => {
  it("creates a running board with exactly two tiles on restart", () => {
    const state = restartGame([0, 0.5, 0, 0.5]);

    expect(state.status).toBe("running");
    expect(state.score).toBe(0);
    expect(state.moveCount).toBe(0);
    expect(countTiles(state.board)).toBe(2);
    expect(state.board[0][0]).toBe(2);
    expect(state.board[0][1]).toBe(2);
  });

  it("merges one pair per tile when moving left", () => {
    const state = createRunningState([
      [2, 2, 2, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const nextState = applyAction(state, "left", [0, 0]);

    expect(nextState).not.toBe(state);
    expect(nextState.score).toBe(4);
    expect(nextState.moveCount).toBe(1);
    expect(nextState.board[0]).toEqual([4, 2, 4, null]);
  });

  it("returns the same state object for an invalid move", () => {
    const state = createRunningState([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ]);
    const nextState = applyAction(state, "left", [0, 0]);

    expect(nextState).toBe(state);
  });

  it("detects game over after a legal move that leaves no future moves", () => {
    const state = createRunningState([
      [2, 4, null, 8],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ]);
    const nextState = applyAction(state, "left", [0, 0]);

    expect(nextState.status).toBe("gameOver");
    expect(canMove(nextState)).toBe(false);
  });
});
