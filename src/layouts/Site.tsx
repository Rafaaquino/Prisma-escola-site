import { Outlet, useLocation } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { CookieBanner } from "../components/CookieBanner";
import { Preloader } from "../components/Preloader";
import { useTracking, useWow } from "../lib/hooks";

export default function SiteLayout() {
  const { pathname } = useLocation();
  useWow();
  useTracking();

  return (
    <>
      <Preloader />
      <Header />
      <main id="conteudo">
        <Outlet />
      </main>
      {/* como no template: a home usa o rodapé claro (footer.php) e as demais páginas o escuro (footer-2.php) */}
      <Footer variant={pathname === "/" ? "light" : "dark"} />
      <CookieBanner />
    </>
  );
}
