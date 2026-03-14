import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const electronOutDir = path.join(distDir, "electron");

await rm(distDir, { recursive: true, force: true });
await mkdir(electronOutDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(root, "electron", "main.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  external: ["electron"],
  outfile: path.join(electronOutDir, "main.cjs")
});

await esbuild.build({
  entryPoints: [path.join(root, "electron", "preload.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  external: ["electron"],
  outfile: path.join(electronOutDir, "preload.cjs")
});

await esbuild.build({
  entryPoints: [path.join(root, "src", "renderer.ts")],
  bundle: true,
  platform: "browser",
  format: "iife",
  outfile: path.join(distDir, "renderer.js")
});

const htmlPath = path.join(root, "src", "index.html");
const htmlTemplate = await readFile(htmlPath, "utf8");
const htmlOutput = htmlTemplate.replace("./renderer.ts", "./renderer.js");
await writeFile(path.join(distDir, "index.html"), htmlOutput, "utf8");
await copyFile(path.join(root, "src", "styles.css"), path.join(distDir, "styles.css"));
