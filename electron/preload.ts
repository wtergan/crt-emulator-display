import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("crtOverlay", {
  version: "0.1.0"
});

