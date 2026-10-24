// Gera as fotos da página Infraestrutura (public/assets/img/infra/*.webp) a partir dos originais do backup do WordPress.
//
// Cada foto é recortada na PROPORÇÃO do espaço que ocupa no template (para o layout do Ascent não mudar) e
// exportada em WebP. `focus` é o ponto da foto que deve ficar dentro do recorte (0 a 1, x e y).
//
// Uso: node scripts/prep-infra-photos.mjs <pasta-com-os-originais>
// Os originais foram extraídos do .wpress com tools/ (arquivos "<ID do anexo>_<nome>"; o ID é o do WordPress).
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Uso: node scripts/prep-infra-photos.mjs <pasta-com-os-originais>");
  process.exit(1);
}
const out = fileURLToPath(new URL("../public/assets/img/infra/", import.meta.url));
mkdirSync(out, { recursive: true });

// proporção (largura/altura) e largura máxima de saída de cada espaço do template
const SLOT = {
  hero: { ratio: 1290 / 567, w: 1600 }, // topo da página de detalhes
  detail: { ratio: 1.6, w: 960 }, // foto ao lado da lista de cada unidade
  tall: { ratio: 410 / 602, w: 820 }, // galeria: item alto (layout A)
  wide: { ratio: 520 / 277, w: 1040 }, // galeria: item largo
  square: { ratio: 300 / 277, w: 600 }, // galeria: item quase quadrado
  mid: { ratio: 410 / 295, w: 820 }, // galeria: item médio
  middle: { ratio: 410 / 242, w: 820 }, // três fotos lado a lado nas páginas das unidades
};

// [arquivo de saída, ID do anexo no WordPress, espaço, ponto de foco [x, y]]
const PHOTOS = [
  ["quadra-coberta-topo", 5134, "hero", [0.5, 0.4]], // WIL_1010
  ["patio-coberto-maraca", 4549, "detail", [0.5, 0.5]], // patio-unidade-maraca
  ["fachada-lilah", 5101, "detail", [0.5, 0.42]], // frente-lilah-copiar
  // galeria: salas de aula
  ["sala-professora-quadro", 4399, "tall", [0.62, 0.5]], // Prisma_0098
  ["sala-ampla", 4400, "wide", [0.5, 0.55]], // Prisma_0101
  ["sala-dos-professores", 4541, "square", [0.5, 0.5]], // sala-prof-prisma-unidade-maraca
  ["sala-de-aula", 4396, "mid", [0.5, 0.5]], // Prisma_0091
  ["sala-maternal-maraca", 4540, "mid", [0.5, 0.5]], // sala-prisma-unidade-maraca
  // galeria: esporte e lazer
  ["espaco-de-brincar", 5382, "tall", [0.62, 0.5]], // Escola-prisma_0049
  ["quadra-alunos", 5376, "wide", [0.5, 0.55]], // cdf9716d-...
  ["parquinho", 4404, "square", [0.5, 0.5]], // Prisma_0126
  ["quadra-vazia", 4545, "mid", [0.5, 0.5]], // colegio-prisma-quadra-vazia
  ["recreio-maraca", 4548, "mid", [0.5, 0.4]], // kids-prisma-unidade-maraca
  // galeria: tecnologia e leitura
  ["informatica-alunos", 5380, "wide", [0.5, 0.5]], // Escola-prisma_0067
  ["livros", 4391, "square", [0.5, 0.35]], // Prisma_0006
  ["computadores", 4392, "mid", [0.5, 0.5]], // Prisma_0016
  ["informatica-maraca", 4547, "mid", [0.5, 0.55]], // informatica-prisma-unidade-maraca

  // Páginas das unidades. A unidade de cada foto segue o site antigo: o nome do arquivo ("...-unidade-maraca") ou a página
  // da unidade em que a escola a tinha colocado (Maracá: 4544, 4547, 4540, 5382; Lilah: 4495, 4401, 4392, 4397, e a fachada).
  ["maraca-topo", 5382, "hero", [0.62, 0.5]], // Escola-prisma_0049
  ["maraca-quadra-meio", 4544, "middle", [0.5, 0.5]], // colegio-prisma-quadra
  ["maraca-sala-meio", 4540, "middle", [0.5, 0.5]], // sala-prisma-unidade-maraca
  ["maraca-informatica-meio", 4547, "middle", [0.5, 0.55]], // informatica-prisma-unidade-maraca
  ["lilah-topo", 4495, "hero", [0.5, 0.55]], // Prisma_0125
  ["lilah-sala-meio", 4401, "middle", [0.5, 0.5]], // Prisma_0108
  ["lilah-computadores-meio", 4392, "middle", [0.5, 0.5]], // Prisma_0016
  ["lilah-sala2-meio", 4397, "middle", [0.5, 0.5]], // Prisma_0095

  // Galeria da home: formatos que a galeria pede e que ainda não existiam
  ["patio-coberto-largo", 4549, "wide", [0.5, 0.5]], // patio-unidade-maraca
  ["espaco-de-brincar-medio", 5382, "mid", [0.62, 0.55]], // Escola-prisma_0049
  ["quadra-maraca", 4544, "mid", [0.5, 0.5]], // colegio-prisma-quadra
  ["quadra-alunos-medio", 5376, "mid", [0.5, 0.55]], // cdf9716d-...
];

const files = readdirSync(src);
let total = 0;
for (const [name, id, slot, [fx, fy]] of PHOTOS) {
  const file = files.find((f) => f.startsWith(`${id}_`));
  if (!file) {
    console.error(`FALTA o original do anexo ${id} (${name}) em ${src}`);
    process.exit(1);
  }
  const { ratio, w: maxW } = SLOT[slot];
  const oriented = await sharp(join(src, file)).rotate().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = oriented.info;
  // janela de recorte com a proporção do espaço, o maior possível, centrada no ponto de foco
  let cw = W;
  let ch = Math.round(W / ratio);
  if (ch > H) {
    ch = H;
    cw = Math.round(H * ratio);
  }
  const left = Math.min(Math.max(Math.round(fx * W - cw / 2), 0), W - cw);
  const top = Math.min(Math.max(Math.round(fy * H - ch / 2), 0), H - ch);
  const outW = Math.min(maxW, cw); // nunca amplia
  const outH = Math.round(outW / ratio);
  const dest = join(out, `${name}.webp`);
  const info = await sharp(oriented.data)
    .extract({ left, top, width: cw, height: ch })
    .resize(outW, outH)
    .webp({ quality: slot === "hero" ? 74 : 80, effort: 6, smartSubsample: true })
    .toFile(dest);
  total += info.size;
  console.log(`${name.padEnd(26)} ${String(outW).padStart(4)}x${String(outH).padEnd(4)} ${String(Math.round(info.size / 1024)).padStart(4)} KB   (de ${W}x${H}, ${slot})`);
}
console.log(`\n${PHOTOS.length} fotos, ${Math.round(total / 1024)} KB no total`);
if (!existsSync(out)) process.exit(1);
