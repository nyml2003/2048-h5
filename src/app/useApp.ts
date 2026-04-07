import { useReducer } from "react";
import type { Dispatch } from "react";

import {
  controlEntriesForState,
  createSettingsItems,
  createSummaryStats,
  normalizeBoard,
  selectControlsDisabled,
  selectGameHint,
  selectGameModeBadge,
  selectIsAiMode,
  selectIsPlayable,
  selectSettingsFromGame,
} from "@/app/appViewModel";
import { zhCN } from "@/app/copy";
import {
  createInitialAppRouteState,
  getRoutePathForState,
} from "@/app/appRoute";
import { useAppRouteSync } from "@/app/useAppRoute";
import { useAutoplay } from "@/app/useAutoplay";
import { useAppKeyboard } from "@/app/useKeyboard";
import { useBestScorePersistence } from "@/app/useBestScore";
import { useSwipe } from "@/app/useSwipe";
import {
  reduceAppState,
  type AppAction,
} from "@/app/appState";
import type { ControlAction } from "@/app/gameGateway";

export {
  createAppState,
  reduceAppState,
  type AppAction,
  type AppScreen,
  type AppState,
  type PlayerMode,
  type SettingsSource,
} from "@/app/appState";

function dispatchControl(dispatch: Dispatch<AppAction>, control: ControlAction) {
  dispatch({ type: "control", control });
}

function getHelpPages(pageSize: number) {
  const pages: (typeof zhCN.help.sections)[] = [];

  for (let index = 0; index < zhCN.help.sections.length; index += pageSize) {
    pages.push(zhCN.help.sections.slice(index, index + pageSize));
  }

  return pages;
}

const HELP_SECTIONS_PER_PAGE = 3;

export function use2048App() {
  const [state, dispatch] = useReducer(
    reduceAppState,
    undefined,
    createInitialAppRouteState
  );

  useAutoplay(state, dispatch);
  useAppKeyboard(state, dispatch);
  useAppRouteSync(state, dispatch);
  useBestScorePersistence(state, dispatch);

  const swipeBind = useSwipe((action) => {
    if (state.screen === "game" && state.playerMode === "manual") {
      dispatchControl(dispatch, action);
    }
  });

  const summaryStats = createSummaryStats(state, zhCN);
  const gameHint = selectGameHint(state, zhCN);
  const gameModeBadge = selectGameModeBadge(state, zhCN);
  const settingsItems = createSettingsItems(state, zhCN);
  const controls = controlEntriesForState(state, zhCN);
  const helpPages = getHelpPages(HELP_SECTIONS_PER_PAGE);
  const totalHelpPages = Math.max(helpPages.length, 1);
  const activeHelpPage = Math.min(state.helpPage, totalHelpPages - 1);

  return {
    copy: zhCN,
    controls,
    controlsDisabled: selectControlsDisabled(state),
    gameBoard: normalizeBoard((state.game as { board?: unknown }).board),
    gameHint,
    gameModeBadge,
    gameState: state.game,
    helpPage: activeHelpPage,
    helpSections: helpPages[activeHelpPage] ?? [],
    isAiMode: selectIsAiMode(state),
    isPlayable: selectIsPlayable(state),
    route: getRoutePathForState(state),
    screen: state.screen,
    settingsFromGame: selectSettingsFromGame(state),
    settingsItems,
    state,
    summaryStats,
    totalHelpPages,
    swipeBind,
    dispatchControl: (action: ControlAction) => dispatchControl(dispatch, action),
    startGame: () => dispatch({ type: "start" }),
    startAi: () => dispatch({ type: "startAi" }),
    openHelp: () => dispatch({ type: "openHelp" }),
    setHelpPage: (page: number) => dispatch({ type: "setHelpPage", page }),
    openGameSettings: () => dispatch({ type: "openSettings", source: "game" }),
    leaveSettings: () => dispatch({ type: "leaveSettings" }),
    takeOver: () => dispatch({ type: "takeOver" }),
    playAgain: () => dispatch({ type: "playAgain" }),
    goHome: () => dispatch({ type: "goHome" }),
  };
}
