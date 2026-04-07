import { expect, type Locator, type Page } from "@playwright/test";

export const labels = {
  game: {
    aiBadge: "AUTO MODE",
  },
  help: {
    ai: "AI 代打",
    home: "返回首页",
    next: "下一页",
    previous: "上一页",
    start: "开始挑战",
  },
  home: {
    ai: "AI 代打",
    help: "玩法说明",
    start: "开始挑战",
  },
  settings: {
    restart: "重新开始",
    resume: "继续游戏",
    takeOver: "人工接管",
  },
} as const;

export const testIds = {
  boardGrid: "board-grid",
  gameFooter: "game-footer",
  gameModeBadge: "game-mode-badge",
  gameScreen: "screen-game",
  gameStage: "game-stage",
  gameTopbar: "game-topbar",
  helpActions: "help-actions",
  helpCard: "help-card",
  helpFooter: "help-footer",
  helpGrid: "help-grid",
  helpPagination: "help-pagination",
  helpPaginationStatus: "help-pagination-status",
  helpPanel: "help-panel",
  helpScreen: "screen-help",
  homeActions: "home-actions",
  homeCard: "home-card",
  homeScreen: "screen-home",
  settingsActions: "settings-actions",
  settingsScreen: "screen-settings",
  statMoves: "stat-moves",
} as const;

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function actionButton(scope: Locator, name: string) {
  return scope.getByRole("button", { exact: true, name });
}

export function controlButton(page: Page, name: string) {
  return gameFooter(page).getByRole("button", { exact: true, name });
}

export async function expectPath(page: Page, path: string) {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/+$/, "");
  const pattern =
    normalizedPath === "/"
      ? /\/$/
      : new RegExp(`${escapeForRegExp(normalizedPath)}$`);

  await expect(page).toHaveURL(pattern);
}

export function homeScreen(page: Page) {
  return page.getByTestId(testIds.homeScreen);
}

export function homeCard(page: Page) {
  return page.getByTestId(testIds.homeCard);
}

export function homeActions(page: Page) {
  return page.getByTestId(testIds.homeActions);
}

export function helpScreen(page: Page) {
  return page.getByTestId(testIds.helpScreen);
}

export function helpPanel(page: Page) {
  return page.getByTestId(testIds.helpPanel);
}

export function helpGrid(page: Page) {
  return page.getByTestId(testIds.helpGrid);
}

export function helpFooter(page: Page) {
  return page.getByTestId(testIds.helpFooter);
}

export function helpCards(page: Page) {
  return page.getByTestId(testIds.helpCard);
}

export function helpPagination(page: Page) {
  return page.getByTestId(testIds.helpPagination);
}

export function helpPaginationStatus(page: Page) {
  return page.getByTestId(testIds.helpPaginationStatus);
}

export function helpActions(page: Page) {
  return page.getByTestId(testIds.helpActions);
}

export function gameScreen(page: Page) {
  return page.getByTestId(testIds.gameScreen);
}

export function gameTopbar(page: Page) {
  return page.getByTestId(testIds.gameTopbar);
}

export function gameStage(page: Page) {
  return page.getByTestId(testIds.gameStage);
}

export function gameFooter(page: Page) {
  return page.getByTestId(testIds.gameFooter);
}

export function boardGrid(page: Page) {
  return page.getByTestId(testIds.boardGrid);
}

export function aiBadge(page: Page) {
  return page.getByTestId(testIds.gameModeBadge);
}

export function settingsScreen(page: Page) {
  return page.getByTestId(testIds.settingsScreen);
}

export function settingsActions(page: Page) {
  return page.getByTestId(testIds.settingsActions);
}

export function statMoves(page: Page) {
  return page.getByTestId(testIds.statMoves);
}
