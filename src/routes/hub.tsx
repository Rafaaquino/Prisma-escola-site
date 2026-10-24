import type { MetaArgs } from "react-router";
import { Link, useLocation } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { StaySection } from "../components/StaySection";
import { findPage } from "../content/pages";
import { buildMeta } from "../lib/seo";
import { Img } from "../components/Img";

interface HubItem {
  to: string;
  title: string;
  text: string;
  icon: string;
}

/** Páginas-índice (eram só "contêineres" de menu no WordPress): cartões `program-item` do Ascent (service.php) com links para as páginas filhas. */
const HUBS: Record<string, { description: string; items: HubItem[] }> = {
  "/institucional/": {
    description: "Conheça a Prisma Escola: nossa história, missão, visão, valores e os diferenciais da educação adventista.",
    items: [
      { to: "/historia/", title: "História", text: "Fundada em 1989, a Prisma Escola cresceu ao lado das famílias e hoje é referência na região.", icon: "car-icons1.webp" },
      { to: "/missao-visao-valores/", title: "Missão, Visão e Valores", text: "Educação básica de qualidade, inspirada nos valores cristãos, para uma sociedade justa e fraterna.", icon: "car-icons2.webp" },
      { to: "/diferenciais-da-escola-adventista/", title: "Diferenciais da Escola Adventista", text: "O que faz da educação confessional um diferencial na formação dos alunos.", icon: "car-icons3.webp" },
    ],
  },
  "/ensino/": {
    description: "Educação Infantil, Ensino Fundamental I e II, período integral, extracurriculares, inglês e Mundo Computacional na Prisma Escola.",
    items: [
      { to: "/educacao-infantil/", title: "Educação Infantil", text: "Maternal, Jardim e Pré-escola, de 2 a 5 anos.", icon: "car-icons1.webp" },
      { to: "/ensino-fundamental-1/", title: "Ensino Fundamental I", text: "Anos iniciais: do 1º ao 5º ano.", icon: "car-icons2.webp" },
      { to: "/ensino-fundamental-2/", title: "Ensino Fundamental II", text: "Anos finais: do 6º ao 9º ano.", icon: "car-icons3.webp" },
      { to: "/integral-semi-integral/", title: "Integral e Semi-Integral", text: "Período estendido do maternal ao 2º ano.", icon: "car-icons4.webp" },
      { to: "/extra-curriculares/", title: "Extracurriculares", text: "Música, esporte e aprendizado de línguas.", icon: "car-icons5.webp" },
      { to: "/ingles/", title: "Inglês — English Stars", text: "Formação bilíngue da Educação Infantil aos Anos Finais.", icon: "car-icons6.webp" },
      { to: "/pensamento-computacional/", title: "Mundo Computacional", text: "Pensamento computacional, programação, robótica e IA.", icon: "car-icons1.webp" },
      { to: "/atividades/", title: "Atividades e eventos", text: "Capelas semanais, gincanas, olimpíadas e campeonatos.", icon: "car-icons2.webp" },
      { to: "/proposta-pedagogica/", title: "Proposta Pedagógica", text: "Cronogramas pedagógicos do Fundamental II por turma.", icon: "car-icons3.webp" },
      { to: "/video-aulas/", title: "Vídeo Aulas", text: "Aulas de matemática com o Professor Hammy Hwygem.", icon: "car-icons4.webp" },
    ],
  },
  "/unidades/": {
    description: "Conheça as duas unidades da Prisma Escola: Jd. Maracá e Jd. Lilah. Endereços, telefones, horários e visita virtual.",
    items: [
      { to: "/unidade-1-jd-maraca/", title: "Unidade 1 — Jd. Maracá", text: "Av. Atos Tomás Ferracciu, 25 · (11) 5873-7688", icon: "car-icons1.webp" },
      { to: "/unidade-2-jd-lilah/", title: "Unidade 2 — Jd. Lilah", text: "Rua Costa Nova do Prado, 375 · (11) 5870-9906", icon: "car-icons2.webp" },
    ],
  },
};

const pathOf = (pathname: string) => findPage(pathname)?.path ?? "/";

export function meta({ location }: MetaArgs) {
  const path = pathOf(location.pathname);
  return buildMeta({ title: findPage(path)?.title ?? "Prisma Escola", description: HUBS[path]?.description ?? "", path });
}

export default function Hub() {
  const path = pathOf(useLocation().pathname);
  const hub = HUBS[path];
  if (!hub) return null;
  return (
    <>
      <PageBanner title={findPage(path)?.title ?? ""} />
      <section className="program-sectionv1 overflow-hidden section-padding position-relative">
        <div className="container">
          <div className="row align-items-center g-4">
            {hub.items.map((item, i) => (
              <div key={item.to} className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay={`.${3 + (i % 4)}s`}>
                <div className="program-item gra-border">
                  <div className="icons gra-border round10 d-center">
                    <Img src={`aicon/${item.icon}`} alt="" />
                  </div>
                  <div className="content">
                    <h2 style={{ fontSize: "1.5rem" }}>
                      <Link to={item.to}>{item.title}</Link>
                    </h2>
                    <p>{item.text}</p>
                    <Link to={item.to} className="readmore d-flex align-items-center gap-2">
                      Saiba mais
                      <span className="arrows mt-1">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <StaySection />
    </>
  );
}
