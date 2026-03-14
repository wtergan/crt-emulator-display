import { afterEach, describe, expect, it, vi } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";
import { mountShellApp } from "../src/ui/mount-shell-app";

describe("mountShellApp", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("power button is clicked should complete boot sequence", () => {
    // Arrange
    vi.useFakeTimers();
    const root = document.createElement("div");
    const controller = createShellController();
    mountShellApp(root, controller, { bootDurationMs: 20 });

    // Act
    root.querySelector<HTMLButtonElement>("[data-action='power-toggle']")?.click();

    // Assert
    expect(root.querySelector("[data-screen-title]")?.textContent).toBe("Warming up");

    vi.advanceTimersByTime(20);

    expect(root.querySelector("[data-screen-title]")?.textContent).toBe("Shadow of the Colossus");
  });
});
