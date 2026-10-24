import { Link } from "react-router";
import { Counter } from "../components/Counter";
import { EmailForm } from "../components/EmailForm";
import { FaqAccordion, type FaqItem } from "../components/FaqAccordion";
import { PortfolioTabs, type GalleryTab } from "../components/PortfolioTabs";
import { ServiceSlider, type ServiceSlide } from "../components/ServiceSlider";
import { TestimonialSection } from "../components/TestimonialSection";
import { openWhatsAppForm } from "../components/WhatsAppWidget";
import { UNITS } from "../content/site";
import { faqLd, organizationLd, unitLd, websiteLd } from "../lib/jsonld";
import { buildMeta } from "../lib/seo";
import { Img } from "../components/Img";

export function meta() {
  return buildMeta({
    title: "Prisma Escola | Escola de Educação Infantil e Ensino Fundamental",
    description:
      "Prisma Escola: Educação Infantil, Ensino Fundamental I e II e período integral nas unidades Jd. Maracá e Jd. Lilah. Matrículas 2027 iniciadas.",
    path: "/",
    // organização, site, as duas unidades e o FAQ (as mesmas perguntas e respostas que aparecem na página)
    jsonLd: [organizationLd(), websiteLd(), ...UNITS.map(unitLd), faqLd(FAQ)],
  });
}

// ---- conteúdo (a estrutura/classes abaixo são as do index.php do Ascent; só os textos são da Prisma) ----

const PROGRAMS = [
  {
    icon: "car-icons1.webp",
    title: "Educação Infantil",
    text: "Maternal, Jardim e Pré-escola (2 a 5 anos): coordenação motora, oralidade, autonomia e convivência.",
    to: "/educacao-infantil/",
    delay: ".3s",
  },
  {
    icon: "car-icons2.webp",
    title: "Ensino Fundamental I",
    text: "Do 1º ao 5º ano: leitura, escrita, raciocínio lógico e o cuidado com a natureza e com o outro.",
    to: "/ensino-fundamental-1/",
    delay: ".4s",
  },
  {
    icon: "car-icons3.webp",
    title: "Ensino Fundamental II",
    text: "Do 6º ao 9º ano: uma fase de transição para formar jovens autoconfiantes, criativos e participativos.",
    to: "/ensino-fundamental-2/",
    delay: ".5s",
  },
  {
    icon: "car-icons4.webp",
    title: "Integral e Semi-Integral",
    text: "Do maternal ao 2º ano: um ambiente seguro durante o dia todo, ou parte dele, com almoço e descanso.",
    to: "/integral-semi-integral/",
    delay: ".6s",
  },
];

const INFRA = "/infraestrutura/";
// Galeria com fotos reais da escola (backup do site antigo; veja scripts/prep-infra-photos.mjs). Cada aba segue o formato do template
// (A = 5 fotos, B = 4, C = 2). A unidade só aparece na legenda quando o site antigo indicava de qual era a foto.
// Ainda SEM foto no backup, por isso fora desta galeria (continuam descritos em /infraestrutura/): cantina saudável, banheiros,
// Espaço Maker, material de Ciências, biblioteca online, sala de descanso e o pátio da Unidade Lilah. Quando a escola mandar as
// fotos, volte com as abas "Alimentação" e "Conforto" do template.
const TABS: GalleryTab[] = [
  {
    label: "Aprender",
    layout: "A",
    items: [
      { title: "Salas de aula", sub: "Mais de 30 salas amplas e modernas", to: INFRA, img: "infra/sala-professora-quadro.webp" },
      { title: "Sala de informática", sub: "Tecnologia na rotina dos alunos", to: INFRA, img: "infra/informatica-alunos.webp" },
      { title: "Livros e leitura", sub: "Gosto pela leitura desde cedo", to: INFRA, img: "infra/livros.webp" },
      { title: "Salas confortáveis", sub: "Espaço para cada turma", to: INFRA, img: "infra/sala-de-aula.webp" },
      { title: "Educação Infantil — Unidade Maracá", sub: "Salas pensadas para os pequenos", to: INFRA, img: "infra/sala-maternal-maraca.webp" },
    ],
  },
  {
    label: "Brincar",
    layout: "B",
    items: [
      { title: "Pátio — Unidade Maracá", sub: "200 m², 100% coberto", to: INFRA, img: "infra/patio-coberto-largo.webp" },
      { title: "Parquinho", sub: "Casinhas e escorregadores", to: INFRA, img: "infra/parquinho.webp" },
      { title: "Hora do recreio — Unidade Maracá", sub: "Diversão com segurança", to: INFRA, img: "infra/recreio-maraca.webp" },
      { title: "Espaço de brincar", sub: "Brinquedos para o lazer das crianças", to: INFRA, img: "infra/espaco-de-brincar-medio.webp" },
    ],
  },
  {
    label: "Esportes",
    layout: "C",
    items: [
      { title: "Quadra — Unidade Maracá", sub: "Quadra poliesportiva coberta", to: INFRA, img: "infra/quadra-maraca.webp" },
      { title: "Quadra poliesportiva", sub: "Coberta, iluminada e acessível", to: INFRA, img: "infra/quadra-alunos-medio.webp" },
    ],
  },
];

const SERVICES: ServiceSlide[] = [
  { title: "English Stars", text: "Formação bilíngue da Educação Infantil aos Anos Finais, com aulas totalmente em inglês.", to: "/ingles/" },
  { title: "Mundo Computacional", text: "Pensamento computacional, programação, robótica e inteligência artificial.", to: "/pensamento-computacional/" },
  { title: "Extracurriculares", text: "Música, esporte e línguas dentro da escola, com conforto e segurança.", to: "/extra-curriculares/" },
  { title: "Formação Humana", text: "Valores cristãos, respeito ao próximo e cuidado com a vida.", to: "/missao-visao-valores/" },
  { title: "Espaço Maker", text: "Um espaço criativo e colaborativo para aprender, inventar e resolver problemas.", to: "/infraestrutura/" },
  { title: "Período Integral", text: "Do maternal ao 2º ano, com almoço, descanso e atividades recreativas.", to: "/integral-semi-integral/" },
];

const FAQ: FaqItem[] = [
  {
    q: "Quais documentos são necessários para a matrícula?",
    a: (
      <p>
        1 foto 3x4 recente do aluno; certidão de nascimento; RG e CPF do aluno, do pai e da mãe; comprovante de endereço com CEP; convênio/SUS; carta de
        anuência e, para alunos vindos de outra escola, a declaração de transferência. <Link to="/matriculas/">Veja a lista completa</Link>.
      </p>
    ),
  },
  {
    q: "Quais são os horários de aula?",
    a: (
      <p>
        Educação Infantil: manhã das 7h30 às 11h30 e tarde das 13h às 17h. Fundamental I (1º ao 5º ano): manhã das 7h30 às 11h30 e tarde das 13h às 17h20.
        Fundamental II (6º ao 9º ano): manhã das 7h às 11h45 e tarde das 13h às 17h45. Às sextas, o período da tarde termina às 16h.
      </p>
    ),
  },
  {
    q: "A escola oferece período integral?",
    a: (
      <p>
        Sim. Do maternal ao 2º ano há a opção de período integral ou semi-integral, com almoço de cardápio variado, horário de descanso e atividades
        recreativas. <Link to="/integral-semi-integral/">Saiba mais</Link>.
      </p>
    ),
  },
  {
    q: "Como é o ensino de inglês?",
    a: (
      <p>
        A Prisma adota o programa English Stars, que vai da Educação Infantil até os Anos Finais do Ensino Fundamental, com aulas totalmente em inglês, abordagem
        CLIL e foco nas competências do século 21 da BNCC. <Link to="/ingles/">Conheça o English Stars</Link>.
      </p>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section Start */}
      <section className="banner-section banner-1 overflow-hidden">
        <div className="container">
          <div className="banner-wrapperv1 position-relative">
            <div className="row justify-content-lg-between justify-content-center">
              <div className="col-lg-3 col-md-4 col-sm-5 order-lg-0 order-1">
                <div className="banner-shape-thumb1">
                  <Img src="abanner/bn-v1-thumb1.webp" alt="" priority />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="banner-v1-content text-center">
                  <h1 className="wow fadeInDown" data-wow-delay=".6s">
                    <span className="title-explore position-relative wow fadeInRight d-inline-block" data-wow-delay=".4s">
                      <Img src="abanner/text-layer.webp" alt="" className="text-layer" />
                      Matrículas
                    </span>{" "}
                    2027{" "}
                    <span className="text-sount">iniciadas!</span>
                  </h1>
                  <p className="wow fadeInUp" data-wow-delay=".5s">
                    O futuro do seu filho começa aqui! Educação Infantil, Ensino Fundamental I e II, Ensino Integral, Inovação e Tecnologia.
                  </p>
                  {/* abre o questionário do WhatsApp; sem JavaScript, o link leva à página de contato */}
                  <Link
                    to="/contato/"
                    className="theme-btn p4-bg"
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsAppForm();
                    }}
                  >
                    <span>Fale conosco</span>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-5">
                <div className="banner-shape-thumb2">
                  <Img src="abanner/bn-v1-thumb2.webp" alt="" />
                </div>
              </div>
            </div>
            <Img src="abanner/railbow.webp" alt="" className="rainbow-shape" loading="eager" />
          </div>
        </div>
        {/* Element */}
        <Img src="abanner/left-ring.webp" alt="" className="left-ring" />
        <Img src="abanner/right-ring.webp" alt="" className="right-ring" />
        <Img src="abanner/upen-element.webp" alt="" className="global-upen" />
      </section>

      {/* Talk Counter Section Start */}
      <section className="talk-counter space-top overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8">
              <div className="talk-content">
                <div className="section-title mb-60">
                  <span className="sub-title wow fadeInUp p2-clr">Prisma em números</span>
                  <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                    Investir em educação <br />é investir no futuro
                  </h3>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Contamos com instalações projetadas para oferecer aos alunos bem-estar e segurança, com ambientes preparados para uma prática educativa que
                    tem como base a formação da autonomia moral e intelectual.
                  </p>
                  <Link to="/contato/" className="theme-btn gra-border2">
                    <span className="black fw-medium">Agende uma visita</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".3s">
              <div className="counter-inner">
                <div className="counter-talk-items gra-border round10 mb-30">
                  <div className="icon iconbg-v2">
                    <Img src="aicon/icon1.webp" alt="" />
                  </div>
                  <div className="content">
                    <h3>
                      <Counter end={1200} />+
                    </h3>
                    <p>Alunos</p>
                  </div>
                </div>
                <div className="counter-talk-items gra-border round10">
                  <div className="icon iconbg-v4">
                    <Img src="aicon/icon3.webp" alt="" />
                  </div>
                  <div className="content">
                    <h3>
                      <Counter end={35} />+
                    </h3>
                    <p>Anos de história</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".5s">
              <div className="counter-inner">
                <div className="counter-talk-items gra-border round10 mb-30">
                  <div className="icon iconbg-v3">
                    <Img src="aicon/icon2.webp" alt="" />
                  </div>
                  <div className="content">
                    <h3>
                      <Counter end={30} />+
                    </h3>
                    <p>Salas de aula</p>
                  </div>
                </div>
                <div className="counter-talk-items gra-border round10">
                  <div className="icon iconbg-v5">
                    <Img src="aicon/icon4.webp" alt="" />
                  </div>
                  <div className="content">
                    <h3>
                      <Counter end={2} />
                    </h3>
                    <p>Unidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Start */}
      <section className="about-sectionv1 space-top overflow-hidden space-bottom">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="about-one-thumbs">
                <div className="thumbs position-relative wow fadeInUp" data-wow-delay="1200">
                  <Img src="about/about-1.webp" alt="Alunos da Prisma Escola" className="round10 main-img" />
                  {/* Element */}
                  <Img src="about/lighing-cmn.webp" alt="" className="about-light1" />
                  <Img src="about/arrows-cmn.webp" alt="" className="about-arrows" />
                </div>
                <div className="about-one-grow">
                  <div className="academy-box text-center mb-30 wow fadeInUp" data-wow-delay="1400">
                    <Img src="about/grow.svg" alt="" />
                    <h4 className="black">Desde 1989</h4>
                    <p className="pra">Prisma Escola</p>
                  </div>
                  <div className="academy-box2 gra-border round10 wow fadeInUp" data-wow-delay="1600">
                    <div className="content">
                      <h3>
                        <Counter end={35} />+
                      </h3>
                      <p>anos de experiência</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 col-sm-6">
              <div className="about-contentv1 ps-xxl-5">
                <div className="section-title mb-60">
                  <span className="sub-title wow fadeInUp p5-clr">Nossa história</span>
                  <h3 className="m-title wow fadeInUp black mb-sm-3 mb-2" data-wow-delay=".3s">
                    Uma escola que cresce junto com a Família Prisma
                  </h3>
                  <p className="mb-24 wow fadeInUp" data-wow-delay=".4s">
                    Fundada em 1989, a Prisma Escola alcançou, no mesmo ano, a liderança como a melhor escola infantil da região. Hoje, com instalações
                    modernas em duas unidades, é a maior e mais conceituada escola da região, com mais de 1200 alunos matriculados.
                  </p>
                  <Link to="/historia/" className="theme-btn gra-border2">
                    <span className="black fw-medium">Conheça nossa história</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section Start */}
      <section className="program-sectionv1 overflow-hidden space-bottom position-relative">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center mb-60">
                <span className="sub-title wow fadeInUp p4-clr">Etapas de ensino</span>
                <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                  Uma base sólida para o sucesso, do maternal ao 9º ano
                </h3>
              </div>
            </div>
          </div>
          <div className="row align-items-center g-4">
            {PROGRAMS.map((p) => (
              <div key={p.to} className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay={p.delay}>
                <div className="program-item gra-border">
                  <div className="icons gra-border round10 d-center">
                    <Img src={`aicon/${p.icon}`} alt="" />
                  </div>
                  <div className="content">
                    <h4>
                      <Link to={p.to}>{p.title}</Link>
                    </h4>
                    <p>{p.text}</p>
                    <Link to={p.to} className="readmore d-flex align-items-center gap-2">
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
        <Img src="about/two-child.webp" alt="" className="program-child" />
      </section>

      {/* Portfolio Section Start */}
      <section className="protfolio-sectionv1 overflow-hidden space-bottom position-relative">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center mb-40">
                <span className="sub-title wow fadeInUp p5-clr">Conheça a Prisma</span>
                <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                  Infraestrutura pensada para o bem-estar dos alunos
                </h3>
              </div>
            </div>
          </div>
          <PortfolioTabs tabs={TABS} />
        </div>
      </section>

      {/* Service Section Start */}
      <section className="service-sectionv1 overflow-hidden position-relative">
        <div className="container">
          <div className="row g-2 justify-content-between align-items-center mb-xxl-4 mb-xl-3 mb-2">
            <div className="col-lg-4">
              <div className="section-title">
                <span className="sub-title wow fadeInUp p5-clr">Diferenciais</span>
                <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                  Mais do que sala de aula
                </h3>
              </div>
            </div>
            <div className="col-lg-6">
              <p className="pra">
                Inglês na grade curricular, tecnologia, esportes, música e muito mais para formar pessoas autônomas e críticas.
              </p>
            </div>
          </div>
          <div className="row g-3 justify-content-between">
            <div className="col-lg-3">
              <div className="service-left">
                <div className="dot-cmn mb-40"></div>
                <Link to="/extra-curriculares/" className="theme-btn p5-btn p5-border">
                  <span className="black fw-medium">Ver todos</span>
                  <i className="fa-solid fa-arrow-right p5-clr"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="d-center">
                <ServiceSlider slides={SERVICES} />
              </div>
            </div>
          </div>
        </div>
        {/* Element */}
        <Img src="aservices/sertd-shape.webp" alt="" className="aservice-shape1" />
      </section>

      {/* Faq Section Start */}
      <section className="faq-sectionv mt-60 overflow-hidden space-bottom">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 col-md-5">
              <div className="faq-thumbs">
                <Img src="about/faq.webp" alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-7">
              <div className="faq-content">
                <div className="section-title mb-40">
                  <span className="sub-title wow fadeInUp p5-clr">Dúvidas frequentes</span>
                  <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                    Tire suas dúvidas sobre matrículas e rotina escolar
                  </h3>
                </div>
                <FaqAccordion items={FAQ} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Section Start */}
      <section className="knowledge-section cmn-bg space-top overflow-hidden space-bottom position-relative">
        <div className="container">
          <div className="row justify-content-md-between justify-content-center align-items-center g-4">
            <div className="col-lg-5 col-md-5 col-sm-10">
              <div className="knowledge-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp p5-clr">Para cada fase</span>
                  <h3 className="m-title wow fadeInUp black mb-sm-3 mb-2" data-wow-delay=".3s">
                    Educação de qualidade em cada etapa da vida escolar
                  </h3>
                  <p className="mb-24 wow fadeInUp" data-wow-delay=".4s">
                    Do maternal ao 9º ano, acompanhamos cada aluno de perto, com professores graduados e em constante especialização.
                  </p>
                  <Link to="/ensino/" className="theme-btn p3-bg py-3">
                    <span className="white fw-medium">Conheça o ensino</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-7">
              <div className="knowledge-box-wrap">
                <div className="knowledge-inner d-grid gap-xxl-4 gap-xl-3 gap-2">
                  <div className="knowledge-big-item d-center p1-bg">
                    <h2 className="white">
                      2-5
                      <span className="d-block">anos</span>
                    </h2>
                  </div>
                  <div className="knowledge-item knowledge-left d-center p2-bg">
                    <div className="box">
                      <h3 className="white">
                        1º-5º
                        <span className="d-block">Fund. I</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="knowledge-inner d-grid gap-xxl-4 gap-xl-3 gap-2">
                  <div className="knowledge-item d-center p5-bg">
                    <div className="box">
                      <h3 className="white">
                        Maternal
                        <span className="d-block">Ed. Infantil</span>
                      </h3>
                    </div>
                  </div>
                  <div className="knowledge-item d-center p3-bg">
                    <div className="box">
                      <h3 className="white">
                        Jardim
                        <span className="d-block">Ed. Infantil</span>
                      </h3>
                    </div>
                  </div>
                  <div className="knowledge-item d-center p4-bg">
                    <div className="box">
                      <h3 className="white">
                        6º-9º
                        <span className="d-block">Fund. II</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="knowledge-inner d-grid gap-xxl-4 gap-xl-3 gap-2">
                  <div className="knowledge-item d-center p2-bg">
                    <div className="box">
                      <h3 className="white">
                        Pré
                        <span className="d-block">Ed. Infantil</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Element */}
        <Img src="about/knowledge-lshpe.webp" alt="" className="knowledge-shapeleft d-xl-block d-none" />
        <Img src="about/knowledge-animal.webp" alt="" className="knowledge-animal" />
      </section>

      {/* Testimonial Section Start */}
      <TestimonialSection />

      {/* Inspair Section Start */}
      <section className="inspair-section position-relative overflow-hidden">
        <div className="container">
          <div className="row flex-row-reverse g-4 align-items-end justify-content-between">
            <div className="col-lg-5 col-md-6 col-sm-7">
              <div className="inspair-content">
                <div className="section-title mb-40">
                  <span className="sub-title wow fadeInUp black">Fale conosco</span>
                  <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                    Venha conhecer a Prisma e garanta a vaga do seu filho
                  </h3>
                </div>
                <EmailForm kind="inspair" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-5">
              <div className="inspainr-thumb-box">
                <div className="inspair-thumb">
                  <Img src="ainspair/inspair-thumb.webp" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
