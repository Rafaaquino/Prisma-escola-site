// Servidor local que imita o GitHub Pages para o conteúdo de build/client:
//  - /pasta  -> 301 para /pasta/   (Pages faz isso quando existe pasta/index.html)
//  - /pasta/ -> serve pasta/index.html
//  - /pagina -> serve pagina.html  (se existir)
//  - inexistente -> 404.html com status 404
// Uso: npm run preview   (PORT=5000 npm run preview para trocar a porta)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = normalize(fileURLToPath(new URL("../build/client/", import.meta.url)));
const PORT = Number(process.env.PORT ?? 4173);
// caminho-base (ex.: BASE_PATH=/repositorio/), para testar a versão de revisão do github.io
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const kind = async (p) => {
  try {
    const s = await stat(p);
    return s.isDirectory() ? "dir" : "file";
  } catch {
    return null;
  }
};

// o GitHub Pages entrega texto com gzip; aqui também, para as medições de peso/tempo refletirem a produção
const COMPRESSIBLE = new Set([".html", ".htm", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);

async function send(req, res, status, file) {
  let body = await readFile(file);
  const ext = extname(file).toLowerCase();
  const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "no-cache" };
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""))) {
    body = gzipSync(body);
    headers["Content-Encoding"] = "gzip";
    headers["Vary"] = "Accept-Encoding";
  }
  res.writeHead(status, headers);
  res.end(body);
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  if (BASE) {
    if (pathname === BASE) {
      res.writeHead(301, { Location: `${BASE}/${url.search}` }).end();
      return;
    }
    pathname = pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : "/__fora_da_base__";
  }

  const target = normalize(join(ROOT, pathname));
  if (target !== ROOT.replace(/[\\/]$/, "") && !target.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  let status = 200;
  try {
    const k = await kind(target);
    if (k === "dir") {
      if (!pathname.endsWith("/")) {
        status = 301;
        res.writeHead(301, { Location: `${BASE}${pathname}/${url.search}` }).end();
      } else if (await kind(join(target, "index.html"))) {
        await send(req, res, 200, join(target, "index.html"));
      } else {
        status = 404;
        await send(req, res, 404, join(ROOT, "404.html"));
      }
    } else if (k === "file") {
      await send(req, res, 200, target);
    } else if (!extname(pathname) && (await kind(`${target}.html`)) === "file") {
      await send(req, res, 200, `${target}.html`);
    } else {
      status = 404;
      if (await kind(join(ROOT, "404.html"))) await send(req, res, 404, join(ROOT, "404.html"));
      else res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404 Not Found");
    }
  } catch (err) {
    status = 500;
    res.writeHead(500).end(String(err));
  }
  console.log(`${status} ${req.method} ${pathname}`);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Prévia do build (modo GitHub Pages): http://localhost:${PORT}/  — pasta ${ROOT}${sep === "\\" ? "" : ""}`);
});
