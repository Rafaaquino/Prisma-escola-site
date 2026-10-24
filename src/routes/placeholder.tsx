import type { MetaArgs } from "react-router";
import { useLocation } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { findPage } from "../content/pages";
import { buildMeta } from "../lib/seo";

export function meta({ location }: MetaArgs) {
  const page = findPage(location.pathname);
  return buildMeta({
    title: page?.title ?? "Página em construção",
    description: "Página em construção.",
    path: page?.path ?? "/",
    noindex: true, // página provisória: nunca deve ser indexada
  });
}

/** Página provisória: reserva a URL do site antigo até o conteúdo real ser migrado. */
export default function Placeholder() {
  const page = findPage(useLocation().pathname);
  return (
    <>
      <PageBanner title={page?.title ?? "Página"} />
      <section className="space-top space-bottom">
        <div className="container">
          <div className="section-title">
            <span className="sub-title p5-clr">Em construção</span>
            <h3 className="m-title black">Esta página está sendo preparada</h3>
            <p className="mt-3">
              Ela já existe no endereço <code>{page?.path}</code> (o mesmo do site antigo, para preservar o posicionamento no Google). O conteúdo será
              migrado nas próximas etapas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
