// Renders every tutorial composition to ../public/tutorials/<id>.mp4
// Usage: npm run render:all   (from the remotion/ folder)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(__dirname, "src", "index.ts");
const outDir = path.join(__dirname, "..", "public", "tutorials");
mkdirSync(outDir, { recursive: true });

const IDS = ["bienvenue", "modifier-texte", "images-videos", "publier-preview", "ajouter-article", "contact"];

for (const id of IDS) {
  const out = path.join(outDir, `${id}.mp4`);
  console.log(`\n▸ Rendering ${id} → ${out}`);
  execFileSync("npx", ["remotion", "render", entry, id, out, "--codec=h264"], {
    cwd: __dirname,
    stdio: "inherit",
  });
}
console.log("\n✓ All tutorials rendered to public/tutorials/");
