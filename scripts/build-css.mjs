// Junta, limpa e minifica o CSS do site em arquivos únicos em public/assets/css/.
//
// Por quê: o Ascent carrega 6 folhas de estilo (~470 KB), a maior parte regras de seções que este site não usa
// (blog, equipe, carrinho...), e o Font Awesome traz ~2.000 ícones (~340 KB entre CSS e fontes) para uns 20 usados.
// O navegador não desenha nada até baixar tudo. Aqui:
//   1) as folhas do template + o CSS do Font Awesome viram UM arquivo;
//   2) PurgeCSS remove as regras cujas classes não aparecem em nenhum arquivo de src/ (o visual não muda);
//   3) lightningcss minifica e tira prefixos de navegadores antigos;
//   4) as fontes do Font Awesome são recortadas só com os ícones que sobraram.
// Os arquivos de origem (styles/) continuam sendo os do template, sem alteração.
//
// Roda sozinho antes de `npm run dev` e `npm run build` (ganchos predev/prebuild do package.json).
// `NO_PURGE=1 npm run build` pula a etapa 2 (para comparar ou se alguma regra sumir por engano).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { transform } from "lightningcss";
import { PurgeCSS } from "purgecss";
import subsetFont from "subset-font";

const root = fileURLToPath(new URL("../", import.meta.url));
const outDir = join(root, "public", "assets", "css");
const fontDir = join(root, "public", "assets", "webfonts");
const faDir = join(root, "node_modules", "@fortawesome", "fontawesome-free");
mkdirSync(outDir, { recursive: true });
const purgeEnabled = process.env.NO_PURGE !== "1";
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// A ordem importa (é a mesma que o template usava nas páginas).
const BUNDLES = {
  "site.min.css": {
    sources: ["@fontawesome", "fonts.css", "bootstrap.min.css", "animate.css", "meanmenu.css", "main.css", "prisma-overrides.css"],
    purge: true,
  },
  // só carrega na página do Laboratório de IA; já é pequeno e tem ids/classes próprios
  "ia-lab.min.css": { sources: ["ia-lab.css"], purge: false },
};

// ~2021 em diante: cobre os navegadores que o site realmente atende.
const targets = { chrome: 95 << 16, edge: 95 << 16, firefox: 95 << 16, safari: 14 << 16, ios_saf: 14 << 16, samsung: 15 << 16 };

/** CSS do Font Awesome só com as fontes que o site usa (as versões 5 e v4 de compatibilidade ficam de fora). */
function fontAwesomeCss() {
  const css = readFileSync(join(faDir, "css", "all.min.css"), "utf8");
  return css.replace(/@font-face\{font-family:"(?:Font Awesome 5 [^"]*|FontAwesome)"[^}]*\}/g, "");
}

/** Recorta as fontes do Font Awesome para só os ícones que sobraram no CSS (cada ícone é `--fa:"\f061"`). */
async function subsetFontAwesome(css) {
  const codepoints = new Set();
  for (const m of css.matchAll(/--fa:"((?:\\[0-9a-f]{1,6}\s?)+)"/gi)) {
    for (const cp of m[1].matchAll(/\\([0-9a-f]{1,6})/gi)) codepoints.add(parseInt(cp[1], 16));
  }
  if (!codepoints.size) throw new Error("build-css: nenhum ícone do Font Awesome encontrado no CSS purgado");
  const text = String.fromCodePoint(...codepoints);
  // o mesmo código existe nas 3 famílias (ex.: f061 só em "solid"); o que a fonte não tem é simplesmente ignorado
  for (const file of ["fa-solid-900", "fa-regular-400", "fa-brands-400"]) {
    const original = readFileSync(join(faDir, "webfonts", `${file}.woff2`));
    const small = await subsetFont(original, text, { targetFormat: "woff2" });
    writeFileSync(join(fontDir, `${file}.woff2`), small);
    console.log(`build-css: ${file}.woff2: ${kb(original.length)} -> ${kb(small.length)}`);
  }
  console.log(`build-css: ${codepoints.size} ícones do Font Awesome em uso`);
}

for (const [outName, { sources, purge }] of Object.entries(BUNDLES)) {
  let code = sources
    .map((name) => (name === "@fontawesome" ? fontAwesomeCss() : readFileSync(join(root, "styles", name), "utf8")).replace(/^@charset\s+"[^"]+";\s*/i, ""))
    .join("\n");
  const raw = Buffer.byteLength(code);

  if (purge && purgeEnabled) {
    const [result] = await new PurgeCSS().purge({
      content: [`${root.replaceAll("\\", "/")}src/**/*.{ts,tsx,json}`], // glob só aceita "/" (no Windows `root` vem com "\")
      css: [{ raw: code }],
      keyframes: true,
      fontFace: false, // as fontes de fonts.css e do Font Awesome são usadas (o FA as referencia por variável, que o PurgeCSS não enxerga)
      variables: false, // mantém todas as variáveis --bs-*/--*
      // classes que o JS troca depois de carregar e que podem não aparecer escritas por inteiro no código
      safelist: { standard: ["animated", "active", "show", "sticky", "is-out"], greedy: [/^wow$/] },
    });
    code = result.css;
  }
  if (purge) await subsetFontAwesome(code);

  const result = transform({
    filename: outName,
    code: Buffer.from(code),
    minify: true,
    targets,
    errorRecovery: true, // o CSS do template tem alguns trechos fora do padrão; ignora só o trecho inválido
  });
  for (const w of result.warnings ?? []) console.warn(`build-css: ${outName}: ${w.message} (linha ${w.loc?.line})`);
  writeFileSync(join(outDir, outName), result.code);
  console.log(`build-css: ${outName}: ${kb(raw)} -> ${kb(result.code.length)} (gzip ${kb(gzipSync(result.code).length)})${purge && !purgeEnabled ? " [sem purge]" : ""}`);
}
