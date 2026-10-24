// Converte os PNG/JPG de public/assets/img para WebP (mesma resolução, qualidade visualmente igual, bem menores).
//
// Uso:  node scripts/optimize-images.mjs            -> gera .webp ao lado de cada .png/.jpg
//       node scripts/optimize-images.mjs --remove   -> idem e apaga os originais convertidos
//
// Ficam como PNG de propósito: o favicon e o apple-touch-icon (navegadores e iOS esperam PNG).
// Depois de converter, troque a extensão nas referências (src/**/*.tsx e CSS) para .webp.
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/assets/img", import.meta.url));
const KEEP = new Set(["faveicon.png", "apple-touch-icon.png"]);
const remove = process.argv.includes("--remove");

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(png|jpe?g)$/i.test(name) && !KEEP.has(name)) files.push(p);
  }
})(root);

let before = 0;
let after = 0;
for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file).webp({ quality: 82, alphaQuality: 100, effort: 6, smartSubsample: true }).toFile(out);
  const b = statSync(file).size;
  const a = statSync(out).size;
  before += b;
  after += a;
  console.log(`${String(Math.round(b / 1024)).padStart(5)} KB -> ${String(Math.round(a / 1024)).padStart(4)} KB  ${relative(root, file).replaceAll("\\", "/")}`);
  if (remove && existsSync(out)) rmSync(file);
}
console.log(`\n${files.length} imagens: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB (${Math.round((1 - after / before) * 100)}% menor)`);
