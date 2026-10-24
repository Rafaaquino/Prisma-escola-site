import { Link } from "react-router";
import { DynamicForm, type FieldSpec } from "../components/DynamicForm";
import { PageBanner } from "../components/PageBanner";
import { StaySection } from "../components/StaySection";
import { YouTubeFacade } from "../components/YouTubeFacade";
import { EMAIL, UNITS } from "../content/site";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Vem Ser Prisma",
    description:
      "Faça seu cadastro e conheça a Prisma Escola: Educação Infantil e Ensino Fundamental nas unidades Jd. Maracá e Jd. Lilah. Matrículas 2027 abertas.",
    path: "/vem-pra-prisma/",
  });
}

// Página de captação do site atual (backup, 11/2025): vídeo, formulário de cadastro e contatos das unidades.
const FIELDS: FieldSpec[] = [
  { name: "nome", placeholder: "Nome do responsável *", required: true, icon: "fa-solid fa-user", autoComplete: "name" },
  { name: "email", placeholder: "E-mail *", type: "email", required: true, icon: "fa-solid fa-envelope", half: true, autoComplete: "email" },
  { name: "whatsapp", placeholder: "WhatsApp *", type: "tel", required: true, icon: "fa-brands fa-whatsapp", half: true, autoComplete: "tel" },
  { name: "unidades", type: "checkboxes", placeholder: "", legend: "Escolha sua unidade de preferência", options: UNITS.map((u) => u.name) },
];

export default function VemPraPrisma() {
  return (
    <>
      <PageBanner title="Vem Ser Prisma!" />

      <section className="contact-sectionv02 section-padding">
        <div className="container">
          <div className="section-title text-center mb-60">
            <span className="sub-title wow fadeInUp p5-clr">Faça seu cadastro</span>
            <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
              Venha ser Prisma: receba as informações sobre matrículas
            </h3>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 col-md-6">
              <YouTubeFacade id="Ji7onU6dXK0" title="Vídeo da Prisma Escola" />
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact-contentv2">
                <div className="write-comment">
                  <h4 className="black fw-semibold mb-24">Quero conhecer a Prisma</h4>
                  <DynamicForm
                    fields={FIELDS}
                    formName="vem-ser-prisma"
                    button="Enviar cadastro"
                    success="Cadastro enviado! Entraremos em contato em breve."
                    build={(v) => ({
                      subject: `Vem Ser Prisma — cadastro${v.unidades ? ` (${v.unidades})` : ""}`,
                      name: v.nome,
                      email: v.email,
                      phone: v.whatsapp,
                      unit: v.unidades,
                      message: `Cadastro pela página Vem Ser Prisma.\nUnidade(s) de preferência: ${v.unidades || "não informada"}.`,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-infosectionv1 overflow-hidden space-bottom">
        <div className="container">
          <div className="row g-lg-4 g-3 justify-content-center">
            {UNITS.map((u, i) => (
              <div key={u.id} className="col-lg-5 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay={`.${3 + i}s`}>
                <div className="contact-call-info">
                  <div className="icon d-center">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <h5 className="black">
                    <Link to={u.path}>{u.name}</Link>
                  </h5>
                  <span className="pra d-block">{u.address}</span>
                  <a href={`tel:${u.tel}`} className="pra d-block">
                    Tel: {u.phone}
                  </a>
                  <a href={`mailto:${EMAIL}`} className="pra d-block">
                    {EMAIL}
                  </a>
                  <a href={u.whatsapp} className="theme-btn p4-bg mt-3" target="_blank" rel="noopener noreferrer">
                    <span>
                      Chame no WhatsApp
                      <span className="visually-hidden"> (abre em nova aba)</span>
                    </span>
                  </a>
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
