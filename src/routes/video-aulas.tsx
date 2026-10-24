import { PageBanner } from "../components/PageBanner";
import { StaySection } from "../components/StaySection";
import { YouTubeFacade } from "../components/YouTubeFacade";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Vídeo Aulas",
    description: "Vídeo aulas de matemática com o Professor Hammy Hwygem: ângulos, retas paralelas, semelhança de triângulos, trigonometria e sistema linear.",
    path: "/video-aulas/",
  });
}

// Lista do site atual (backup, 2017). O título "Adição" estava com uma marca de HTML quebrada no original ("<br"), aqui corrigida.
const VIDEOS = [
  { id: "qJLm3C9J3OY", title: "Ângulos Opostos pelo Vértice - Prof Hammy Hwygem - Parte 1" },
  { id: "vj-GpU8bPyo", title: "Ângulos opostos pelo vértice - Prof Hammy Hwygem - Parte 2" },
  { id: "0TuaVaEH1Zs", title: "Duas retas paralelas cortadas por uma transversal - Prof Hammy Hwygem - Parte 1" },
  { id: "gWskTeAZ6EI", title: "Exercícios: Duas retas paralelas cortadas por uma transversal - Prof Hammy Hwygem - Parte 2" },
  { id: "K_KCVCL6fS0", title: "Semelhança de Triângulos - Prof Hammy Hwygem - Parte 1" },
  { id: "KR_zB9SSCnw", title: "Exercício: Semelhança de Triângulos - Prof Hammy Hwygem - Parte 2" },
  { id: "vjuJb5S19Wg", title: "Adição - Prof Hammy Hwygem" },
  { id: "clrSnFAty_8", title: "Razões Trigonométricas para os ângulos: 30º, 45º e 60º - Prof Hammy Hwygem - Parte 2" },
  { id: "xPLNd9ZLpRk", title: "Trigonometria no Triângulo Retângulo - Prof Hammy Hwygem - Parte 1" },
  { id: "TFxhpVnkKE4", title: "Sistema Linear - Prof Hammy Hwygem" },
];

export default function VideoAulas() {
  return (
    <>
      <PageBanner title="Vídeo Aulas" />
      <section className="service-dtails overflow-hidden section-padding position-relative">
        <div className="container">
          <div className="common-content-box">
            <h2 className="custom-title black mb-lg-3 mb-2">Aulas de matemática com o Professor Hammy Hwygem</h2>
            <p className="pra mb-40">Os vídeos só são carregados do YouTube quando você clica em reproduzir.</p>
            <div className="row g-4">
              {VIDEOS.map((v, i) => (
                <div key={v.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`.${2 + (i % 3)}s`}>
                  <YouTubeFacade id={v.id} title={v.title} />
                  <h3 className="black mt-3" style={{ fontSize: "1.125rem", lineHeight: 1.4 }}>
                    {v.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <StaySection />
    </>
  );
}
