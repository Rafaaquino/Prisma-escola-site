import { SEO_TITLES } from "../content/seo-titles";
import { breadcrumbLd, OG_IMAGE, type JsonLd } from "./jsonld";
import { ALLOW_INDEXING, SITE_NAME, SITE_URL } from "./site";

interface SeoInput {
  /** Título da página (sem o nome do site). */
  title: string;
  /** Até ~155 caracteres. */
  description: string;
  /** Caminho com barras nas duas pontas, ex.: "/matriculas/". */
  path: string;
  /** Força `noindex` (páginas provisórias), mesmo com a indexação liberada. */
  noindex?: boolean;
  /** Dados estruturados (schema.org) específicos da página. A trilha de navegação (BreadcrumbList) é adicionada sozinha. */
  jsonLd?: JsonLd[];
}

/**
 * Gera as tags de <head> de uma rota: title, description, canonical, Open Graph, Twitter, dados estruturados (JSON-LD)
 * e (se bloqueado) robots.
 */
export function buildMeta({ title, description, path, noindex, jsonLd = [] }: SeoInput) {
  const fullTitle = path === "/" ? title : `${SEO_TITLES[path] ?? title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const crumbs = breadcrumbLd(path, title);
  const graph = [...(crumbs ? [crumbs] : []), ...jsonLd];
  return [
    { title: fullTitle },
    { name: "description", content: description },
    ...(!ALLOW_INDEXING ? [{ name: "robots", content: "noindex, nofollow" }] : noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE.url },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: String(OG_IMAGE.width) },
    { property: "og:image:height", content: String(OG_IMAGE.height) },
    { property: "og:image:alt", content: OG_IMAGE.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE.url },
    ...(graph.length ? [{ "script:ld+json": { "@context": "https://schema.org", "@graph": graph } }] : []),
  ];
}
