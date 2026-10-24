import { isValidElement, type ReactNode } from "react";
import { NAV } from "../content/nav";
import { EMAIL, HOURS, SOCIAL, UNITS, WHATSAPP_MATRICULAS, type Unit } from "../content/site";
import { SITE_NAME, SITE_URL } from "./site";

/**
 * Dados estruturados (schema.org, JSON-LD) para o Google. Tudo sai das mesmas constantes que alimentam as páginas
 * (src/content/site.ts, nav.ts), então telefone, endereço e horário nunca divergem do que aparece na tela.
 * Só entra o que é verdadeiro e está visível no site: não há avaliações, preços nem nada inventado.
 */

export type JsonLd = Record<string, unknown>;

const abs = (path: string) => `${SITE_URL}${path}`;

export const ORG_ID = abs("/#escola");
export const WEBSITE_ID = abs("/#website");
const unitId = (u: Unit) => abs(`${u.path}#escola`);

/** Imagem padrão de compartilhamento (WhatsApp, Facebook, Google): scripts/make-og-image.mjs. */
export const OG_IMAGE = { url: abs("/assets/img/og-prisma-escola.jpg"), width: 1200, height: 630, alt: "Alunos da Prisma Escola no espaço de brincar" };

const LOGO = { "@type": "ImageObject", url: abs("/assets/img/logo/logo.webp"), width: 129, height: 129 };

const mapsUrl = (u: Unit) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${u.address}, ${u.short}, São Paulo, SP`)}`;

/** A escola (organização), com as duas unidades ligadas por @id. */
export function organizationLd(): JsonLd {
  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: abs("/"),
    description: "Escola de Educação Infantil e Ensino Fundamental I e II, com período integral, nas unidades Jd. Maracá e Jd. Lilah, em São Paulo.",
    foundingDate: "1989",
    logo: LOGO,
    image: abs("/assets/img/og-prisma-escola.jpg"),
    email: EMAIL,
    sameAs: [SOCIAL.facebook, SOCIAL.instagram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${WHATSAPP_MATRICULAS}`,
        email: EMAIL,
        areaServed: "BR",
        availableLanguage: "pt-BR",
        description: "WhatsApp de matrículas",
      },
    ],
    subOrganization: UNITS.map((u) => ({ "@id": unitId(u) })),
  };
}

/** Uma unidade (escola física): endereço, telefone e horário de atendimento. */
export function unitLd(u: Unit): JsonLd {
  return {
    "@type": "School",
    "@id": unitId(u),
    name: `${SITE_NAME} — ${u.name}`,
    url: abs(u.path),
    parentOrganization: { "@id": ORG_ID },
    telephone: u.tel,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: u.address,
      addressLocality: "São Paulo",
      addressRegion: "SP",
      ...(u.postalCode ? { postalCode: u.postalCode } : {}),
      addressCountry: "BR",
    },
    openingHoursSpecification: HOURS.map((h) => ({ "@type": "OpeningHoursSpecification", ...h.schema })),
    hasMap: mapsUrl(u),
    image: abs("/assets/img/og-prisma-escola.jpg"),
    sameAs: [SOCIAL.facebook, SOCIAL.instagram],
  };
}

export function websiteLd(): JsonLd {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: abs("/"), name: SITE_NAME, inLanguage: "pt-BR", publisher: { "@id": ORG_ID } };
}

/** Trilha de navegação, igual à que aparece no topo das páginas (Home › grupo do menu › página). */
export function breadcrumbLd(path: string, title: string): JsonLd | null {
  if (path === "/") return null;
  const parent = NAV.find((item) => item.children?.includes(path));
  const trail = [{ name: "Home", path: "/" }, ...(parent ? [{ name: parent.label, path: parent.path }] : []), { name: title, path }];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

/** Texto puro de um conteúdo React (os links e o negrito das respostas viram só texto). */
export function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeToText(node.props.children);
  return "";
}

/** FAQ com as mesmas perguntas e respostas exibidas na página. */
export function faqLd(items: { q: string; a: ReactNode }[]): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: nodeToText(i.a).replace(/\s+/g, " ").trim() },
    })),
  };
}
