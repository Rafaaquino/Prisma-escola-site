import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { pages } from "./content/pages";

// Páginas que já têm módulo próprio; as demais usam a página provisória até serem construídas.
const CUSTOM: Record<string, string> = {
  "/": "routes/home.tsx",
  "/matriculas/": "routes/matriculas.tsx",
  "/contato/": "routes/contato.tsx",
  "/historia/": "routes/historia.tsx",
  "/vem-pra-prisma/": "routes/vem-pra-prisma.tsx",
  "/trabalhe-conosco/": "routes/trabalhe-conosco.tsx",
  "/video-aulas/": "routes/video-aulas.tsx",
  "/laboratorio-de-inteligencia-artificial/": "routes/laboratorio-ia.tsx",
  "/politica-de-privacidade/": "routes/politica-de-privacidade.tsx",
  "/infraestrutura/": "routes/infraestrutura.tsx",
  "/unidade-1-jd-maraca/": "routes/unidade.tsx",
  "/unidade-2-jd-lilah/": "routes/unidade.tsx",
  "/institucional/": "routes/hub.tsx",
  "/ensino/": "routes/hub.tsx",
  "/unidades/": "routes/hub.tsx",
  ...Object.fromEntries(
    [
      "/educacao-infantil/",
      "/ensino-fundamental-1/",
      "/ensino-fundamental-2/",
      "/integral-semi-integral/",
      "/extra-curriculares/",
      "/ingles/",
      "/pensamento-computacional/",
      "/missao-visao-valores/",
      "/diferenciais-da-escola-adventista/",
      "/area-dos-professores/",
      "/itagyba/",
      "/atividades/",
      "/proposta-pedagogica/",
    ].map((p) => [p, "routes/content-page.tsx"]),
  ),
};

const toSegment = (path: string) => path.replace(/^\/|\/$/g, "");

export default [
  layout("layouts/Site.tsx", [
    index(CUSTOM["/"]),
    // Os caminhos vêm de src/content/pages.json (mesmos slugs do WordPress, para não perder URLs no Google).
    ...pages
      .filter((p) => p.path !== "/")
      .map((p) => route(toSegment(p.path), CUSTOM[p.path] ?? "routes/placeholder.tsx", { id: `page${p.path.replace(/\//g, "-")}` })),
    // Rota curinga: qualquer URL que não exista cai aqui (sem ela, o React Router troca a página por um "404 Not Found" seco depois de carregar).
    // O prerender de "/404" (react-router.config.ts) vira build/client/404.html no postbuild, que é o que o GitHub Pages serve para URLs inexistentes.
    route("*", "routes/not-found.tsx", { id: "not-found" }),
  ]),
] satisfies RouteConfig;
