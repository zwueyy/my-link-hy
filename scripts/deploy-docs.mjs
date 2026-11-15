// Copies the static export (./out) into ./docs for GitHub Pages (main /docs).
// Keeps existing docs files such as PRD.md / wireframe.html.
import { cpSync, existsSync, rmSync, writeFileSync, mkdirSync } from "node:fs";

const BASE = "/my-link-hy";

if (!existsSync("out/index.html")) {
  console.error("out/index.html not found. Run `next build` first.");
  process.exit(1);
}
mkdirSync("docs", { recursive: true });
rmSync("docs/_next", { recursive: true, force: true });
cpSync("out", "docs", { recursive: true });
writeFileSync("docs/.nojekyll", "");

// GitHub Pages serves 404.html for unknown paths. Redirect /my-link-hy/<username>
// to the client-rendered profile page /my-link-hy/u/?username=<username>.
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>MyLink</title>
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body><p style="text-align:center;margin-top:20vh;font-family:sans-serif">이동 중...</p>
<script>
(function () {
  var base = "${BASE}";
  var reserved = ["u", "404", "_next", "_not-found"];
  var path = location.pathname;
  if (path.indexOf(base + "/") === 0) path = path.slice(base.length);
  var seg = path.split("/").filter(Boolean);
  if (seg.length === 1 && seg[0].indexOf(".") < 0 && reserved.indexOf(seg[0]) < 0) {
    location.replace(base + "/u/?username=" + encodeURIComponent(decodeURIComponent(seg[0])));
  } else {
    location.replace(base + "/");
  }
})();
</script></body></html>`;
writeFileSync("docs/404.html", html);
rmSync("docs/404", { recursive: true, force: true });
console.log("Deployed static files to docs/ (docs/index.html, docs/404.html ready).");
