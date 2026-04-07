import type { AppState } from "@/app/appState";
import type { ControlAction, GameState } from "@/app/gameGateway";

interface SummaryCopy {
  hud: {
    best: string;
    moves: string;
    peak: string;
    score: string;
  };
}

interface GameCopy {
  game: {
    aiHint: string;
    badge: string;
    keyboardHint: string;
  };
}

interface SettingsCopy {
  settings: {
    aiMode: string;
    manualMode: string;
    mode: string;
  };
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeBoard(board: unknown): number[][] {
  if (!Array.isArray(board) || board.length === 0) {
    return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  }

  return board.map((row) => {
    if (!Array.isArray(row)) {
      return Array.from({ length: 4 }, () => 0);
    }

    return row.map((cell) => readNumber(cell));
  });
}

function highestTileFromBoard(game: GameState): number {
  const board = normalizeBoard((game as { board?: unknown }).board);
  let best = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell > best) {
        best = cell;
      }
    }
  }

  return best;
}

export function readScore(game: GameState): number {
  return readNumber((game as { score?: unknown }).score);
}

export function readMoveCount(game: GameState): number {
  return readNumber((game as { moveCount?: unknown }).moveCount);
}

export function readHighestTile(game: GameState): number {
  const explicit = readNumber((game as { highestTile?: unknown }).highestTile);
  return explicit > 0 ? explicit : highestTileFromBoard(game);
}

export function selectIsGameScreen(state: AppState): boolean {
  return state.screen === "game";
}

export function selectIsPlayable(state: AppState): boolean {
  return selectIsGameScreen(state) && (state.game as { status?: unknown }).status === "running";
}

export function selectIsAiMode(state: AppState): boolean {
  return state.playerMode === "ai";
}

export function selectControlsDisabled(state: AppState): boolean {
  return !selectIsPlayable(state) || selectIsAiMode(state);
}

export function selectSettingsFromGame(state: AppState): boolean {
  return state.screen === "settings" && state.settingsSource === "game";
}

export function createSummaryStats(state: AppState, copy: SummaryCopy) {
  return [
    { label: copy.hud.score, value: String(readScore(state.game)) },
    { label: copy.hud.best, value: String(state.bestScore) },
    { label: copy.hud.moves, value: String(readMoveCount(state.game)) },
    { label: copy.hud.peak, value: String(readHighestTile(state.game)) },
  ] as const;
}

export function selectGameHint(state: AppState, copy: GameCopy): string {
  return selectIsAiMode(state) ? copy.game.aiHint : copy.game.keyboardHint;
}

export function selectGameModeBadge(state: AppState, copy: GameCopy): string | null {
  return selectIsAiMode(state) ? copy.game.badge : null;
}

export function createSettingsItems(state: AppState, copy: SettingsCopy) {
  return [
    {
      label: copy.settings.mode,
      value: state.playerMode === "ai" ? copy.settings.aiMode : copy.settings.manualMode,
    },
  ] as const;
}

export function controlEntriesForState(state: AppState, copy: { controls: Record<ControlAction, string> }) {
  return [
    { key: "up", label: copy.controls.up, action: "up" as const },
    { key: "left", label: copy.controls.left, action: "left" as const },
    { key: "down", label: copy.controls.down, action: "down" as const },
    { key: "right", label: copy.controls.right, action: "right" as const },
  ] as const;
}
