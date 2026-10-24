// Gera src/content/image-sizes.json: largura x altura de cada imagem de public/assets/img.
// O componente <Img> usa isso para pôr width/height no HTML, de modo que o navegador reserva o espaço antes
// de a imagem chegar (sem "pulos" de layout) e pode carregar só quando ela estiver perto de aparecer.
// Roda sozinho antes de `npm run dev` e `npm run build`.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const imgDir = join(root, "public", "assets", "img");

const sizes = {};
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(webp|png|jpe?g)$/i.test(name)) files.push(p);
  }
})(imgDir);

for (const file of files) {
  const { width, height } = await sharp(file).metadata();
  sizes[relative(imgDir, file).replaceAll("\\", "/")] = [width, height];
}

// uma imagem por linha (JSON.stringify com indentação quebraria cada [largura, altura] em 4 linhas)
const body = Object.entries(sizes).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
writeFileSync(join(root, "src", "content", "image-sizes.json"), `{\n${body.join(",\n")}\n}\n`);
console.log(`image-sizes: ${files.length} imagens`);
