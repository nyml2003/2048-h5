import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { use2048Autoplay } from "@/app/hooks/use2048Autoplay";
import { createAppState } from "@/app/state/appState";
import { restartGame } from "@/game/core/gameEngine";

import { installRafMock } from "../../utils/browser";
import { renderHook } from "../../utils/renderHarness";

const planAiMoveMock = vi.hoisted(() => vi.fn());

vi.mock("@/game/ai/gameAi", async () => {
  const actual = await vi.importActual("@/game/ai/gameAi");

  return {
    ...actual,
    planAiMove: planAiMoveMock,
  };
});

describe("use2048Autoplay", () => {
  it("dispatches controls while AI mode is active", () => {
    const raf = installRafMock();
    const dispatch = vi.fn();
    const state = {
      ...createAppState(),
      playerMode: "ai" as const,
      screen: "game" as const,
      game: restartGame([0, 0, 0, 0]),
    };

    planAiMoveMock.mockReturnValue("left");

    const rendered = renderHook(() => use2048Autoplay(state, dispatch));

    act(() => {
      raf.flush();
    });

    expect(dispatch).toHaveBeenCalledWith({ type: "control", control: "left" });
    rendered.unmount();
  });

  it("does not schedule controls outside the AI gameplay state", () => {
    const raf = installRafMock();
    const dispatch = vi.fn();

    renderHook(() => use2048Autoplay(createAppState(), dispatch));

    expect(raf.request).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
