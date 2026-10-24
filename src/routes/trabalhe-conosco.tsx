import { DynamicForm, type FieldSpec } from "../components/DynamicForm";
import { PageBanner } from "../components/PageBanner";
import { StaySection } from "../components/StaySection";
import { EMAIL } from "../content/site";
import { buildMeta } from "../lib/seo";
import { Img } from "../components/Img";

export function meta() {
  return buildMeta({
    title: "Trabalhe Conosco",
    description: "Trabalhe na Prisma Escola: deixe seu currículo para futuras oportunidades nas unidades Jd. Maracá e Jd. Lilah.",
    path: "/trabalhe-conosco/",
  });
}

// Página do site atual (backup, 2016): "nenhuma vaga disponível no momento! Deixe seu currículo conosco".
// O formulário antigo recebia o currículo como ARQUIVO; sem backend próprio, aqui o candidato informa um link (Drive, LinkedIn...) ou envia por e-mail.
const FIELDS: FieldSpec[] = [
  { name: "nome", placeholder: "Seu nome *", required: true, icon: "fa-solid fa-user", half: true, autoComplete: "name" },
  { name: "email", placeholder: "Seu e-mail *", type: "email", required: true, icon: "fa-solid fa-envelope", half: true, autoComplete: "email" },
  { name: "cargo", placeholder: "Cargo pretendido", icon: "fa-solid fa-briefcase", half: true },
  { name: "curriculo", placeholder: "Link do currículo (Google Drive, LinkedIn...)", type: "url", icon: "fa-solid fa-link", half: true },
  { name: "mensagem", placeholder: "Sua mensagem", type: "textarea" },
];

export default function TrabalheConosco() {
  return (
    <>
      <PageBanner title="Trabalhe Conosco" />

      <section className="contact-sectionv02 section-padding">
        <div className="container">
          <div className="section-title text-center mb-60">
            <span className="sub-title wow fadeInUp p5-clr">Vagas disponíveis</span>
            <h3 className="m-title wow fadeInUp black" data-wow-delay=".3s">
              Nenhuma vaga disponível no momento!
            </h3>
            <p className="mt-3">
              Deixe seu currículo conosco. Preencha o formulário com o link do seu currículo ou envie o arquivo para{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
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
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact-contentv2">
                <div className="write-comment">
                  <h4 className="black fw-semibold mb-24">Deixe seu currículo</h4>
                  <DynamicForm
                    fields={FIELDS}
                    formName="trabalhe-conosco"
                    button="Enviar"
                    success="Recebemos seus dados! Obrigado pelo interesse em trabalhar na Prisma."
                    build={(v) => ({
                      subject: `Trabalhe conosco${v.cargo ? ` — ${v.cargo}` : ""}`,
                      name: v.nome,
                      email: v.email,
                      message: [`Cargo pretendido: ${v.cargo || "não informado"}`, `Link do currículo: ${v.curriculo || "não informado"}`, "", v.mensagem].join("\n"),
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StaySection />
    </>
  );
}
