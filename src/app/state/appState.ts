import {
  applyAction,
  beginGame,
  createGameState,
  restartGame,
  togglePause,
} from "@/game/core/gameEngine";
import type { GameState } from "@/game/core/types";

import type { AppAction, AppState, PlayerMode } from "@/app/state/types";

export type {
  AppAction,
  AppScreen,
  AppState,
  PlayerMode,
  SettingsSource,
} from "@/app/state/types";

function mergeBestScore(bestScore: number, game: GameState): number {
  return Math.max(bestScore, game.score);
}

export function createAppState(bestScore = 0): AppState {
  return {
    playerMode: "manual",
    screen: "home",
    settingsSource: "home",
    helpPage: 0,
    bestScore,
    game: createGameState(),
  };
}

function createNewRound(state: AppState, mode: PlayerMode): AppState {
  const game = restartGame();

  return {
    ...state,
    playerMode: mode,
    screen: "game",
    settingsSource: "home",
    helpPage: 0,
    bestScore: mergeBestScore(state.bestScore, game),
    game,
  };
}

function reduceWithGame(state: AppState, game: GameState): AppState {
  return {
    ...state,
    screen: game.status === "gameOver" ? "result" : state.screen,
    bestScore: mergeBestScore(state.bestScore, game),
    game,
  };
}

export function reduceAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "start":
      return createNewRound(state, "manual");
    case "startAi":
      return createNewRound(state, "ai");
    case "openHelp":
      return {
        ...state,
        screen: "help",
        helpPage: 0,
      };
    case "setHelpPage":
      return state.screen === "help"
        ? {
            ...state,
            helpPage: Math.max(0, action.page),
          }
        : state;
    case "control":
      return state.screen === "game"
        ? reduceWithGame(state, applyAction(state.game, action.control))
        : state;
    case "openSettings":
      return {
        ...state,
        screen: "settings",
        settingsSource: action.source,
        game: action.source === "game" && state.game.status === "running"
          ? togglePause(state.game)
          : state.game,
      };
    case "leaveSettings":
      return state.settingsSource === "game"
        ? {
            ...state,
            screen: "game",
            game: beginGame(state.game),
          }
        : {
            ...state,
            screen: "home",
          };
    case "takeOver":
      return state.screen === "settings" && state.settingsSource === "game"
        ? {
            ...state,
            playerMode: "manual",
            screen: "game",
            game: beginGame(state.game),
          }
        : state;
    case "playAgain":
      return createNewRound(state, state.playerMode);
    case "goHome":
      return createAppState(state.bestScore);
    case "restore":
      return action.state;
    case "setBestScore":
      return {
        ...state,
        bestScore: Math.max(0, action.score),
      };
    default:
      return state;
  }
}
