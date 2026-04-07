import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { useAutoplay } from "@/app/useAutoplay";
import { createAppState } from "@/app/appState";
import { restartGame } from "@/app/gameGateway";
import { installRafMock } from "../utils/browser";
import { renderHook } from "../utils/renderHarness";

const planAiActionMock = vi.hoisted(() => vi.fn());

vi.mock("@/app/gameGateway", async () => {
  const actual = await vi.importActual("@/app/gameGateway");

  return {
    ...actual,
    planAiAction: planAiActionMock,
  };
});

describe("useAutoplay", () => {
  it("dispatches controls while AI mode is active", () => {
    const raf = installRafMock();
    const dispatch = vi.fn();
    const state = {
      ...createAppState(),
      playerMode: "ai" as const,
      screen: "game" as const,
      game: restartGame([0, 0, 0, 0]),
    };

    planAiActionMock.mockReturnValue("left");

    const rendered = renderHook(() => useAutoplay(state, dispatch));

    act(() => {
      raf.flush();
    });

    expect(dispatch).toHaveBeenCalledWith({ type: "control", control: "left" });
    rendered.unmount();
  });

  it("does not schedule controls outside the AI gameplay state", () => {
    const raf = installRafMock();
    const dispatch = vi.fn();

    renderHook(() => useAutoplay(createAppState(), dispatch));

    expect(raf.request).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
