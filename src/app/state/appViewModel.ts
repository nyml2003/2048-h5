import type { AppState } from "@/app/state/types";
import type { GameState } from "@/game/core/types";

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

function highestTileFromBoard(game: GameState): number {
  let best = 0;

  for (const row of game.board) {
    for (const cell of row) {
      if (cell !== null && cell > best) {
        best = cell;
      }
    }
  }

  return best;
}

export function readHighestTile(game: GameState): number {
  return game.highestTile > 0 ? game.highestTile : highestTileFromBoard(game);
}

export function selectIsGameScreen(state: AppState): boolean {
  return state.screen === "game";
}

export function selectIsPlayable(state: AppState): boolean {
  return selectIsGameScreen(state) && state.game.status === "running";
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

export function createSummaryStats(
  game: GameState,
  bestScore: number,
  copy: SummaryCopy
) {
  return [
    { label: copy.hud.score, value: String(game.score) },
    { label: copy.hud.best, value: String(bestScore) },
    { label: copy.hud.moves, value: String(game.moveCount) },
    { label: copy.hud.peak, value: String(readHighestTile(game)) },
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
