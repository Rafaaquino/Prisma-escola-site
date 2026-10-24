// Confere se as URLs do site antigo continuam existindo no build (preservar posicionamento no Google).
//
//  - cada URL de `keep`  -> build/client/<path>/index.html existe, tem <title>, lang pt-BR e canonical correto
//  - cada URL de `drop`  -> NÃO pode existir (é lixo do tema; deve dar 404)
//  - páginas extras      -> permitidas só se listadas em `newUrls`; senão avisa
// Régua: scripts/legacy-urls.json (gerada do backup do WordPress, independente do código do site).
// Uso: npm run build && npm run check:urls     (código de saída 1 se algo falhar)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const build = join(root, "build", "client");
const SITE = (process.env.VITE_SITE_URL ?? "https://www.prismaescola.com.br").replace(/\/$/, "");
// caminho-base (ex.: "/repositorio" em revisão no github.io); "" em produção
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");
const legacy = JSON.parse(readFileSync(join(root, "scripts", "legacy-urls.json"), "utf8"));

if (!existsSync(build)) {
  console.error("build/client não existe. Rode `npm run build` antes.");
  process.exit(1);
}

const fileFor = (path) => (path === "/" ? join(build, "index.html") : join(build, ...path.split("/").filter(Boolean), "index.html"));
const pick = (html, re) => html.match(re)?.[1];

// páginas realmente geradas
const built = new Set();
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === "index.html") {
      const rel = relative(build, dir).split(sep).join("/");
      built.add(rel ? `/${rel}/` : "/");
    }
  }
})(build);

let fails = 0;
const rows = [];
let noindex = 0;

for (const { path, title } of legacy.keep) {
  const problems = [];
  const file = fileFor(path);
  if (!existsSync(file)) {
    problems.push("página NÃO foi gerada");
  } else {
    const html = readFileSync(file, "utf8");
    if (!/<html[^>]*lang="pt-BR"/.test(html)) problems.push('sem lang="pt-BR"');
    if (!pick(html, /<title>([^<]+)<\/title>/)) problems.push("sem <title>");
    const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/);
    if (canonical !== `${SITE}${path}`) problems.push(`canonical errado: ${canonical ?? "ausente"}`);
    if (/<meta name="robots" content="noindex/.test(html)) noindex++;
  }
  if (problems.length) fails++;
  rows.push({ path, title, ok: problems.length === 0, problems });
}

const dropFound = legacy.drop.filter((d) => built.has(d.path));
const allowedNew = new Set(legacy.newUrls);
const keepSet = new Set(legacy.keep.map((k) => k.path));
const isRedirectStub = (p) => /<meta http-equiv="refresh"/.test(readFileSync(fileFor(p), "utf8"));
const extras = [...built].filter((p) => !keepSet.has(p) && !allowedNew.has(p) && p !== "/404/" && !isRedirectStub(p));

// ---- redirecionamentos de URLs pré-WordPress (scripts/redirects.json)
const { redirects, leave404 } = JSON.parse(readFileSync(join(root, "scripts", "redirects.json"), "utf8"));
const redirectProblems = [];
const decided = new Set([...redirects.map((r) => r.from), ...leave404.map((l) => l.path)]);
for (const p of legacy.preWordpressHtml) if (!decided.has(p)) redirectProblems.push(`${p}: URL antiga sem decisão (nem redireciona nem consta em leave404)`);
for (const p of legacy.movedToRedirect ?? []) if (!redirects.some((r) => r.from === p)) redirectProblems.push(`${p}: saiu da lista de páginas mas não tem redirecionamento`);
for (const { from, to } of redirects) {
  const parts = from.split("/").filter(Boolean);
  const file = from.endsWith("/") ? join(build, ...parts, "index.html") : join(build, ...parts);
  if (!existsSync(file)) {
    redirectProblems.push(`${from}: página de redirecionamento não foi gerada`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  if (!html.includes(`<meta http-equiv="refresh" content="0; url=${BASE}${to}">`)) redirectProblems.push(`${from}: meta refresh não aponta para ${to}`);
  if (!html.includes(`<link rel="canonical" href="${SITE}${to}">`)) redirectProblems.push(`${from}: canonical não aponta para ${SITE}${to}`);
  if (!keepSet.has(to) && !allowedNew.has(to)) redirectProblems.push(`${from}: destino ${to} não é uma URL válida do site`);
}
for (const { path } of leave404) {
  if (existsSync(join(build, ...path.split("/").filter(Boolean)))) redirectProblems.push(`${path}: deveria dar 404, mas existe no build`);
}
fails += redirectProblems.length;

// ---- robots.txt e sitemap.xml
const seoProblems = [];
const robots = existsSync(join(build, "robots.txt")) ? readFileSync(join(build, "robots.txt"), "utf8") : null;
const allowIndexing = !!robots && /^Allow: \//m.test(robots);
let sitemapCount = 0;
if (!robots) seoProblems.push("robots.txt ausente");
else if (allowIndexing && !/^Sitemap: /m.test(robots)) seoProblems.push("robots.txt libera a indexação mas não informa o sitemap");
if (allowIndexing && robots && /^Disallow: \/\s*$/m.test(robots)) seoProblems.push("robots.txt bloqueia o site inteiro com a indexação liberada");
if (!existsSync(join(build, "sitemap.xml"))) {
  seoProblems.push("sitemap.xml ausente");
} else {
  const locs = [...readFileSync(join(build, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  sitemapCount = locs.length;
  const pagesJson = JSON.parse(readFileSync(join(root, "src", "content", "pages.json"), "utf8"));
  const noindexed = (path) => /<meta name="robots" content="noindex/.test(readFileSync(fileFor(path), "utf8"));
  for (const loc of locs) {
    if (!loc.startsWith(SITE)) { seoProblems.push(`${loc}: fora de ${SITE}`); continue; }
    const path = loc.slice(SITE.length) || "/";
    if (!built.has(path)) seoProblems.push(`${path}: está no sitemap mas não existe no build`);
    else if (allowIndexing && noindexed(path)) seoProblems.push(`${path}: está no sitemap mas tem noindex`);
  }
  for (const p of pagesJson) {
    if (p.status === "ready" && !locs.includes(SITE + p.path)) seoProblems.push(`${p.path}: página pronta fora do sitemap`);
    if (p.status === "todo" && allowIndexing && built.has(p.path) && !noindexed(p.path)) seoProblems.push(`${p.path}: página provisória sem noindex`);
  }
}
fails += seoProblems.length;

// ---- relatório
console.log(`\nVerificação de URLs — base ${SITE}\n`);
for (const r of rows) console.log(`${r.ok ? "  OK " : "FALHA"}  ${r.path.padEnd(46)} ${r.problems.join("; ")}`);
console.log(`\nURLs do site antigo preservadas: ${rows.filter((r) => r.ok).length}/${rows.length}`);

if (dropFound.length) {
  fails += dropFound.length;
  console.log(`\nFALHA — URLs de lixo do tema que NÃO deveriam existir: ${dropFound.map((d) => d.path).join(", ")}`);
} else {
  console.log(`URLs descartadas (demo do tema) ausentes do build, como esperado: ${legacy.drop.length}/${legacy.drop.length}`);
}

if (redirectProblems.length) {
  console.log("\nFALHA — redirecionamentos de URLs antigas (pré-WordPress):");
  for (const p of redirectProblems) console.log(`  - ${p}`);
} else {
  console.log(`Redirecionamentos de URLs antigas OK: ${redirects.length} redirecionam (inclui /default.htm) e ${leave404.length} ficam em 404 com motivo; as ${legacy.preWordpressHtml.length} URLs pré-WordPress da régua estão todas decididas.`);
}

if (seoProblems.length) {
  console.log("\nFALHA — robots.txt / sitemap.xml:");
  for (const p of seoProblems) console.log(`  - ${p}`);
} else {
  console.log(`robots.txt e sitemap.xml OK (${sitemapCount} URLs no sitemap; robots ${allowIndexing ? "liberado" : "bloqueando tudo, como esperado em revisão"}).`);
}

if (extras.length) console.log(`\nAVISO — páginas geradas fora da régua (nem antigas nem em newUrls): ${extras.join(", ")}`);
const newBuilt = legacy.newUrls.filter((p) => built.has(p));
console.log(`URLs novas permitidas presentes: ${newBuilt.length ? newBuilt.join(", ") : "nenhuma"}`);
console.log(
  noindex === rows.filter((r) => r.ok).length
    ? "Indexação: BLOQUEADA (noindex) — correto enquanto o site está em construção; no lançamento use VITE_ALLOW_INDEXING=true."
    : `Indexação: liberada em ${rows.length - noindex} página(s).`,
);
console.log(existsSync(join(build, "404.html")) ? "404.html presente (URLs inexistentes retornam 404 no GitHub Pages)." : "FALHA — 404.html ausente.");
if (!existsSync(join(build, "404.html"))) fails++;

console.log(fails ? `\n❌ ${fails} problema(s).` : "\n✅ Todas as URLs do site antigo estão preservadas.");
process.exit(fails ? 1 : 0);
