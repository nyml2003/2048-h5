import "@/app/shell/App.css";

import type { CanvasRenderer } from "@/canvas/canvasRenderer";

import { useCanvasSurface } from "@/app/hooks/useCanvasSurface";
import { use2048App } from "@/app/hooks/use2048App";
import { paginateHelpSections } from "@/app/shell/paginateHelpSections";
import {
  GameScreen,
  HelpScreen,
  HomeScreen,
  ResultScreen,
  SettingsScreen,
} from "@/app/shell/screens";
import type { GameControl } from "@/app/shell/types";
import { drawGameBoard } from "@/game/rendering/render";
import type { GameState } from "@/game/core/types";

const HELP_SECTIONS_PER_PAGE = 3;
const STAT_TEST_IDS = ["stat-score", "stat-best", "stat-moves", "stat-peak"] as const;

const gameBoardRenderer: CanvasRenderer<GameState> = {
  render: drawGameBoard,
};

export function App() {
  const app = use2048App();
  const boardCanvasRef = useCanvasSurface(app.gameState, gameBoardRenderer);
  const helpPages = paginateHelpSections(app.copy.help.sections, HELP_SECTIONS_PER_PAGE);
  const totalHelpPages = Math.max(helpPages.length, 1);
  const activeHelpPage = Math.min(app.helpPage, totalHelpPages - 1);
  const activeHelpSections = helpPages[activeHelpPage] ?? [];

  const summaryStats = app.summaryStats.map((item, index) => ({
    ...item,
    testId: STAT_TEST_IDS[index] ?? `stat-${index}`,
  }));

  const controls = [
    { key: "up", label: app.copy.controls.up, onPress: app.moveUp },
    { key: "left", label: app.copy.controls.left, onPress: app.moveLeft },
    { key: "down", label: app.copy.controls.down, onPress: app.moveDown },
    { key: "right", label: app.copy.controls.right, onPress: app.moveRight },
  ] satisfies readonly GameControl[];

  const primarySettingsLabel = app.settingsFromGame
    ? app.copy.settings.resume
    : app.copy.settings.start;
  const showTakeOverAction = app.settingsFromGame && app.isAiMode;

  return (
    <div className="app-root" data-testid="app-root">
      <div className="app-aurora app-aurora--top" />
      <div className="app-aurora app-aurora--bottom" />

      {app.screen === "home" ? (
        <HomeScreen
          tag={app.copy.home.tag}
          title={app.copy.home.title}
          subtitle={app.copy.home.subtitle}
          bullets={app.copy.home.bullets}
          note={app.copy.home.note}
          startLabel={app.copy.home.primary}
          aiLabel={app.copy.home.ai}
          helpLabel={app.copy.home.help}
          onStart={app.startGame}
          onAiStart={app.startAi}
          onHelp={app.openHelp}
        />
      ) : null}

      {app.screen === "help" ? (
        <HelpScreen
          tag={app.copy.help.tag}
          title={app.copy.help.title}
          subtitle={app.copy.help.subtitle}
          hint={app.copy.help.hint}
          sections={activeHelpSections}
          currentPage={activeHelpPage}
          totalPages={totalHelpPages}
          previousLabel={app.copy.help.previous}
          nextLabel={app.copy.help.next}
          startLabel={app.copy.help.primary}
          aiLabel={app.copy.help.ai}
          homeLabel={app.copy.help.home}
          onPrevious={() => app.setHelpPage(activeHelpPage - 1)}
          onNext={() => app.setHelpPage(activeHelpPage + 1)}
          onStart={app.startGame}
          onAiStart={app.startAi}
          onHome={app.goHome}
        />
      ) : null}

      {app.screen === "game" ? (
        <GameScreen
          tag={app.copy.game.tag}
          boardLabel={app.copy.game.boardLabel}
          pauseLabel={app.copy.controls.pause}
          modeBadge={app.gameModeBadge}
          keyboardHint={app.gameHint}
          stats={summaryStats}
          boardCanvasRef={boardCanvasRef}
          swipeBind={app.swipeBind}
          controls={controls}
          controlsDisabled={app.controlsDisabled}
          onPause={app.openGameSettings}
        />
      ) : null}

      {app.screen === "settings" ? (
        <SettingsScreen
          title={app.copy.settings.title}
          subtitle={app.copy.settings.subtitle}
          items={app.settingsItems}
          stats={app.summaryStats}
          primaryLabel={primarySettingsLabel}
          takeOverLabel={showTakeOverAction ? app.copy.settings.takeOver : undefined}
          restartLabel={app.copy.settings.restart}
          homeLabel={app.copy.settings.home}
          onPrimary={app.settingsFromGame ? app.leaveSettings : app.startGame}
          onTakeOver={showTakeOverAction ? app.takeOver : undefined}
          onRestart={app.playAgain}
          onHome={app.goHome}
        />
      ) : null}

      {app.screen === "result" ? (
        <ResultScreen
          tag={app.copy.result.tag}
          title={app.copy.result.title}
          subtitle={app.copy.result.subtitle}
          stats={app.summaryStats}
          primaryLabel={app.copy.result.primary}
          secondaryLabel={app.copy.result.secondary}
          onPrimary={app.playAgain}
          onSecondary={app.goHome}
        />
      ) : null}
    </div>
  );
}
