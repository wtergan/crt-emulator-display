import { describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";

describe("createShellController", () => {
  it("highlighted library title is assigned should replace selected favorite slot", () => {
    // Arrange
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();
    controller.toggleMenu();
    controller.highlightLibraryGame(3);

    // Act
    controller.assignHighlightedLibraryGameToFavorite(0);

    // Assert
    expect(controller.getState().favorites[0].title).toBe("Metroid Prime");
    expect(controller.getState().currentFavorite.title).toBe("Metroid Prime");
  });
});
