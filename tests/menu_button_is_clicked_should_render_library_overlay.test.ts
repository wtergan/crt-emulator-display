import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";
import { mountShellApp } from "../src/ui/mount-shell-app";

describe("mountShellApp", () => {
  it("menu button is clicked should render library overlay", () => {
    // Arrange
    const root = document.createElement("div");
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();
    mountShellApp(root, controller);

    // Act
    root.querySelector<HTMLButtonElement>("[data-action='menu-toggle']")?.click();

    // Assert
    expect(root.querySelector("[data-menu-overlay]")?.textContent).toContain("Library");
    expect(root.querySelector("[data-library-item='metroid-prime']")?.textContent).toContain("Metroid Prime");
    expect(root.querySelector("[data-menu-overlay]")?.textContent).toContain("Display");
  });
});
