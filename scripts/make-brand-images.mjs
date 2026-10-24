// Gera a imagem de compartilhamento (WhatsApp, Facebook, Google) e os ícones de favicon a partir da foto e do logo da escola.
//
//   public/assets/img/og-prisma-escola.jpg   1200x630: foto dos alunos + logo (aparece quando o link do site é compartilhado)
//   public/assets/img/favicon-96.png         ícone 96x96 (o Google pede favicon em múltiplos de 48 px)
//   public/favicon.ico                       48x48 + 96x96 (navegadores e o Google pedem /favicon.ico por padrão)
//
// Uso: node scripts/make-brand-images.mjs [pasta-dos-originais]
// (padrão: ../referencias/fotos-infraestrutura-originais, onde está a foto 5382_Escola-prisma_0049.jpg)
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const originals = process.argv[2] ?? join(root, "..", "referencias", "fotos-infraestrutura-originais");
const logoFile = join(root, "public", "assets", "img", "logo", "logo.webp");

// ---- imagem de compartilhamento
const photo = readdirSync(originals).find((f) => f.startsWith("5382_"));
if (!photo) {
  console.error(`Foto 5382_* não encontrada em ${originals}`);
  process.exit(1);
}
const W = 1200;
const H = 630;
const oriented = await sharp(join(originals, photo)).rotate().toBuffer({ resolveWithObject: true });
const { width: sw, height: sh } = oriented.info;
const ch = Math.round(sw / (W / H)); // altura do recorte com a proporção 1200x630
const top = Math.min(Math.max(Math.round(0.5 * sh - ch / 2), 0), sh - ch);
const badge = 176;
const logo = await sharp(logoFile).resize(badge - 28, badge - 28).toBuffer();
const circle = Buffer.from(`<svg width="${badge}" height="${badge}" xmlns="http://www.w3.org/2000/svg"><circle cx="${badge / 2}" cy="${badge / 2}" r="${badge / 2}" fill="#fff"/></svg>`);
const og = await sharp(oriented.data)
  .extract({ left: 0, top, width: sw, height: ch })
  .resize(W, H)
  .composite([
    { input: circle, left: 40, top: H - badge - 40 },
    { input: logo, left: 40 + 14, top: H - badge - 40 + 14 },
  ])
  .jpeg({ quality: 80, mozjpeg: true })
  .toBuffer();
writeFileSync(join(root, "public", "assets", "img", "og-prisma-escola.jpg"), og);
console.log(`og-prisma-escola.jpg  ${W}x${H}  ${Math.round(og.length / 1024)} KB`);

// ---- favicons (PNG 48 e 96 a partir do logo, que tem fundo transparente)
const png = (size) => sharp(logoFile).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const [p48, p96] = [await png(48), await png(96)];
writeFileSync(join(root, "public", "assets", "img", "favicon-96.png"), p96);

// .ico com imagens PNG dentro (formato aceito por todos os navegadores atuais)
const images = [
  { size: 48, data: p48 },
  { size: 96, data: p96 },
];
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // tipo: ícone
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map(({ size, data }) => {
  const e = Buffer.alloc(16);
  e[0] = size;
  e[1] = size;
  e.writeUInt16LE(1, 4); // planos
  e.writeUInt16LE(32, 6); // bits por pixel
  e.writeUInt32LE(data.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += data.length;
  return e;
});
writeFileSync(join(root, "public", "favicon.ico"), Buffer.concat([header, ...entries, ...images.map((i) => i.data)]));
console.log(`favicon-96.png ${Math.round(p96.length / 1024)} KB, favicon.ico ${Math.round(offset / 1024)} KB`);
