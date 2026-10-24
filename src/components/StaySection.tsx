import { Link } from "react-router";
import { Img } from "./Img";

/** Faixa "Stay With Us" que fecha as páginas internas do Ascent (contact.php, service-details.php...). */
export function StaySection() {
  return (
    <section className="stay-section pt-50 pb-50 cmn-bg overflow-hidden position-relative">
      <div className="container">
        <div className="row justify-content-between align-items-center g-4">
          <div className="col-lg-5 col-md-6 col-sm-7">
            <div className="stay-content">
              <div className="section-title">
                <span className="sub-title wow fadeInUp black">Fique com a gente</span>
                <h3 className="m-title wow fadeInUp black mb-sm-3 mb-2" data-wow-delay=".3s">
                  O caminho do sucesso começa na educação
                </h3>
                <p className="mb-24 pra wow fadeInUp" data-wow-delay=".4s">
                  As matrículas 2027 já estão abertas. Venha conhecer a Prisma Escola e garanta a vaga do seu filho.
                </p>
                <Link to="/matriculas/" className="theme-btn round100 p2-bg py-3">
                  <span className="white fw-medium">Como matricular</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 me-xl-5 col-sm-5">
            <div className="stay-thumb w-100">
              <Img src="aservices/stay-thumb.webp" alt="" className="w-100" />
            </div>
          </div>
        </div>
      </div>
      {/* Element */}
      <Img src="aservices/stay-shape.webp" alt="" className="stay-element" />
    </section>
  );
}
