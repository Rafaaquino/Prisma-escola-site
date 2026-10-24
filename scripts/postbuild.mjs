// Ajustes pós-build para o GitHub Pages.
//
// 1) 404: o Pages responde URLs inexistentes com /404.html (status 404). O React Router gera /404/index.html;
//    copiamos para 404.html e removemos a pasta, para que /404/ também caia no 404 de verdade.
// 2) Redirecionamentos: o Pages não faz 301. Para cada item de scripts/redirects.json criamos uma página
//    estática com <meta http-equiv="refresh"> + <link rel="canonical"> apontando para o destino
//    (o Google trata refresh imediato + canonical como redirecionamento).
// 3) robots.txt e sitemap.xml: o sitemap lista só as páginas com status "ready" (src/content/pages.json).
//    Enquanto VITE_ALLOW_INDEXING não for "true", o robots.txt bloqueia tudo.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = join(root, "build", "client");
const SITE = (process.env.VITE_SITE_URL ?? "https://www.prismaescola.com.br").replace(/\/$/, "");
const ALLOW_INDEXING = process.env.VITE_ALLOW_INDEXING === "true";
// caminho-base (ex.: "/repositorio" em revisão no github.io); "" em produção
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");

// ---- 0) com caminho-base, o React Router grava as páginas em build/client/<base>/, mas o GitHub Pages já publica a RAIZ do
//         artefato em /<base>/: sem "achatar", as páginas ficariam em /<base>/<base>/.
if (BASE) {
  const nested = join(out, ...BASE.split("/").filter(Boolean));
  if (existsSync(nested)) {
    cpSync(nested, out, { recursive: true, force: true });
    rmSync(nested, { recursive: true });
    console.log(`postbuild: páginas movidas de ${BASE}/ para a raiz do artefato`);
  }
}

// ---- 1) 404.html
const generated = join(out, "404", "index.html");
if (!existsSync(generated)) {
  console.error("postbuild: build/client/404/index.html não foi gerado (a rota /404 existe em src/routes.ts?)");
  process.exit(1);
}
cpSync(generated, join(out, "404.html"));
rmSync(join(out, "404"), { recursive: true });
rmSync(join(out, "__spa-fallback.html"), { force: true }); // não usado no Pages
console.log("postbuild: 404.html criado");

// ---- 2) redirecionamentos
const { redirects } = JSON.parse(readFileSync(join(root, "scripts", "redirects.json"), "utf8"));
const pageFile = (path) => (path === "/" ? join(out, "index.html") : join(out, ...path.split("/").filter(Boolean), "index.html"));
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const { from, to } of redirects) {
  if (!existsSync(pageFile(to))) {
    console.error(`postbuild: redirecionamento ${from} -> ${to}: o destino não existe no build`);
    process.exit(1);
  }
  // URL em estilo pasta ("/agenda/") vira agenda/index.html; URL de arquivo ("/quem_somos.html") vira o próprio arquivo
  const parts = from.split("/").filter(Boolean);
  const dest = from.endsWith("/") ? join(out, ...parts, "index.html") : join(out, ...parts);
  if (existsSync(dest)) {
    console.error(`postbuild: ${from} já existe no build; redirecionamento colidiria com uma página real`);
    process.exit(1);
  }
  const target = `${BASE}${to}`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Esta página mudou | Prisma Escola</title>
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
<link rel="canonical" href="${escapeHtml(SITE + to)}">
${ALLOW_INDEXING ? "" : '<meta name="robots" content="noindex, nofollow">\n'}<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body>
<p>Esta página mudou. <a href="${escapeHtml(target)}">Clique aqui para continuar</a>.</p>
</body>
</html>
`;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html);
}
console.log(`postbuild: ${redirects.length} redirecionamentos gerados`);

// ---- 3) robots.txt e sitemap.xml
const pages = JSON.parse(readFileSync(join(root, "src", "content", "pages.json"), "utf8"));
const ready = pages.filter((p) => p.status === "ready");
const missing = ready.filter((p) => !existsSync(pageFile(p.path)));
if (missing.length) {
  console.error(`postbuild: páginas "ready" sem HTML no build: ${missing.map((p) => p.path).join(", ")}`);
  process.exit(1);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ready.map((p) => `  <url><loc>${escapeHtml(SITE + p.path)}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(out, "sitemap.xml"), xml);
writeFileSync(
  join(out, "robots.txt"),
  ALLOW_INDEXING ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` : "# Site em construção/revisão: indexação bloqueada.\nUser-agent: *\nDisallow: /\n",
);
console.log(`postbuild: sitemap.xml com ${ready.length} URLs; robots.txt ${ALLOW_INDEXING ? "liberado" : "BLOQUEADO (noindex)"}`);
