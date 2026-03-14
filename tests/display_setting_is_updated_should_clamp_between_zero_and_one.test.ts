import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("display setting is updated should clamp between zero and one", () => {
    // Arrange
    const controller = createShellController();

    // Act
    controller.setDisplaySetting("scanlines", 1.5);

    // Assert
    expect(controller.getState().display.scanlines).toBe(1);
  });
});
