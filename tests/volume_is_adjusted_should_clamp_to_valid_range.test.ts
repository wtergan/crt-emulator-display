import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("volume is adjusted should clamp to valid range", () => {
    // Arrange
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();

    // Act
    controller.adjustVolume(80);

    // Assert
    expect(controller.getState().volume).toBe(100);
  });
});
