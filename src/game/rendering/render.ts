import { BOARD_SIZE } from "@/game/core/constants";
import { getTileColor } from "@/game/core/pieces";
import type { BoardCell, GameState } from "@/game/core/types";

const GRID_TOP_COLOR = "#86512f";
const GRID_BOTTOM_COLOR = "#613722";
const GRID_LINE_COLOR = "rgba(255, 244, 232, 0.08)";
const LIGHT_TEXT_COLOR = "#fff7ef";
const DARK_TEXT_COLOR = "#2d1d11";

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
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, GRID_TOP_COLOR);
  gradient.addColorStop(1, GRID_BOTTOM_COLOR);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawTile(
  context: CanvasRenderingContext2D,
  row: number,
  column: number,
  value: BoardCell,
  cellSize: number
) {
  const inset = Math.max(4, cellSize * 0.08);
  const x = column * cellSize;
  const y = row * cellSize;
  const tileWidth = Math.max(1, cellSize - inset * 2);
  const tileHeight = Math.max(1, cellSize - inset * 2);

  context.fillStyle = getTileColor(value);
  context.fillRect(x + inset, y + inset, tileWidth, tileHeight);
  context.fillStyle = "rgba(255, 255, 255, 0.16)";
  context.fillRect(x + inset, y + inset, tileWidth, Math.max(2, tileHeight * 0.14));

  if (value === null) {
    return;
  }

  context.fillStyle = value >= 16 ? LIGHT_TEXT_COLOR : DARK_TEXT_COLOR;
  context.font = `800 ${Math.max(12, Math.floor(cellSize * 0.32))}px "Trebuchet MS", "Segoe UI", sans-serif`;
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
  context.save();
  context.strokeStyle = GRID_LINE_COLOR;
  context.lineWidth = 1;

  for (let index = 1; index < BOARD_SIZE; index += 1) {
    const offset = Math.round(index * cellSize) + 0.5;

    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset, size);
    context.stroke();

    context.beginPath();
    context.moveTo(0, offset);
    context.lineTo(size, offset);
    context.stroke();
  }
  context.restore();

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
  context.fillStyle = "rgba(255, 255, 255, 0.16)";
  context.fillRect(x, y, tileSize, Math.max(2, tileSize * 0.14));

  if (value === null) {
    return;
  }

  context.fillStyle = value >= 16 ? LIGHT_TEXT_COLOR : DARK_TEXT_COLOR;
  context.font = `800 ${Math.max(12, Math.floor(tileSize * 0.28))}px "Trebuchet MS", "Segoe UI", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(value), width / 2, height / 2);
}
