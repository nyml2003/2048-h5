import type { BoardCell } from "@/game/types";

export const TILE_COLORS: Record<number, string> = {
  2: "#eceff4",
  4: "#e5d4b0",
  8: "#f6b26b",
  16: "#f39152",
  32: "#ef7552",
  64: "#eb5e4f",
  128: "#e0cf76",
  256: "#e0c05a",
  512: "#deaf45",
  1024: "#d79a37",
  2048: "#d4862a",
};

export const DEFAULT_TILE_COLOR = "#2a3447";
export const EMPTY_TILE_COLOR = "rgba(255, 255, 255, 0.08)";

export function getTileColor(value: BoardCell): string {
  if (value === null) {
    return EMPTY_TILE_COLOR;
  }

  return TILE_COLORS[value] ?? DEFAULT_TILE_COLOR;
}
