import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("power is off should enter booting state", () => {
    // Arrange
    const controller = createShellController();

    // Act
    controller.togglePower();

    // Assert
    expect(controller.getState().power).toBe("booting");
  });
});
