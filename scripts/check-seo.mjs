// Revisão de SEO automática sobre o site JÁ GERADO (build/client). Falha (código 1) se encontrar problema.
//
// Para cada página publicada ("ready" em src/content/pages.json) confere: <title> e description (existem, tamanho, não repetidos),
// canonical certo, exatamente um <h1>, <html lang>, Open Graph/Twitter, imagem de compartilhamento existente, dados estruturados
// (JSON-LD válido, com os campos essenciais), imagens com atributo alt, noindex coerente e TODOS os links internos
// (para páginas, arquivos e imagens), inclusive os do menu e do rodapé.
//
// Uso: npm run check:seo   (rode depois do build; com VITE_ALLOW_INDEXING=true confere também que nada está bloqueado)
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = join(root, "build", "client");
const SITE = (process.env.VITE_SITE_URL ?? "https://www.prismaescola.com.br").replace(/\/$/, "");
const INDEXING = process.env.VITE_ALLOW_INDEXING === "true";
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");

const pages = JSON.parse(readFileSync(join(root, "src", "content", "pages.json"), "utf8"));
const problems = [];
const warnings = [];
const bad = (page, msg) => problems.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const fileFor = (path) => (path.endsWith("/") ? join(out, ...path.split("/").filter(Boolean), "index.html") : join(out, ...path.split("/").filter(Boolean)));
const exists = (urlPath) => {
  const p = decodeURIComponent(urlPath.split("#")[0].split("?")[0]).replace(BASE ? new RegExp(`^${BASE}`) : /^$/, "") || "/";
  return existsSync(fileFor(p)) || existsSync(fileFor(p.endsWith("/") ? p : `${p}/`));
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const tag = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};
const meta = (html, attr, name) => tag(html, new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i")) ?? tag(html, new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i"));

const titles = new Map();
const descriptions = new Map();
const linkChecked = new Set();
const inbound = new Map(); // página -> de quais páginas ela recebe link
let jsonLdBlocks = 0;

for (const page of pages.filter((p) => p.status === "ready")) {
  const file = fileFor(page.path);
  if (!existsSync(file)) {
    bad(page.path, "página sem HTML no build");
    continue;
  }
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const where = page.path;

  // título e descrição
  const title = tag(head, /<title>([^<]*)<\/title>/);
  if (!title) bad(where, "sem <title>");
  else {
    if (title.length > 65) warn(where, `título longo (${title.length} caracteres; o Google corta perto de 60): "${title}"`);
    if (title.length < 15) bad(where, `título curto demais: "${title}"`);
    if (!/Prisma/i.test(title)) bad(where, `título sem o nome da escola: "${title}"`);
    if (titles.has(title)) bad(where, `título repetido com ${titles.get(title)}: "${title}"`);
    titles.set(title, where);
  }
  const desc = meta(head, "name", "description");
  if (!desc) bad(where, "sem meta description");
  else {
    if (desc.length < 70) bad(where, `description curta (${desc.length}): "${desc}"`);
    if (desc.length > 170) warn(where, `description longa (${desc.length}); o Google corta perto de 155-160`);
    if (descriptions.has(desc)) bad(where, `description repetida com ${descriptions.get(desc)}`);
    descriptions.set(desc, where);
  }

  // canonical, idioma, robots
  const canonical = tag(head, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  if (canonical !== `${SITE}${page.path}`) bad(where, `canonical errado: ${canonical} (esperado ${SITE}${page.path})`);
  if (!/<html[^>]*lang="pt-BR"/.test(html)) bad(where, 'sem <html lang="pt-BR">');
  const robots = meta(head, "name", "robots");
  if (INDEXING && robots && /noindex/i.test(robots)) bad(where, `página publicada com robots "${robots}" (indexação liberada)`);
  if (!INDEXING && !(robots && /noindex/i.test(robots))) bad(where, "modo revisão sem noindex");

  // Open Graph / Twitter
  for (const k of ["og:title", "og:description", "og:url", "og:image", "og:type"]) if (!meta(head, "property", k)) bad(where, `sem ${k}`);
  if (meta(head, "name", "twitter:card") !== "summary_large_image") bad(where, "sem twitter:card summary_large_image");
  const og = meta(head, "property", "og:image");
  if (og) {
    const local = og.replace(SITE, "");
    if (!existsSync(join(out, ...local.split("/").filter(Boolean)))) bad(where, `og:image não existe no build: ${og}`);
  }

  // um <h1> só
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) bad(where, `${h1} tags <h1> (deve haver exatamente 1)`);

  // imagens sem alt
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  const noAlt = imgs.filter((i) => !/\balt=/.test(i));
  if (noAlt.length) bad(where, `${noAlt.length} imagem(ns) sem atributo alt`);

  // dados estruturados
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const b of blocks) {
    jsonLdBlocks++;
    let data;
    try {
      data = JSON.parse(decode(b[1]));
    } catch (e) {
      bad(where, `JSON-LD inválido: ${e.message}`);
      continue;
    }
    if (data["@context"] !== "https://schema.org") bad(where, 'JSON-LD sem @context "https://schema.org"');
    const graph = data["@graph"] ?? [data];
    const ids = new Set(graph.map((n) => n["@id"]).filter(Boolean));
    for (const n of graph) {
      const t = n["@type"];
      if (t === "BreadcrumbList") {
        const items = n.itemListElement ?? [];
        if (items.length < 2) bad(where, "BreadcrumbList com menos de 2 itens");
        items.forEach((it, i) => {
          if (it.position !== i + 1 || !it.name || !it.item) bad(where, `BreadcrumbList item ${i + 1} incompleto`);
          if (it.item && !exists(it.item.replace(SITE, ""))) bad(where, `BreadcrumbList aponta para página inexistente: ${it.item}`);
        });
        if (items.at(-1)?.item !== `${SITE}${page.path}`) bad(where, "último item do BreadcrumbList não é a própria página");
      }
      if (t === "School" || t === "EducationalOrganization") {
        for (const f of ["name", "url", "@id"]) if (!n[f]) bad(where, `${t} sem ${f}`);
        if (t === "School") {
          const a = n.address ?? {};
          for (const f of ["streetAddress", "addressLocality", "addressRegion", "addressCountry"]) if (!a[f]) bad(where, `School sem address.${f}`);
          if (!/^\+55\d{10,11}$/.test(n.telephone ?? "")) bad(where, `School com telefone fora do padrão: ${n.telephone}`);
          if (!(n.openingHoursSpecification ?? []).length) bad(where, "School sem horário de atendimento");
        }
        for (const ref of (n.subOrganization ?? []).map((s) => s["@id"])) if (!ids.has(ref)) bad(where, `subOrganization aponta para @id ausente: ${ref}`);
        if (n.logo?.url && !existsSync(join(out, ...n.logo.url.replace(SITE, "").split("/").filter(Boolean)))) bad(where, `logo não existe no build: ${n.logo.url}`);
      }
      if (t === "FAQPage") {
        const q = n.mainEntity ?? [];
        if (!q.length) bad(where, "FAQPage vazio");
        for (const item of q) if (!item.name || !item.acceptedAnswer?.text) bad(where, `FAQ incompleto: "${item.name}"`);
        // cada pergunta tem de estar visível na página
        for (const item of q) if (!html.includes(item.name.replace(/&/g, "&amp;"))) bad(where, `pergunta do FAQ não aparece na página: "${item.name}"`);
      }
    }
  }

  // links internos
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const key = href.split("#")[0];
    const target = (BASE && key.startsWith(BASE) ? key.slice(BASE.length) : key).split("?")[0];
    if (target !== page.path && target.endsWith("/")) inbound.set(target, (inbound.get(target) ?? new Set()).add(page.path));
    if (linkChecked.has(key)) continue;
    linkChecked.add(key);
    if (!exists(key)) bad(where, `link interno quebrado: ${href}`);
  }
  // arquivos e imagens referenciados no HTML (src, srcset, preload)
  for (const m of html.matchAll(/\b(?:src|href)="(\/[^"#?]+\.(?:webp|png|jpe?g|svg|pdf|ico|woff2|css|js))"/g)) {
    const key = m[1];
    if (linkChecked.has(key)) continue;
    linkChecked.add(key);
    if (!exists(key)) bad(where, `arquivo referenciado não existe: ${key}`);
  }
}

// páginas órfãs: publicadas, mas sem link vindo de nenhuma outra página
for (const page of pages.filter((p) => p.status === "ready" && p.path !== "/")) {
  const from = inbound.get(page.path);
  if (!from || from.size === 0) warn(page.path, "página órfã: nenhuma outra página linka para ela");
  else if (from.size === 1) warn(page.path, `só recebe link de 1 página (${[...from][0]})`);
}

// favicon e robots
if (!existsSync(join(out, "favicon.ico"))) bad("/", "falta /favicon.ico");

console.log(`\nSEO: ${pages.filter((p) => p.status === "ready").length} páginas, ${titles.size} títulos únicos, ${descriptions.size} descriptions únicas, ${jsonLdBlocks} blocos JSON-LD, ${linkChecked.size} links/arquivos conferidos.\n`);
if (warnings.length) {
  console.log("Avisos (não bloqueiam):");
  for (const w of warnings) console.log("  - " + w);
  console.log("");
}
if (problems.length) {
  console.error("PROBLEMAS:");
  for (const p of problems) console.error("  ✗ " + p);
  process.exit(1);
}
console.log("✅ Revisão de SEO sem problemas.");
