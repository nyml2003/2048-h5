import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { useCanvasSurface } from "@/app/useCanvasSurface";

import {
  ResizeObserverMock,
  emitResize,
  installRafMock,
} from "../utils/browser";
import { renderElement } from "../utils/renderHarness";

describe("useCanvasSurface", () => {
  it("draws on mount and redraws when the value or canvas size changes", () => {
    const raf = installRafMock();
    ResizeObserverMock.install();
    const renderer = {
      render: vi.fn(),
    };

    function Harness(props: { value: string }) {
      const ref = useCanvasSurface(props.value, renderer);
      return <canvas ref={ref} />;
    }

    const rendered = renderElement(<Harness value="alpha" />);
    const canvas = rendered.container.firstElementChild as HTMLCanvasElement;

    act(() => {
      raf.flushBatch();
    });

    expect(renderer.render).toHaveBeenCalledWith(canvas, "alpha");

    rendered.rerender(<Harness value="beta" />);

    act(() => {
      raf.flushBatch();
    });

    expect(renderer.render).toHaveBeenLastCalledWith(canvas, "beta");

    act(() => {
      emitResize(canvas);
      raf.flushBatch();
    });

    expect(renderer.render).toHaveBeenLastCalledWith(canvas, "beta");
    rendered.unmount();
  });

  it("cancels queued frames when a new draw is requested and on unmount", () => {
    const raf = installRafMock();
    ResizeObserverMock.install();
    const renderer = {
      render: vi.fn(),
    };

    function Harness(props: { value: string }) {
      const ref = useCanvasSurface(props.value, renderer);
      return <canvas ref={ref} />;
    }

    const rendered = renderElement(<Harness value="alpha" />);
    const canvas = rendered.container.firstElementChild as HTMLCanvasElement;

    expect(raf.request).toHaveBeenCalledTimes(1);

    rendered.rerender(<Harness value="beta" />);

    expect(raf.cancel).toHaveBeenCalledWith(1);
    expect(raf.request).toHaveBeenCalledTimes(2);
    const requestCountBeforeResize = raf.request.mock.calls.length;

    act(() => {
      emitResize(canvas);
    });

    expect(raf.cancel).toHaveBeenCalledWith(2);
    expect(raf.request.mock.calls.length).toBeGreaterThan(requestCountBeforeResize);

    const latestRequestId = raf.ids().at(-1);
    const observer = ResizeObserverMock.instances.at(-1);
    rendered.unmount();

    expect(observer?.disconnect).toHaveBeenCalledOnce();
    expect(raf.cancel).toHaveBeenCalledWith(latestRequestId);
    expect(renderer.render).not.toHaveBeenCalled();
  });
});
