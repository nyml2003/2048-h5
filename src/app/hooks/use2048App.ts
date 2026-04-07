import { useReducer } from "react";

import { zhCN } from "@/app/content/copy";
import { useBestScorePersistence } from "@/app/hooks/useBestScore";
import { use2048Autoplay } from "@/app/hooks/use2048Autoplay";
import { use2048Keyboard } from "@/app/hooks/use2048Keyboard";
import { useSwipe } from "@/app/hooks/useSwipe";
import { createInitialAppRouteState } from "@/app/routing/appRoute";
import { useAppRouteSync } from "@/app/routing/useAppRoute";
import { reduceAppState } from "@/app/state/appState";
import {
  createSettingsItems,
  createSummaryStats,
  selectControlsDisabled,
  selectGameHint,
  selectGameModeBadge,
  selectIsAiMode,
  selectIsPlayable,
  selectSettingsFromGame,
} from "@/app/state/appViewModel";

export {
  createAppState,
  reduceAppState,
} from "@/app/state/appState";
export type {
  AppAction,
  AppScreen,
  AppState,
  PlayerMode,
  SettingsSource,
} from "@/app/state/types";

export function use2048App() {
  const [state, dispatch] = useReducer(
    reduceAppState,
    undefined,
    createInitialAppRouteState
  );

  use2048Autoplay(state, dispatch);
  use2048Keyboard(state, dispatch);
  useAppRouteSync(state, dispatch);
  useBestScorePersistence(state, dispatch);

  const swipeBind = useSwipe((action) => {
    if (state.screen === "game" && state.playerMode === "manual") {
      dispatch({ type: "control", control: action });
    }
  });

  return {
    copy: zhCN,
    playerMode: state.playerMode,
    screen: state.screen,
    helpPage: state.helpPage,
    gameState: state.game,
    isAiMode: selectIsAiMode(state),
    isPlayable: selectIsPlayable(state),
    controlsDisabled: selectControlsDisabled(state),
    settingsFromGame: selectSettingsFromGame(state),
    settingsItems: createSettingsItems(state, zhCN),
    summaryStats: createSummaryStats(state.game, state.bestScore, zhCN),
    gameHint: selectGameHint(state, zhCN),
    gameModeBadge: selectGameModeBadge(state, zhCN),
    swipeBind,
    startGame: () => dispatch({ type: "start" }),
    startAi: () => dispatch({ type: "startAi" }),
    openHelp: () => dispatch({ type: "openHelp" }),
    setHelpPage: (page: number) => dispatch({ type: "setHelpPage", page }),
    openGameSettings: () => dispatch({ type: "openSettings", source: "game" }),
    leaveSettings: () => dispatch({ type: "leaveSettings" }),
    takeOver: () => dispatch({ type: "takeOver" }),
    playAgain: () => dispatch({ type: "playAgain" }),
    goHome: () => dispatch({ type: "goHome" }),
    moveUp: () => dispatch({ type: "control", control: "up" }),
    moveLeft: () => dispatch({ type: "control", control: "left" }),
    moveDown: () => dispatch({ type: "control", control: "down" }),
    moveRight: () => dispatch({ type: "control", control: "right" }),
  };
}
