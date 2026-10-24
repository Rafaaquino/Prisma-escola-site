import type { ImgHTMLAttributes } from "react";
import sizes from "../content/image-sizes.json";
import { asset } from "../lib/assets";

const SIZES: Record<string, number[] | undefined> = sizes;

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Caminho dentro de public/assets/img (ex.: "about/about-1.webp"). */
  src: string;
  /** Imagem que aparece na primeira tela (ou é a maior dela): carrega já, com prioridade. As demais só carregam quando chegam perto da tela. */
  priority?: boolean;
}

/**
 * `<img>` das imagens do template. Põe width/height reais (o navegador reserva o espaço e a página não "pula"
 * quando a imagem chega) e carrega as imagens fora da primeira tela só quando necessário.
 * O visual não muda: o CSS do template continua mandando no tamanho (veja `:where(img[width][height])` em prisma-overrides.css).
 */
export function Img({ src, priority, alt = "", ...rest }: ImgProps) {
  const size = SIZES[src];
  return (
    <img
      src={asset(`img/${src}`)}
      alt={alt}
      width={size?.[0]}
      height={size?.[1]}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
