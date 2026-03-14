import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("menu is toggled in live mode should open library overlay", () => {
    // Arrange
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();

    // Act
    controller.toggleMenu();

    // Assert
    expect(controller.getState().menuOpen).toBe(true);
    expect(controller.getState().activeMenuSection).toBe("library");
  });
});
