// Gera a logo do site a partir da imagem original (PNG, fundo branco, sem transparência).
//
//   public/assets/img/logo/logo.webp        256x256, recortada justa no círculo, com fundo transparente
//                                           (cabeçalho, rodapé, preloader, dados estruturados e imagem de compartilhamento)
//   public/assets/img/apple-touch-icon.png  180x180, círculo sobre fundo branco (o iOS não aceita transparência)
//
// Depois rode `node scripts/make-brand-images.mjs`, que refaz os favicons e a imagem de compartilhamento a partir da logo nova.
//
// Uso: node scripts/make-logo.mjs [logo-original.png]
// (padrão: ../referencias/logo-prisma-original.png, fora do repositório)
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const src = process.argv[2] ?? join(root, "..", "referencias", "logo-prisma-original.png");
const imgDir = join(root, "public", "assets", "img");

// 1) acha o círculo: a caixa de tudo que não é branco (o original tem uma margem branca irregular em volta)
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
let minX = W, maxX = -1, minY = H, maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) {
  console.error("Não achei nenhum conteúdo na imagem (ela é toda branca?).");
  process.exit(1);
}
const d = Math.max(maxX - minX, maxY - minY) + 1; // diâmetro do círculo
const side = d + 2; // 1 px de folga em cada lado
const left = Math.max(0, Math.round((minX + maxX + 1) / 2 - side / 2));
const top = Math.max(0, Math.round((minY + maxY + 1) / 2 - side / 2));
const size = Math.min(side, W - left, H - top);
console.log(`original ${W}x${H}; círculo de ${d}px em (${minX},${minY}); recorte ${size}x${size}`);

// 2) recorta e aplica a máscara circular (o que fica fora do aro vira transparente; -0,5 px tira o fio claro do suavizado da borda)
const cropped = await sharp(src).removeAlpha().extract({ left, top, width: size, height: size }).toBuffer();
const mask = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${d / 2 - 0.5}" fill="#fff"/></svg>`);
const circular = await sharp(cropped).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

// 3) logo do site
const logo = await sharp(circular).resize(256, 256, { kernel: "lanczos3" }).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer();
writeFileSync(join(imgDir, "logo", "logo.webp"), logo);
console.log(`logo/logo.webp  256x256  ${Math.round(logo.length / 1024)} KB`);

// 4) ícone do iOS: círculo (87% da largura) sobre fundo branco
const inner = await sharp(circular).resize(156, 156, { kernel: "lanczos3" }).toBuffer();
const touch = await sharp({ create: { width: 180, height: 180, channels: 3, background: "#ffffff" } })
  .composite([{ input: inner, left: 12, top: 12 }])
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(join(imgDir, "apple-touch-icon.png"), touch);
console.log(`apple-touch-icon.png  180x180  ${Math.round(touch.length / 1024)} KB`);
