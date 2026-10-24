import { ALLOW_INDEXING } from "../lib/site";

/**
 * IDs de rastreamento. Os padrões foram MANTIDOS do site antigo (backup do WordPress, out/2026):
 *  - GA4: Site Kit (`G-59CDZVGZXN`).
 *  - Google Ads: tag do tema Porto (`AW-10993698813`) e o pixel antigo do plugin "Google Remarketing Codes" (`870398974`).
 *  - NÃO migrados: os dois Universal Analytics (`UA-86101914-1`, `UA-242749899-1`), encerrados pelo Google em 2023.
 *  - Meta Pixel: o backup não tem Pixel do Facebook; defina VITE_META_PIXEL_ID quando existir.
 * Qualquer item pode ser trocado/desligado por variável de ambiente (valor vazio desliga).
 */
export const GA4_ID: string = import.meta.env.VITE_GA4_ID ?? "G-59CDZVGZXN";
export const ADS_IDS: string[] = String(import.meta.env.VITE_ADS_IDS ?? "AW-10993698813,AW-870398974")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
export const META_PIXEL_ID: string = import.meta.env.VITE_META_PIXEL_ID ?? "";

/** Só liga no build de produção (evita contar visitas do ambiente de revisão) e se houver ao menos um ID. */
export const TRACKING_ENABLED = ALLOW_INDEXING && Boolean(GA4_ID || ADS_IDS.length || META_PIXEL_ID);
