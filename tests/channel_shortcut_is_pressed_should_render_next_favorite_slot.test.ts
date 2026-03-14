import { afterEach, describe, expect, it } from "vitest";
import { createShellController } from "../src/core/create-shell-controller";
import { mountShellApp } from "../src/ui/mount-shell-app";

describe("mountShellApp", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("channel shortcut is pressed should render next favorite slot", () => {
    // Arrange
    const root = document.createElement("div");
    document.body.append(root);
    const controller = createShellController();
    controller.togglePower();
    controller.completeBoot();
    mountShellApp(root, controller);

    // Act
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "]" }));

    // Assert
    expect(root.querySelector("[data-screen-title]")?.textContent).toBe("The Legend of Zelda: The Wind Waker");
  });
});
