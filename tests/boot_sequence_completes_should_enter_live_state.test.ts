import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("boot sequence completes should enter live state", () => {
    // Arrange
    const controller = createShellController();
    controller.togglePower();

    // Act
    controller.completeBoot();

    // Assert
    expect(controller.getState().power).toBe("live");
  });
});
