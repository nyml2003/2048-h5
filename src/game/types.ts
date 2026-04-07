export type GameStatus = "idle" | "running" | "paused" | "gameOver";

export type ControlAction = "up" | "down" | "left" | "right";

export type BoardCell = number | null;
export type BoardMatrix = BoardCell[][];

export interface SpawnPoint {
  row: number;
  column: number;
}

export interface LastMoveMeta {
  action: ControlAction;
  scoreGain: number;
  spawnedAt: SpawnPoint | null;
  spawnedValue: number | null;
}

export interface GameState {
  board: BoardMatrix;
  score: number;
  bestScore: number;
  moveCount: number;
  highestTile: number;
  status: GameStatus;
  lastMove: LastMoveMeta | null;
}
