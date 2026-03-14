import { createShellController } from "./core/create-shell-controller";
import { mountShellApp } from "./ui/mount-shell-app";

const root = document.querySelector<HTMLElement>("#app");

if (root) {
  const controller = createShellController();
  mountShellApp(root, controller);
}
