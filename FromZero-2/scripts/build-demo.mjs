// Сборка демо index.html (один файл, все картинки внутри): node scripts/build-demo.mjs
// Боевая платформа (Supabase) в демо не нужна: platform.live.js подменяется на platform.stub.js.
import { build } from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stubLive = { name: "stub-live", setup(b) { b.onResolve({ filter: /platform\.live\.js$/ }, () => ({ path: path.join(root, "src/client/platform.stub.js") })); } };

const r = await build({
  entryPoints: [path.join(root, "src/client/main.jsx")], bundle: true, minify: true, write: false, outdir: "dist", jsx: "automatic",
  loader: { ".webp": "dataurl", ".png": "dataurl" }, plugins: [stubLive], legalComments: "none",
  define: { "process.env.NEXT_PUBLIC_DEMO_MODE": '"true"', "process.env.NODE_ENV": '"production"' }, logLevel: "error",
});
const js = r.outputFiles.find((f) => f.path.endsWith(".js")).text, css = r.outputFiles.find((f) => f.path.endsWith(".css"))?.text || "";
const fav = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0d0c0b"/><ellipse cx="19" cy="22" rx="10" ry="13.5" fill="none" stroke="#efe8dc" stroke-width="3.4"/><line x1="10.5" y1="34" x2="33" y2="5" stroke="#0d0c0b" stroke-width="8" stroke-linecap="round"/><line x1="10.5" y1="34" x2="33" y2="5" stroke="#e8392f" stroke-width="3.4" stroke-linecap="round"/></svg>`);
const out = path.join(root, "dist");
mkdirSync(out, { recursive: true });
const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>FromZero · с нуля до оффера</title><meta name="theme-color" content="#0d0c0b"><link rel="icon" href="data:image/svg+xml,${fav}"><style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/g, "<\\/script")}</script></body></html>`;
writeFileSync(path.join(out, "index.html"), html);
console.log("dist/index.html", Math.round(html.length / 1024), "KB");
