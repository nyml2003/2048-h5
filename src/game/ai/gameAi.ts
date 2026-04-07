import { AI_ACTION_ORDER, BOARD_SIZE } from "@/game/core/constants";
import { applyAction, canMove } from "@/game/core/gameEngine";
import type { BoardCell, BoardMatrix, ControlAction, GameState } from "@/game/core/types";

function getLogValue(value: BoardCell): number {
  return value === null ? 0 : Math.log2(value);
}

function countEmptyCells(board: BoardMatrix): number {
  let emptyCount = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell === null) {
        emptyCount += 1;
      }
    }
  }

  return emptyCount;
}

function countMergePotential(board: BoardMatrix): number {
  let mergePotential = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const current = board[row][column];

      if (current === null) {
        continue;
      }

      if (column + 1 < BOARD_SIZE && board[row][column + 1] === current) {
        mergePotential += 1;
      }

      if (row + 1 < BOARD_SIZE && board[row + 1][column] === current) {
        mergePotential += 1;
      }
    }
  }

  return mergePotential;
}

function measureMonotonicity(board: BoardMatrix): number {
  let leftToRightPenalty = 0;
  let rightToLeftPenalty = 0;
  let topToBottomPenalty = 0;
  let bottomToTopPenalty = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE - 1; column += 1) {
      const current = getLogValue(board[row][column]);
      const next = getLogValue(board[row][column + 1]);

      if (current > next) {
        rightToLeftPenalty += current - next;
      } else {
        leftToRightPenalty += next - current;
      }
    }
  }

  for (let column = 0; column < BOARD_SIZE; column += 1) {
    for (let row = 0; row < BOARD_SIZE - 1; row += 1) {
      const current = getLogValue(board[row][column]);
      const next = getLogValue(board[row + 1][column]);

      if (current > next) {
        bottomToTopPenalty += current - next;
      } else {
        topToBottomPenalty += next - current;
      }
    }
  }

  return -(
    Math.min(leftToRightPenalty, rightToLeftPenalty) +
    Math.min(topToBottomPenalty, bottomToTopPenalty)
  );
}

function measureSmoothness(board: BoardMatrix): number {
  let smoothness = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const current = getLogValue(board[row][column]);

      if (current === 0) {
        continue;
      }

      if (column + 1 < BOARD_SIZE) {
        const right = getLogValue(board[row][column + 1]);
        if (right > 0) {
          smoothness += Math.abs(current - right);
        }
      }

      if (row + 1 < BOARD_SIZE) {
        const down = getLogValue(board[row + 1][column]);
        if (down > 0) {
          smoothness += Math.abs(current - down);
        }
      }
    }
  }

  return -smoothness;
}

function getMaxTileCornerScore(board: BoardMatrix): number {
  let maxTile = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== null && cell > maxTile) {
        maxTile = cell;
      }
    }
  }

  if (maxTile === 0) {
    return 0;
  }

  const corners = [
    board[0][0],
    board[0][BOARD_SIZE - 1],
    board[BOARD_SIZE - 1][0],
    board[BOARD_SIZE - 1][BOARD_SIZE - 1],
  ];

  return corners.includes(maxTile) ? 1 : -1;
}

function countMobility(state: GameState): number {
  let legalMoves = 0;

  for (const action of AI_ACTION_ORDER) {
    if (applyAction(state, action, [0, 0]) !== state) {
      legalMoves += 1;
    }
  }

  return legalMoves;
}

export function evaluateState(state: GameState): number {
  const emptyCells = countEmptyCells(state.board);
  const mergePotential = countMergePotential(state.board);
  const monotonicity = measureMonotonicity(state.board);
  const smoothness = measureSmoothness(state.board);
  const cornerScore = getMaxTileCornerScore(state.board);
  const mobility = countMobility(state);
  const maxTileFactor = state.highestTile > 0 ? Math.log2(state.highestTile) : 0;

  return (
    emptyCells * 300 +
    mergePotential * 95 +
    monotonicity * 44 +
    smoothness * 12 +
    cornerScore * 260 +
    mobility * 40 +
    maxTileFactor * 15
  );
}

function search(state: GameState, depth: number): number {
  if (depth <= 0 || !canMove(state)) {
    return evaluateState(state);
  }

  let bestScore = Number.NEGATIVE_INFINITY;

  for (const action of AI_ACTION_ORDER) {
    const nextState = applyAction(state, action, [0, 0]);

    if (nextState === state) {
      continue;
    }

    const score = evaluateState(nextState) + search(nextState, depth - 1) * 0.35;
    bestScore = Math.max(bestScore, score);
  }

  return bestScore === Number.NEGATIVE_INFINITY
    ? evaluateState(state)
    : bestScore;
}

export function planAiMove(state: GameState): ControlAction | null {
  if (state.status !== "running" || !canMove(state)) {
    return null;
  }

  let bestAction: ControlAction | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const action of AI_ACTION_ORDER) {
    const nextState = applyAction(state, action, [0, 0]);

    if (nextState === state) {
      continue;
    }

    const immediateGain = nextState.score - state.score;
    const score =
      evaluateState(nextState) +
      search(nextState, 1) * 0.35 +
      immediateGain * 0.8;

    if (score > bestScore) {
      bestScore = score;
      bestAction = action;
    }
  }

  return bestAction;
}
