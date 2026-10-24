import { Img } from "./Img";

/** Seção de depoimento do template (index.php e about.php). Texto: depoimento de ex-aluno do site atual. */
export function TestimonialSection({ compact }: { compact?: boolean }) {
  return (
    <section className={compact ? "testimonial-sectionv1 space-bottom overflow-hidden white-bg" : "testimonial-sectionv1 section-padding overflow-hidden white-bg"}>
      <div className="container">
        <div className="row g-2 justify-content-between mb-60">
          <div className="col-lg-4 col-md-5">
            <div className="section-title">
              <span className="sub-title wow fadeInUp p5-clr">Depoimentos</span>
              <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
                Quem passou pela Prisma conta como foi
              </h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">Histórias de quem fez parte da Família Prisma e levou o que aprendeu para a vida.</div>
        </div>
        <div className="testimonial-innerbox">
          <div className="row justify-content-end">
            <div className="col-lg-6 col-md-7 col-sm-8">
              <div className="swiper testimonial-slidewrap01">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testimonial-item01">
                      <div className="d-flex align-items-center justify-content-between gap-1">
                        <div className="man-info d-flex align-items-center">
                          <div className="thumb">
                            <Img src="atestimonial/testimonial-small.webp" alt="" />
                          </div>
                          <div className="cont">
                            <h4 className="black mb-1">Ex-aluno</h4>
                            <span className="black fw-normal">Gerente de Produtos</span>
                          </div>
                        </div>
                        <Img src="atestimonial/quote.webp" alt="" className="quote-testi" />
                      </div>
                      <p className="pra mt-24 mb-40">
                        “Hoje eu devo a minha formação à Escola Prisma. Excelência no ensino onde tive os melhores professores e aqui passei bons momentos da minha
                        infância.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
