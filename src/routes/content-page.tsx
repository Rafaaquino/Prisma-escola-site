import type { MetaArgs } from "react-router";
import { useLocation } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { ServiceDetails } from "../components/ServiceDetails";
import { StaySection } from "../components/StaySection";
import { CONTENT_PAGES } from "../content/ensino";
import { findPage } from "../content/pages";
import { buildMeta } from "../lib/seo";

/** Páginas de conteúdo no layout service-details do Ascent; os dados ficam em src/content/ensino.tsx. */
export function meta({ location }: MetaArgs) {
  const path = findPage(location.pathname)?.path ?? "/";
  const data = CONTENT_PAGES[path];
  return buildMeta({ title: data?.title ?? "Página", description: data?.description ?? "", path });
}

export default function ContentPage() {
  const path = findPage(useLocation().pathname)?.path ?? "/";
  const data = CONTENT_PAGES[path];
  if (!data) return null;
  return (
    <>
      <PageBanner title={data.title} />
      <ServiceDetails {...data.details} />
      <StaySection />
    </>
  );
}
