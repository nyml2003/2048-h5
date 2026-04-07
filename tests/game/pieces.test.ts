import { describe, expect, it } from "vitest";

import { DEFAULT_TILE_COLOR, EMPTY_TILE_COLOR, getTileColor } from "@/game/pieces";

describe("pieces (2048 palette)", () => {
  it("returns the empty tile color for null", () => {
    expect(getTileColor(null)).toBe(EMPTY_TILE_COLOR);
  });

  it("returns explicit colors for known values and fallback for unknown values", () => {
    expect(getTileColor(2)).not.toBe(DEFAULT_TILE_COLOR);
    expect(getTileColor(2048)).not.toBe(DEFAULT_TILE_COLOR);
    expect(getTileColor(4096)).toBe(DEFAULT_TILE_COLOR);
  });
});
