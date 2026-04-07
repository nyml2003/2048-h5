import {
  BASE_TILE_VALUE,
  BOARD_SIZE,
  BONUS_TILE_PROBABILITY,
  BONUS_TILE_VALUE,
  START_TILE_COUNT,
} from "@/game/core/constants";
import type {
  BoardCell,
  BoardMatrix,
  ControlAction,
  GameState,
  SpawnPoint,
} from "@/game/core/types";

interface RandomSource {
  values: readonly number[];
  index: number;
}

interface MergeResult {
  line: BoardCell[];
  scoreGain: number;
  changed: boolean;
}

interface MoveResult {
  board: BoardMatrix;
  scoreGain: number;
  changed: boolean;
}

interface SpawnResult {
  board: BoardMatrix;
  point: SpawnPoint | null;
  value: number | null;
}

function createRandomSource(values?: readonly number[]): RandomSource {
  return {
    values: values ?? [],
    index: 0,
  };
}

function clampRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return Math.random();
  }

  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 0.999999999;
  }

  return value;
}

function nextRandom(source: RandomSource): number {
  if (source.index < source.values.length) {
    const value = source.values[source.index];
    source.index += 1;

    return clampRandomValue(value);
  }

  return Math.random();
}

function cloneBoard(board: BoardMatrix): BoardMatrix {
  return board.map((row) => [...row]);
}

function readLine(
  board: BoardMatrix,
  index: number,
  action: ControlAction
): BoardCell[] {
  switch (action) {
    case "left":
      return [...board[index]];
    case "right":
      return [...board[index]].reverse();
    case "up":
      return board.map((row) => row[index]);
    case "down":
      return board.map((row) => row[index]).reverse();
    default:
      return [...board[index]];
  }
}

function writeLine(
  board: BoardMatrix,
  index: number,
  action: ControlAction,
  line: readonly BoardCell[]
) {
  switch (action) {
    case "left":
      for (let column = 0; column < BOARD_SIZE; column += 1) {
        board[index][column] = line[column] ?? null;
      }
      return;
    case "right":
      for (let column = 0; column < BOARD_SIZE; column += 1) {
        board[index][BOARD_SIZE - 1 - column] = line[column] ?? null;
      }
      return;
    case "up":
      for (let row = 0; row < BOARD_SIZE; row += 1) {
        board[row][index] = line[row] ?? null;
      }
      return;
    case "down":
      for (let row = 0; row < BOARD_SIZE; row += 1) {
        board[BOARD_SIZE - 1 - row][index] = line[row] ?? null;
      }
      return;
    default:
      return;
  }
}

function mergeLine(line: readonly BoardCell[]): MergeResult {
  const compacted = line.filter((cell): cell is number => cell !== null);
  const merged: number[] = [];
  let scoreGain = 0;

  for (let index = 0; index < compacted.length; index += 1) {
    const current = compacted[index];
    const next = compacted[index + 1];

    if (next !== undefined && next === current) {
      const value = current * 2;
      merged.push(value);
      scoreGain += value;
      index += 1;
      continue;
    }

    merged.push(current);
  }

  const padded: BoardCell[] = [...merged];

  while (padded.length < BOARD_SIZE) {
    padded.push(null);
  }

  const changed = line.some((cell, index) => cell !== padded[index]);

  return {
    line: padded,
    scoreGain,
    changed,
  };
}

function moveBoard(board: BoardMatrix, action: ControlAction): MoveResult {
  const nextBoard = cloneBoard(board);
  let scoreGain = 0;
  let changed = false;

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    const sourceLine = readLine(board, index, action);
    const merged = mergeLine(sourceLine);

    scoreGain += merged.scoreGain;
    changed = changed || merged.changed;
    writeLine(nextBoard, index, action, merged.line);
  }

  return {
    board: changed ? nextBoard : board,
    scoreGain,
    changed,
  };
}

function collectEmptyCells(board: BoardMatrix): SpawnPoint[] {
  const cells: SpawnPoint[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      if (board[row][column] === null) {
        cells.push({ row, column });
      }
    }
  }

  return cells;
}

function spawnRandomTile(board: BoardMatrix, source: RandomSource): SpawnResult {
  const emptyCells = collectEmptyCells(board);

  if (emptyCells.length === 0) {
    return {
      board,
      point: null,
      value: null,
    };
  }

  const index = Math.floor(nextRandom(source) * emptyCells.length);
  const point = emptyCells[index] ?? emptyCells[0];
  const value = nextRandom(source) < BONUS_TILE_PROBABILITY
    ? BONUS_TILE_VALUE
    : BASE_TILE_VALUE;
  const nextBoard = cloneBoard(board);

  nextBoard[point.row][point.column] = value;

  return {
    board: nextBoard,
    point,
    value,
  };
}

function getHighestTile(board: BoardMatrix): number {
  let highest = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== null && cell > highest) {
        highest = cell;
      }
    }
  }

  return highest;
}

function canMoveBoard(board: BoardMatrix): boolean {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const current = board[row][column];

      if (current === null) {
        return true;
      }

      if (column + 1 < BOARD_SIZE && board[row][column + 1] === current) {
        return true;
      }

      if (row + 1 < BOARD_SIZE && board[row + 1][column] === current) {
        return true;
      }
    }
  }

  return false;
}

export function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

export function createGameState(): GameState {
  return {
    board: createEmptyBoard(),
    score: 0,
    bestScore: 0,
    moveCount: 0,
    highestTile: 0,
    status: "idle",
    lastMove: null,
  };
}

export function restartGame(randomValues?: readonly number[]): GameState {
  const randomSource = createRandomSource(randomValues);
  let board = createEmptyBoard();

  for (let index = 0; index < START_TILE_COUNT; index += 1) {
    const spawned = spawnRandomTile(board, randomSource);
    board = spawned.board;
  }

  return {
    board,
    score: 0,
    bestScore: 0,
    moveCount: 0,
    highestTile: getHighestTile(board),
    status: canMoveBoard(board) ? "running" : "gameOver",
    lastMove: null,
  };
}

export function beginGame(state: GameState): GameState {
  if (state.status === "gameOver") {
    return restartGame();
  }

  if (state.status === "idle" || state.status === "paused") {
    return {
      ...state,
      status: "running",
    };
  }

  return state;
}

export function togglePause(state: GameState): GameState {
  if (state.status === "running") {
    return {
      ...state,
      status: "paused",
    };
  }

  if (state.status === "paused") {
    return {
      ...state,
      status: "running",
    };
  }

  return state;
}

export function canMove(state: GameState): boolean {
  return canMoveBoard(state.board);
}

export function applyAction(
  state: GameState,
  action: ControlAction,
  randomValues?: readonly number[]
): GameState {
  if (state.status !== "running") {
    return state;
  }

  const moved = moveBoard(state.board, action);

  if (!moved.changed) {
    return state;
  }

  const randomSource = createRandomSource(randomValues);
  const spawned = spawnRandomTile(moved.board, randomSource);
  const score = state.score + moved.scoreGain;
  const highestTile = Math.max(state.highestTile, getHighestTile(spawned.board));
  const bestScore = Math.max(state.bestScore, score);

  return {
    ...state,
    board: spawned.board,
    score,
    bestScore,
    moveCount: state.moveCount + 1,
    highestTile,
    status: canMoveBoard(spawned.board) ? "running" : "gameOver",
    lastMove: {
      action,
      scoreGain: moved.scoreGain,
      spawnedAt: spawned.point,
      spawnedValue: spawned.value,
    },
  };
}
