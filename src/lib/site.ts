/** Dados globais do site. Em build de teste, defina VITE_SITE_URL para não apontar canonical para produção. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://www.prismaescola.com.br").replace(/\/$/, "");

export const SITE_NAME = "Prisma Escola";

/**
 * Trava de segurança: enquanto o site estiver em construção, todas as páginas saem com `noindex`
 * (evita o Google indexar a URL de teste do GitHub Pages). No lançamento, buildar com VITE_ALLOW_INDEXING=true.
 */
export const ALLOW_INDEXING = import.meta.env.VITE_ALLOW_INDEXING === "true";
