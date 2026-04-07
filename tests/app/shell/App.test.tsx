import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { zhCN } from "@/app/content/copy";
import { restartGame } from "@/game/core/gameEngine";

const mockUse2048App = vi.hoisted(() => vi.fn());
const mockUseCanvasSurface = vi.hoisted(() => vi.fn(() => ({ current: null })));

vi.mock("@/app/hooks/use2048App", () => ({
  use2048App: mockUse2048App,
}));

vi.mock("@/app/hooks/useCanvasSurface", () => ({
  useCanvasSurface: mockUseCanvasSurface,
}));

import { App } from "@/app/shell/App";

function createMockApp(overrides: Record<string, unknown> = {}) {
  const gameState = restartGame([0, 0, 0, 0]);

  return {
    controlsDisabled: false,
    copy: zhCN,
    gameHint: zhCN.game.keyboardHint,
    gameModeBadge: null as string | null,
    gameState,
    goHome: vi.fn(),
    helpPage: 0,
    isAiMode: false,
    isPlayable: false,
    leaveSettings: vi.fn(),
    moveDown: vi.fn(),
    moveLeft: vi.fn(),
    moveRight: vi.fn(),
    moveUp: vi.fn(),
    openGameSettings: vi.fn(),
    openHelp: vi.fn(),
    playAgain: vi.fn(),
    playerMode: "manual" as const,
    screen: "home" as const,
    setHelpPage: vi.fn(),
    settingsFromGame: false,
    settingsItems: [{ label: zhCN.settings.mode, value: zhCN.settings.manualMode }] as const,
    startAi: vi.fn(),
    startGame: vi.fn(),
    summaryStats: [
      { label: zhCN.hud.score, value: "0" },
      { label: zhCN.hud.best, value: "1280" },
      { label: zhCN.hud.moves, value: "18" },
      { label: zhCN.hud.peak, value: "64" },
    ] as const,
    swipeBind: {
      onPointerCancel: vi.fn(),
      onPointerDown: vi.fn(),
      onPointerUp: vi.fn(),
    },
    takeOver: vi.fn(),
    ...overrides,
  };
}

describe("App", () => {
  it("renders the home screen entry actions", () => {
    mockUse2048App.mockReturnValue(createMockApp());

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(zhCN.home.title);
    expect(markup).toContain(zhCN.home.primary);
    expect(markup).toContain(zhCN.home.ai);
    expect(markup).toContain(zhCN.home.help);
  });

  it("renders the paged help screen content", () => {
    mockUse2048App.mockReturnValue(
      createMockApp({
        screen: "help",
      })
    );

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(zhCN.help.title);
    expect(markup).toContain(zhCN.help.previous);
    expect(markup).toContain(zhCN.help.next);
    expect(markup).toContain(zhCN.help.sections[0].title);
    expect(markup).toContain("第 1 / 2 页");
  });

  it("renders the gameplay screen with badge, stats, board, and controls", () => {
    mockUse2048App.mockReturnValue(
      createMockApp({
        controlsDisabled: true,
        gameHint: zhCN.game.aiHint,
        gameModeBadge: zhCN.game.badge,
        isAiMode: true,
        isPlayable: true,
        playerMode: "ai",
        screen: "game",
      })
    );

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(zhCN.game.tag);
    expect(markup).toContain(zhCN.game.badge);
    expect(markup).toContain(zhCN.game.aiHint);
    expect(markup).toContain('data-testid="board-grid"');
    expect(markup).toContain(zhCN.controls.left);
    expect(markup).toContain(zhCN.controls.pause);
  });

  it("shows the current mode inside settings", () => {
    mockUse2048App.mockReturnValue(
      createMockApp({
        isAiMode: true,
        playerMode: "ai",
        screen: "settings",
        settingsFromGame: true,
        settingsItems: [{ label: zhCN.settings.mode, value: zhCN.settings.aiMode }],
      })
    );

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(zhCN.settings.resume);
    expect(markup).toContain(zhCN.settings.mode);
    expect(markup).toContain(zhCN.settings.aiMode);
    expect(markup).toContain(zhCN.settings.takeOver);
  });

  it("renders the result screen summary actions", () => {
    mockUse2048App.mockReturnValue(
      createMockApp({
        screen: "result",
      })
    );

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(zhCN.result.title);
    expect(markup).toContain(zhCN.result.primary);
    expect(markup).toContain(zhCN.result.secondary);
  });
});
