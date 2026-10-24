import { Link } from "react-router";
import { Img } from "../components/Img";
import { PageBanner } from "../components/PageBanner";

export function meta() {
  return [{ title: "Página não encontrada | Prisma Escola" }, { name: "robots", content: "noindex" }];
}

/** Atalhos para o que os pais mais procuram (caminhos de src/content/pages.json). */
const SHORTCUTS = [
  { to: "/matriculas/", label: "Matrículas" },
  { to: "/ensino/", label: "Ensino" },
  { to: "/unidades/", label: "Unidades" },
];

/**
 * O Ascent não traz página de erro: usa a estrutura da seção de dúvidas da home (ilustração + conteúdo), os cartões coloridos
 * dos números (`knowledge-item`) para o "404" e os botões do tema.
 */
export default function NotFound() {
  return (
    <>
      <PageBanner title="Página não encontrada" />
      <section className="faq-sectionv space-top space-bottom overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-5 col-md-5">
              <div className="faq-thumbs mx-auto not-found-thumb">
                <Img src="about/faq.webp" alt="" priority />
              </div>
            </div>
            <div className="col-lg-7 col-md-7">
              <div className="faq-content">
                <div className="not-found-digits d-flex gap-2 gap-md-3 mb-40" aria-hidden="true">
                  <span className="not-found-digit d-center p1-bg white">4</span>
                  <span className="not-found-digit d-center p2-bg white">0</span>
                  <span className="not-found-digit d-center p3-bg white">4</span>
                </div>
                <div className="section-title mb-40">
                  <span className="sub-title p5-clr">Erro 404</span>
                  <h2 className="m-title black">Ops! Não encontramos esta página</h2>
                  <p className="mt-3">
                    O endereço pode ter mudado ou ter sido digitado errado. Mas não se preocupe: é fácil voltar ao caminho. Escolha uma opção
                    abaixo ou fale com a gente.
                  </p>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-40">
                  <Link to="/" className="theme-btn p4-bg">
                    <span className="white fw-medium">Voltar para a página inicial</span>
                  </Link>
                  <Link to="/contato/" className="theme-btn gra-border2">
                    <span className="black fw-medium">Falar com a escola</span>
                  </Link>
                </div>
                <p className="black fw-medium mb-3">Ou vá direto para:</p>
                <div className="d-flex flex-wrap gap-2 gap-md-3">
                  {SHORTCUTS.map((s) => (
                    <Link key={s.to} to={s.to} className="theme-btn p5-btn p5-border">
                      <span className="black fw-medium">{s.label}</span>
                      <i className="fa-solid fa-arrow-right p5-clr"></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
