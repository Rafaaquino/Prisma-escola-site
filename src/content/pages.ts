import raw from "./pages.json";

/**
 * Mapa de páginas do site. É a fonte única de rotas (`routes.ts`), menu, rodapé e sitemap.
 * Os `path` das páginas "wordpress" devem ser IDÊNTICOS aos do site antigo — scripts/check-urls.mjs confere.
 *
 * status: "ready" = página com conteúdo (entra no sitemap.xml) · "todo" = provisória, sem conteúdo (fica `noindex` e fora do sitemap)
 */
export interface PageEntry {
  path: string;
  title: string;
  /** Rótulo curto para menu, se diferente do título. */
  label?: string;
  status: "ready" | "todo";
}

export const pages: PageEntry[] = raw as PageEntry[];

/** Aceita "/historia" ou "/historia/" e devolve a entrada (ou undefined). */
export function findPage(pathname: string): PageEntry | undefined {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return pages.find((x) => x.path === p);
}
