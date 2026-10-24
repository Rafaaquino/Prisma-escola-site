import type { ReactNode } from "react";
import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import { asset } from "./lib/assets";

// CSS do template Ascent e do Font Awesome: os originais ficam em styles/ (e no node_modules) e `npm run build`
// (scripts/build-css.mjs) junta, limpa e minifica tudo em public/assets/css/site.min.css, um único arquivo.
export const links: LinksFunction = () => [
  { rel: "preload", href: asset("webfonts/jost-latin-wght-normal.woff2"), as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: asset("webfonts/nunito-latin-wght-normal.woff2"), as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: asset("webfonts/fa-solid-900.woff2"), as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, sizes: "48x48" },
  { rel: "icon", href: asset("img/favicon-96.png"), type: "image/png", sizes: "96x96" },
  { rel: "apple-touch-icon", href: asset("img/apple-touch-icon.png") },
  { rel: "stylesheet", href: asset("css/site.min.css") },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ed145b" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      <WhatsAppWidget />
    </>
  );
}
