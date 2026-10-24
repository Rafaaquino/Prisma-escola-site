import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import { useLocation } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { ServiceDetails } from "../components/ServiceDetails";
import { StaySection } from "../components/StaySection";
import { EMAIL, HOURS, TOUR_URL, UNITS, type Unit } from "../content/site";
import { unitLd } from "../lib/jsonld";
import { buildMeta } from "../lib/seo";

// Estrutura de cada unidade: página "Infraestrutura" do site atual (backup, 2025).
const INFRA: Record<Unit["id"], string[]> = {
  maraca: [
    "14 salas de aula modernas",
    "Quadra poliesportiva coberta e iluminada",
    "Dois parquinhos com casinhas, castelinhos e escorregadores",
    "Pátio coberto de 200 m², com bebedouros de água filtrada",
    "Cantina saudável: sem frituras e com sucos naturais",
    "Banheiros masculinos e femininos em cada piso",
    "Espaço Maker: criativo e colaborativo, com tecnologias digitais e analógicas",
    "Material de Ciências sobre plantas, animais e o corpo humano",
  ],
  lilah: [
    "17 salas de aula e uma sala de descanso para os alunos integrais",
    "Quadra poliesportiva coberta e iluminada",
    "Área de recreação com brinquedos de playground",
    "Pátio de 300 m²",
    "Cantina saudável: sem frituras e com sucos naturais",
    "Biblioteca online com livros para a educação infantil e fundamental",
    "Espaço Maker: criatividade e projetos com tecnologias digitais e analógicas",
    "Material de Ciências e jardins para atividades de plantio",
  ],
};

// Fotos de cada unidade (recortadas em scripts/prep-infra-photos.mjs a partir do backup do site antigo). A unidade de cada
// foto segue o que o site antigo indicava: o nome do arquivo ou a página da unidade em que a escola a tinha colocado.
// A fachada só existe para a Lilah; a de Maracá ainda não tem foto.
const PHOTOS: Record<Unit["id"], { hero: string; heroAlt: string; middle: { src: string; alt: string }[]; details: string; detailsAlt: string }> = {
  maraca: {
    hero: "infra/maraca-topo.webp",
    heroAlt: "Alunos no espaço de brincar da Unidade Maracá",
    middle: [
      { src: "infra/maraca-quadra-meio.webp", alt: "Alunos na quadra poliesportiva coberta da Unidade Maracá" },
      { src: "infra/maraca-sala-meio.webp", alt: "Sala de aula da Educação Infantil na Unidade Maracá" },
      { src: "infra/maraca-informatica-meio.webp", alt: "Sala de informática da Unidade Maracá" },
    ],
    details: "infra/patio-coberto-maraca.webp",
    detailsAlt: "Pátio coberto da Unidade Maracá, com as bandeiras do Estado, do Brasil e da escola",
  },
  lilah: {
    hero: "infra/lilah-topo.webp",
    heroAlt: "Área de recreação com brinquedos de playground da Unidade Lilah",
    middle: [
      { src: "infra/lilah-sala-meio.webp", alt: "Sala de aula da Unidade Lilah" },
      { src: "infra/lilah-computadores-meio.webp", alt: "Computadores da sala de informática da Unidade Lilah" },
      { src: "infra/lilah-sala2-meio.webp", alt: "Alunos em sala de aula da Unidade Lilah" },
    ],
    details: "infra/fachada-lilah.webp",
    detailsAlt: "Fachada da Unidade Lilah",
  },
};

const unitFor = (pathname: string) => UNITS.find((u) => pathname.replace(/\/?$/, "/") === u.path);

// Mapa incorporado sem chave de API. Cidade/UF assumidas pelo DDD 11 e pelos bairros — conferir com a escola.
const place = (u: Unit) => `${u.address}, ${u.short}, São Paulo, SP`;

export function meta({ location }: MetaArgs) {
  const u = unitFor(location.pathname) ?? UNITS[0];
  return buildMeta({
    title: `${u.name} — ${u.short}`,
    description: `${u.name} da Prisma Escola: ${u.address}, telefone ${u.phone}. Educação Infantil e Ensino Fundamental. Agende sua visita.`,
    path: u.path,
    jsonLd: [unitLd(u)],
  });
}

export default function Unidade() {
  const u = unitFor(useLocation().pathname) ?? UNITS[0];
  const photos = PHOTOS[u.id];
  const hours: ReactNode = HOURS.map((h) => (
    <span key={h.days} className="d-block">
      {h.days}: {h.time}
    </span>
  ));

  return (
    <>
      <PageBanner title={`${u.name} — ${u.short}`} />
      <ServiceDetails
        heroImg={photos.hero}
        heroAlt={photos.heroAlt}
        title={`Venha conhecer a ${u.name}`}
        paragraphs={[
          `Visite a ${u.name} e conheça de perto a estrutura da Prisma Escola. Agende sua visita pelo telefone, pelo WhatsApp ou pelo e-mail.`,
        ]}
        middleImgs={photos.middle}
        cards={[
          {
            icon: "aicon/car-icons1.webp",
            title: "Endereço",
            text: (
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place(u))}`} target="_blank" rel="noopener noreferrer">
                {u.address}
              </a>
            ),
          },
          {
            icon: "aservices/sertd1.webp",
            title: "Telefone, WhatsApp e e-mail",
            text: (
              <>
                <a href={`tel:${u.tel}`}>{u.phone}</a> ·{" "}
                <a href={u.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                <br />
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </>
            ),
          },
          { icon: "aicon/car-icons5.webp", title: "Horário de atendimento", text: hours },
        ]}
        details={{
          title: "Infraestrutura da unidade",
          text: "Um ambiente seguro, moderno e enriquecedor para o desenvolvimento educacional e pessoal dos alunos.",
          list: INFRA[u.id],
          img: photos.details,
          imgAlt: photos.detailsAlt,
        }}
        after={
          <>
            <div className="text-center mt-5">
              <a href={TOUR_URL} className="theme-btn p4-bg" target="_blank" rel="noopener noreferrer">
                <span>
                  Visita virtual 360°
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </span>
              </a>
            </div>
            <div className="google-map mt-5">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(place(u))}&output=embed`}
                title={`Mapa — ${u.name}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </>
        }
      />
      <StaySection />
    </>
  );
}
