import type { Config } from "@react-router/dev/config";

// Caminho-base: "/" em produção (domínio próprio). Para uma versão de revisão em usuario.github.io/repositorio/,
// buildar com BASE_PATH=/repositorio/ (e VITE_SITE_URL=https://usuario.github.io/repositorio).
const base = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

// Site 100% estático para o GitHub Pages: sem servidor em runtime, cada rota vira um .html no build.
export default {
  appDirectory: "src",
  basename: base,
  ssr: false,
  prerender: true,
  // "lazy" (padrão) busca /__manifest em runtime, endpoint que o GitHub Pages não tem.
  routeDiscovery: { mode: "initial" },
} satisfies Config;
