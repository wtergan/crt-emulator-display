import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";
import { mountShellApp } from "../src/ui/mount-shell-app";

describe("mountShellApp", () => {
  it("live state is rendered should show current favorite metadata", () => {
    // Arrange
    const root = document.createElement("div");
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();

    // Act
    mountShellApp(root, controller);

    // Assert
    expect(root.querySelector("[data-channel-chip]")?.textContent).toBe("CH 01");
    expect(root.querySelector("[data-screen-title]")?.textContent).toBe("Shadow of the Colossus");
    expect(root.querySelector("[data-emulator-chip]")?.textContent).toContain("PCSX2");
  });
});
