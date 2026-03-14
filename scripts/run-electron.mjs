import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const electronBinary = path.join(root, "node_modules", "electron", "dist", "electron");

if (!existsSync(electronBinary)) {
  console.error("Electron binary was not found. Run `npm install` first.");
  process.exit(1);
}

const linuxbrewLib = "/home/linuxbrew/.linuxbrew/lib";
const env = { ...process.env };

if (process.platform === "linux" && existsSync(linuxbrewLib)) {
  env.LD_LIBRARY_PATH = env.LD_LIBRARY_PATH
    ? `${linuxbrewLib}:${env.LD_LIBRARY_PATH}`
    : linuxbrewLib;
}

const child = spawn(electronBinary, process.argv.slice(2), {
  stdio: "inherit",
  env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
