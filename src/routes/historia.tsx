import { Link } from "react-router";
import { Counter } from "../components/Counter";
import { PageBanner } from "../components/PageBanner";
import { ServiceDetails } from "../components/ServiceDetails";
import { StaySection } from "../components/StaySection";
import { TestimonialSection } from "../components/TestimonialSection";
import { buildMeta } from "../lib/seo";
import { Img } from "../components/Img";

export function meta() {
  return buildMeta({
    title: "História",
    description:
      "Fundada em 1989, a Prisma Escola é hoje a maior e mais conceituada escola da região, com mais de 1200 alunos em duas unidades: Jd. Maracá e Jd. Lilah.",
    path: "/historia/",
  });
}

// Layout do about.php do Ascent. Texto: página "História" do site atual (backup, 2023).
export default function Historia() {
  return (
    <>
      <PageBanner title="História" />

      {/* Aboutv1 Section Start */}
      <section className="about-sectionv1 space-top overflow-hidden space-bottom">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="about-one-thumbs">
                <div className="thumbs position-relative wow fadeInUp" data-wow-delay="1200">
                  <Img src="about/about-1.webp" alt="Alunos da Prisma Escola" className="round10 main-img" />
                  <div className="customer-satisfaction">
                    <div className="icon d-center">
                      <Img src="abanner/customer.webp" alt="" />
                    </div>
                    <div className="cont">
                      <h4 className="white">
                        <Counter end={1200} />+
                      </h4>
                      <p className="white">Alunos</p>
                    </div>
                  </div>
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
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="about-contentv1 ps-xxl-5">
                <div className="section-title mb-60">
                  <span className="sub-title wow fadeInUp p5-clr">Nossa história</span>
                  <h3 className="m-title wow fadeInUp black mb-sm-3 mb-2" data-wow-delay=".3s">
                    A história de sucesso da Prisma Escola
                  </h3>
                  <p className="mb-24 wow fadeInUp" data-wow-delay=".4s">
                    A Prisma Escola tem uma história rica, abençoada pela presença de Deus em todas as etapas. Fundada em 1989, já no mesmo ano conquistou a
                    liderança como a melhor escola infantil da região.
                  </p>
                  <p className="mb-24 wow fadeInUp" data-wow-delay=".4s">
                    Convidamos você a trazer seu filho para fazer parte da “Família Prisma”, onde, inspirados pelo amor do Grande Mestre Jesus, cuidamos desses
                    pequenos anjos com a mesma dedicação e carinho que vocês, pais, têm por eles. Isso é o que nos torna especiais!
                  </p>
                  <Link to="/contato/" className="theme-btn gra-border2">
                    <span className="black fw-medium">Venha nos conhecer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceDetails
        title="Marcos da nossa trajetória"
        paragraphs={[
          "Mesmo competindo com escolas centenárias, somos atualmente a maior e mais conceituada escola da região, com mais de 1200 alunos matriculados e instalações modernas e confortáveis em ambos os prédios.",
        ]}
        cards={[
          {
            icon: "aicon/car-icons1.webp",
            title: "1989: a fundação",
            text: "A Prisma Escola é fundada e, no mesmo ano, conquista a liderança como a melhor escola infantil da região.",
          },
          {
            icon: "aservices/sertd1.webp",
            title: "1993: sede própria e nova unidade",
            text: "Estabelece-se em sede própria na Av. Atos Tomás Ferracciu, 25, no Jd. Maracá, uma localização estratégica e privilegiada, e inaugura uma filial no Jd. Lilah.",
          },
          {
            icon: "aicon/car-icons5.webp",
            title: "1997: Ensino Fundamental",
            text: "Dá um passo importante ao implantar o Ensino Fundamental, com três salas de 1ª série.",
          },
        ]}
      />

      <TestimonialSection compact />
      <StaySection />
    </>
  );
}
