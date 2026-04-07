import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  PRESS_REPEAT_DELAY_MS,
  PRESS_REPEAT_INTERVAL_MS,
  usePressRepeat,
} from "@/app/hooks/usePressRepeat";

import { renderHook } from "../../utils/renderHarness";

afterEach(() => {
  vi.useRealTimers();
});

describe("usePressRepeat", () => {
  it("fires once immediately when repeat mode is disabled", () => {
    const onPress = vi.fn();
    const hook = renderHook(() => usePressRepeat(onPress));

    hook.current.onPointerDown?.({
      currentTarget: {
        setPointerCapture: vi.fn(),
      },
      pointerId: 1,
      preventDefault: vi.fn(),
    } as unknown as React.PointerEvent<HTMLButtonElement>);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps firing while the button stays pressed in repeat mode", () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    const hasPointerCapture = vi.fn(() => true);
    const hook = renderHook(() => usePressRepeat(onPress, { repeat: true }));

    hook.current.onPointerDown?.({
      currentTarget: {
        setPointerCapture,
      },
      pointerId: 7,
      preventDefault: vi.fn(),
    } as unknown as React.PointerEvent<HTMLButtonElement>);

    expect(setPointerCapture).toHaveBeenCalledWith(7);
    expect(onPress).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(PRESS_REPEAT_DELAY_MS + PRESS_REPEAT_INTERVAL_MS * 2);
    });

    expect(onPress).toHaveBeenCalledTimes(3);

    hook.current.onPointerUp?.({
      currentTarget: {
        hasPointerCapture,
        releasePointerCapture,
      },
      pointerId: 7,
    } as unknown as React.PointerEvent<HTMLButtonElement>);

    expect(hasPointerCapture).toHaveBeenCalledWith(7);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it("skips all behavior while disabled", () => {
    const onPress = vi.fn();
    const disabledHook = renderHook(() =>
      usePressRepeat(onPress, { disabled: true, repeat: true })
    );

    disabledHook.current.onPointerDown?.({
      currentTarget: {
        setPointerCapture: vi.fn(),
      },
      pointerId: 3,
      preventDefault: vi.fn(),
    } as unknown as React.PointerEvent<HTMLButtonElement>);

    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not attach pointer leave handling for single-tap buttons", () => {
    const singleTapPress = vi.fn();
    const singleTapHook = renderHook(() => usePressRepeat(singleTapPress));

    expect(singleTapHook.current.onPointerLeave).toBeUndefined();
  });

  it("clears pending timers on unmount", () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    const hook = renderHook(() => usePressRepeat(onPress, { repeat: true }));

    hook.current.onPointerDown?.({
      currentTarget: {
        setPointerCapture: vi.fn(),
      },
      pointerId: 5,
      preventDefault: vi.fn(),
    } as unknown as React.PointerEvent<HTMLButtonElement>);

    hook.unmount();

    act(() => {
      vi.advanceTimersByTime(PRESS_REPEAT_DELAY_MS + PRESS_REPEAT_INTERVAL_MS * 3);
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
