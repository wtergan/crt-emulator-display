import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("channel is changed in live mode should cycle favorite slots", () => {
    // Arrange
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();

    // Act
    controller.changeChannel(1);

    // Assert
    expect(controller.getState().currentFavorite.title).toBe("The Legend of Zelda: The Wind Waker");
  });
});
