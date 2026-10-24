import { Link } from "react-router";
import { ContactForm } from "../components/ContactForm";
import { Counter } from "../components/Counter";
import { PageBanner } from "../components/PageBanner";
import { EMAIL, HOURS, UNITS } from "../content/site";
import { buildMeta } from "../lib/seo";
import { Img } from "../components/Img";

export function meta() {
  return buildMeta({
    title: "Contato",
    description: "Fale com a Prisma Escola: telefones, endereços e horários das unidades Jd. Maracá e Jd. Lilah, ou envie uma mensagem pelo site.",
    path: "/contato/",
  });
}

// Mapa incorporado sem chave de API. Cidade/UF assumidas pelo DDD 11 e pelos bairros — conferir com a escola.
const mapSrc = (address: string, bairro: string) => `https://www.google.com/maps?q=${encodeURIComponent(`${address}, ${bairro}, São Paulo, SP`)}&output=embed`;
const mapLink = (address: string, bairro: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${bairro}, São Paulo, SP`)}`;

export default function Contato() {
  return (
    <>
      <PageBanner title="Contato" />

      {/* Contact Info Start */}
      <section className="contact-infosectionv1 space-top overflow-hidden space-bottom">
        <div className="container">
          <div className="row g-lg-4 g-3 justify-content-center">
            {UNITS.map((u, i) => (
              <div key={u.id} className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay={`.${3 + i}s`}>
                <div className="contact-call-info">
                  <div className="icon d-center">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <h5 className="black">
                    <Link to={u.path}>{u.name}</Link>
                  </h5>
                  <a href={mapLink(u.address, u.short)} className="pra" target="_blank" rel="noopener noreferrer">
                    {u.address}
                  </a>
                  <br />
                  <a href={`tel:${u.tel}`} className="pra">
                    {u.phone}
                  </a>
                  {" · "}
                  <a href={u.whatsapp} className="pra" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
            <div className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".5s">
              <div className="contact-call-info">
                <div className="icon d-center">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h5 className="black">Horário de atendimento</h5>
                {HOURS.map((h) => (
                  <span key={h.days} className="pra d-block">
                    {h.days}: {h.time}
                  </span>
                ))}
                <a href={`mailto:${EMAIL}`} className="pra d-block">
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="google-map">
        <div className="row g-0">
          {UNITS.map((u) => (
            <div key={u.id} className="col-lg-6">
              <iframe
                src={mapSrc(u.address, u.short)}
                title={`Mapa — ${u.name}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Infov2 */}
      <section className="contact-sectionv02 section-padding">
        <div className="container">
          <div className="section-title text-center mb-60">
            <span className="sub-title wow fadeInUp p5-clr">Contato</span>
            <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
              Fale com a Prisma Escola
            </h3>
          </div>
          <div className="row g-4">
            <div className="col-lg-6 col-md-6">
              <div className="contact-thumbv02 position-relative">
                <div className="thumb-smal">
                  <Img src="contact/contact-s1.webp" alt="" />
                </div>
                <div className="thumbb">
                  <Img src="contact/contact-b1.webp" alt="" />
                </div>
                <div className="badg-count">
                  <Img src="contact/contact-badge.webp" alt="" />
                  <div className="cont">
                    <h4>
                      <Counter end={1200} />+
                    </h4>
                    <span className="subti">alunos na Família Prisma</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact-contentv2">
                <div className="write-comment">
                  <h4 className="black fw-semibold mb-24">Envie uma mensagem</h4>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Success Section Start */}
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
    </>
  );
}
