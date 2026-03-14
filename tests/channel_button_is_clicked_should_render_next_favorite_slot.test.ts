import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";
import { mountShellApp } from "../src/ui/mount-shell-app";

describe("mountShellApp", () => {
  it("channel button is clicked should render next favorite slot", () => {
    // Arrange
    const root = document.createElement("div");
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();
    mountShellApp(root, controller);

    // Act
    root.querySelector<HTMLButtonElement>("[data-action='channel-up']")?.click();

    // Assert
    expect(root.querySelector("[data-screen-title]")?.textContent).toBe("The Legend of Zelda: The Wind Waker");
    expect(root.querySelector("[data-channel-chip]")?.textContent).toBe("CH 02");
  });
});
