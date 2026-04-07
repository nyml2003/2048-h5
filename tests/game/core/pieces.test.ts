import { describe, expect, it } from "vitest";

import {
  DEFAULT_TILE_COLOR,
  EMPTY_TILE_COLOR,
  getTileColor,
} from "@/game/core/pieces";

describe("pieces", () => {
  it("returns the empty tile color for null", () => {
    expect(getTileColor(null)).toBe(EMPTY_TILE_COLOR);
  });

  it("returns a mapped color for known tile values", () => {
    expect(getTileColor(2)).not.toBe(DEFAULT_TILE_COLOR);
    expect(getTileColor(2048)).not.toBe(DEFAULT_TILE_COLOR);
  });

  it("falls back to the default tile color for unexpected values", () => {
    expect(getTileColor(4096)).toBe(DEFAULT_TILE_COLOR);
  });
});
