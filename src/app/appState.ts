import {
  applyGameAction,
  beginGame,
  createGameState,
  restartGame,
  togglePause,
  type ControlAction,
  type GameState,
} from "@/app/gameGateway";

export type AppScreen = "home" | "help" | "game" | "settings" | "result";
export type PlayerMode = "manual" | "ai";
export type SettingsSource = "home" | "game";

export interface AppState {
  playerMode: PlayerMode;
  screen: AppScreen;
  settingsSource: SettingsSource;
  helpPage: number;
  bestScore: number;
  game: GameState;
}

export type AppAction =
  | { type: "start" }
  | { type: "startAi" }
  | { type: "openHelp" }
  | { type: "setHelpPage"; page: number }
  | { type: "control"; control: ControlAction }
  | { type: "openSettings"; source: SettingsSource }
  | { type: "leaveSettings" }
  | { type: "takeOver" }
  | { type: "playAgain" }
  | { type: "goHome" }
  | { type: "restore"; state: AppState }
  | { type: "setBestScore"; score: number };

function scoreOf(game: GameState): number {
  const score = (game as { score?: unknown }).score;
  return typeof score === "number" ? score : 0;
}

function isGameOver(game: GameState): boolean {
  return (game as { status?: unknown }).status === "gameOver";
}

function mergeBestScore(bestScore: number, game: GameState): number {
  return Math.max(bestScore, scoreOf(game));
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
  const game = beginGame(restartGame());
  const nextBestScore = mergeBestScore(state.bestScore, game);

  return {
    ...state,
    playerMode: mode,
    screen: "game",
    settingsSource: "home",
    helpPage: 0,
    bestScore: nextBestScore,
    game,
  };
}

function reduceWithGame(state: AppState, game: GameState): AppState {
  const nextBestScore = mergeBestScore(state.bestScore, game);

  return {
    ...state,
    screen: isGameOver(game) ? "result" : state.screen,
    bestScore: nextBestScore,
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
      if (state.screen !== "game") {
        return state;
      }

      return reduceWithGame(state, applyGameAction(state.game, action.control));
    case "openSettings":
      return {
        ...state,
        screen: "settings",
        settingsSource: action.source,
        game:
          action.source === "game" && (state.game as { status?: unknown }).status === "running"
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
