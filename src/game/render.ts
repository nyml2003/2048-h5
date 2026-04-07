import { BOARD_SIZE } from "@/game/constants";
import { getTileColor } from "@/game/pieces";
import type { BoardCell, GameState } from "@/game/types";

const BACKGROUND_COLOR = "#111a2a";
const GRID_COLOR = "rgba(255, 255, 255, 0.06)";
const TEXT_COLOR = "#f4f7ff";

function setupCanvas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(bounds.width || canvas.width || 1));
  const height = Math.max(1, Math.floor(bounds.height || canvas.height || 1));
  const ratio = window.devicePixelRatio || 1;
  const scaledWidth = Math.max(1, Math.floor(width * ratio));
  const scaledHeight = Math.max(1, Math.floor(height * ratio));

  if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
  }

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  return {
    context,
    width,
    height,
  };
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, width, height);
}

function drawTile(
  context: CanvasRenderingContext2D,
  row: number,
  column: number,
  value: BoardCell,
  cellSize: number
) {
  const inset = Math.max(2, cellSize * 0.06);
  const x = column * cellSize;
  const y = row * cellSize;

  context.fillStyle = getTileColor(value);
  context.fillRect(
    x + inset,
    y + inset,
    Math.max(1, cellSize - inset * 2),
    Math.max(1, cellSize - inset * 2)
  );

  if (value === null) {
    return;
  }

  context.fillStyle = TEXT_COLOR;
  context.font = `600 ${Math.max(12, Math.floor(cellSize * 0.34))}px ui-sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(value), x + cellSize / 2, y + cellSize / 2);
}

export function drawGameBoard(canvas: HTMLCanvasElement, state: GameState) {
  const readyCanvas = setupCanvas(canvas);

  if (!readyCanvas) {
    return;
  }

  const { context, width, height } = readyCanvas;
  const size = Math.min(width, height);
  const cellSize = size / BOARD_SIZE;

  drawBackground(context, width, height);
  context.strokeStyle = GRID_COLOR;
  context.lineWidth = 1;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      drawTile(context, row, column, state.board[row][column], cellSize);
    }
  }
}

export function drawPreview(canvas: HTMLCanvasElement, tileValue: unknown) {
  const readyCanvas = setupCanvas(canvas);

  if (!readyCanvas) {
    return;
  }

  const { context, width, height } = readyCanvas;
  const value =
    typeof tileValue === "number" && Number.isFinite(tileValue) ? tileValue : null;
  const tileSize = Math.min(width, height) * 0.8;
  const x = (width - tileSize) / 2;
  const y = (height - tileSize) / 2;

  drawBackground(context, width, height);
  context.fillStyle = getTileColor(value);
  context.fillRect(x, y, tileSize, tileSize);

  if (value === null) {
    return;
  }

  context.fillStyle = TEXT_COLOR;
  context.font = `600 ${Math.max(12, Math.floor(tileSize * 0.28))}px ui-sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(value), width / 2, height / 2);
}
