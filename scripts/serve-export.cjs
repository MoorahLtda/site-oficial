/*
  Servidor estatico minimo para conferir o export do GitHub Pages antes de publicar.

  Reproduz o que o Pages faz: serve a pasta do export sob o subcaminho do repositorio
  (/site-oficial), sem cabecalhos, sem otimizacao de imagem e sem rota de API.

  Uso: node scripts/serve-export.cjs [pasta] [porta] [basePath]
  Padrao: .next-export 4321 /site-oficial
*/
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || ".next-export");
const port = Number(process.argv[3] || 4321);
const basePath = process.argv[4] ?? "/site-oficial";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  if (basePath && !clean.startsWith(basePath)) return null;
  const rest = basePath ? clean.slice(basePath.length) || "/" : clean;
  const candidates = [
    path.join(root, rest),
    path.join(root, rest, "index.html"),
    path.join(root, `${rest}.html`),
  ];
  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url || "/");
    if (!file) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => {
    console.log(`export em http://localhost:${port}${basePath}/ (pasta ${root})`);
  });
