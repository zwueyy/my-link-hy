// Copies the static export (./out) into ./docs for GitHub Pages (main /docs).
// Keeps existing docs files such as PRD.md / wireframe.html.
import { cpSync, existsSync, rmSync, writeFileSync, mkdirSync } from "node:fs";

if (!existsSync("out/index.html")) {
  console.error("out/index.html not found. Run `next build` first.");
  process.exit(1);
}
mkdirSync("docs", { recursive: true });
rmSync("docs/_next", { recursive: true, force: true });
cpSync("out", "docs", { recursive: true });
writeFileSync("docs/.nojekyll", "");
console.log("Deployed static files to docs/ (docs/index.html ready).");
