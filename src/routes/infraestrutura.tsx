import type { ReactNode } from "react";
import { PageBanner } from "../components/PageBanner";
import { PortfolioTabs, type GalleryTab } from "../components/PortfolioTabs";
import { ServiceDetails } from "../components/ServiceDetails";
import { StaySection } from "../components/StaySection";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Infraestrutura",
    description:
      "Infraestrutura da Prisma Escola: salas modernas, quadra coberta, parquinhos, pátio coberto, cantina saudável e Espaço Maker nas unidades Maracá e Lilah.",
    path: "/infraestrutura/",
  });
}

const item = (title: string, text: string): ReactNode => (
  <>
    <strong>{title}:</strong> {text}
  </>
);

// Texto da página "Infraestrutura" do site atual (backup, 2023).
const MARACA: ReactNode[] = [
  item("Salas de aula modernas", "temos 14 salas de aula modernas, que proporcionam um ambiente propício para o aprendizado."),
  item("Quadra poliesportiva", "nossa quadra é coberta, iluminada e acessível, permitindo que as atividades esportivas sejam praticadas com segurança e conforto."),
  item("Parquinho", "dois parquinhos equipados com casinhas, castelinhos, escorregadores e muito mais para o lazer das crianças."),
  item("Pátio coberto", "nosso amplo pátio de 200 m² é 100% coberto, com proteção contra as condições climáticas, bebedouros de água filtrada e total segurança."),
  item("Cantina saudável", "alimentos saudáveis, sucos naturais e uma variedade de opções livres de frituras, que promovem hábitos alimentares equilibrados."),
  item("Banheiros higienizados", "masculinos e femininos em cada piso da escola, sempre limpos e higienizados."),
  item("Espaço Maker", "um ambiente criativo e colaborativo onde os estudantes podem aprender, inventar, compartilhar e resolver problemas usando tecnologias digitais e analógicas."),
  item("Material de Ciências", "um acervo rico sobre plantas, animais e o corpo humano, que estimula a curiosidade científica dos alunos."),
];

const LILAH: ReactNode[] = [
  item("Salas de aula confortáveis", "17 salas de aula, além de uma Sala de Descanso para os alunos integrais, onde podem relaxar e recarregar suas energias."),
  item("Quadra poliesportiva coberta", "coberta, iluminada e acessível, um espaço perfeito para atividades esportivas."),
  item("Parquinho divertido", "uma área de recreação com brinquedos de playground, onde as crianças se divertem com segurança."),
  item("Pátio espaçoso", "com 300 m², os alunos têm espaço de sobra para brincar e socializar."),
  item("Cantina saudável", "alimentos saudáveis, sucos naturais e opções livres de frituras, que promovem escolhas alimentares equilibradas."),
  item("Banheiros adequados", "masculinos e femininos, bem cuidados e higienizados."),
  item("Biblioteca online", "um acervo online de livros, especialmente selecionados para a educação infantil e fundamental, que incentiva o gosto pela leitura desde cedo."),
  item("Espaço Maker", "onde os estudantes exploram a criatividade e colaboram em projetos com tecnologias digitais e analógicas."),
  item("Material de Ciências e jardins", "um acervo rico sobre plantas, animais e o corpo humano, além de jardins para atividades de plantio e aprendizado ao ar livre."),
];

// Fotos reais das unidades, vindas do backup do site antigo (recortadas por scripts/prep-infra-photos.mjs).
// As legendas só repetem o que a página já informa; a unidade só aparece quando o nome do arquivo original a indicava.
const GALLERY: GalleryTab[] = [
  {
    label: "Salas de aula",
    layout: "A",
    items: [
      { title: "Salas de aula", sub: "Ambiente propício para o aprendizado", img: "infra/sala-professora-quadro.webp" },
      { title: "Salas modernas", sub: "Mais de 30 salas nas duas unidades", img: "infra/sala-ampla.webp" },
      { title: "Sala dos professores", sub: "Unidade Maracá", img: "infra/sala-dos-professores.webp" },
      { title: "Salas confortáveis", sub: "Espaço para cada turma", img: "infra/sala-de-aula.webp" },
      { title: "Educação Infantil", sub: "Sala da Unidade Maracá", img: "infra/sala-maternal-maraca.webp" },
    ],
  },
  {
    label: "Esporte e lazer",
    layout: "A",
    items: [
      { title: "Espaço de brincar", sub: "Brinquedos para o lazer das crianças", img: "infra/espaco-de-brincar.webp" },
      { title: "Quadra poliesportiva", sub: "Coberta, iluminada e acessível", img: "infra/quadra-alunos.webp" },
      { title: "Parquinho", sub: "Casinhas e escorregadores", img: "infra/parquinho.webp" },
      { title: "Quadra coberta", sub: "Segurança e conforto para o esporte", img: "infra/quadra-vazia.webp" },
      { title: "Hora do recreio", sub: "Diversão com segurança", img: "infra/recreio-maraca.webp" },
    ],
  },
  {
    label: "Tecnologia e leitura",
    layout: "B",
    items: [
      { title: "Sala de informática", sub: "Tecnologia na rotina dos alunos", img: "infra/informatica-alunos.webp" },
      { title: "Livros e leitura", sub: "Gosto pela leitura desde cedo", img: "infra/livros.webp" },
      { title: "Computadores", sub: "Equipamentos para as aulas", img: "infra/computadores.webp" },
      { title: "Informática", sub: "Unidade Maracá", img: "infra/informatica-maraca.webp" },
    ],
  },
];

export default function Infraestrutura() {
  return (
    <>
      <PageBanner title="Infraestrutura" />
      <ServiceDetails
        heroImg="infra/quadra-coberta-topo.webp"
        heroAlt="Quadra poliesportiva coberta da Prisma Escola"
        title="Estrutura da Prisma Escola: preparada para o seu filho"
        paragraphs={[
          "Na Prisma Escola, proporcionamos um ambiente seguro, moderno e enriquecedor para o desenvolvimento educacional e pessoal dos alunos. Estamos comprometidos em criar a melhor experiência de aprendizado para eles.",
        ]}
        cards={[
          {
            icon: "aicon/car-icons1.webp",
            title: "Salas de aula",
            text: "14 salas na Unidade Maracá e 17 na Unidade Lilah, mais de 30 ao todo, amplas, modernas e confortáveis.",
          },
          {
            icon: "aservices/sertd1.webp",
            title: "Esporte e lazer",
            text: "Em cada unidade, quadra poliesportiva coberta, parquinho e pátio coberto, com total segurança.",
          },
          {
            icon: "aicon/car-icons5.webp",
            title: "Criatividade e ciência",
            text: "Espaço Maker e um acervo de Ciências sobre plantas, animais e o corpo humano.",
          },
        ]}
        details={{
          title: "Unidade Maracá",
          text: "Av. Atos Tomás Ferracciú, 25 — Jd. Maracá.",
          list: MARACA,
          img: "infra/patio-coberto-maraca.webp",
          imgAlt: "Pátio coberto da Unidade Maracá, com as bandeiras do Estado, do Brasil e da escola",
        }}
      />
      <ServiceDetails
        title="Unidade Lilah"
        paragraphs={["Rua Costa Nova do Prado, 375 — Jd. Lilah. Infraestrutura preparada para o sucesso dos alunos."]}
        details={{
          title: "O que a unidade oferece",
          list: LILAH,
          img: "infra/fachada-lilah.webp",
          imgAlt: "Fachada da Unidade Lilah",
        }}
      />
      <section className="protfolio-sectionv1 overflow-hidden space-bottom position-relative">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center mb-40">
                <span className="sub-title wow fadeInUp p5-clr">Conheça a Prisma</span>
                <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                  Veja de perto a nossa estrutura
                </h3>
              </div>
            </div>
          </div>
          <PortfolioTabs tabs={GALLERY} />
        </div>
      </section>
      <StaySection />
    </>
  );
}
