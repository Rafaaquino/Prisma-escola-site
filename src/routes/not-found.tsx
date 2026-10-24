import { Link } from "react-router";
import { PageBanner } from "../components/PageBanner";

export function meta() {
  return [{ title: "Página não encontrada | Prisma Escola" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <>
      <PageBanner title="Página não encontrada" />
      <section className="space-top space-bottom">
        <div className="container">
          <div className="section-title">
            <span className="sub-title p5-clr">Erro 404</span>
            <h3 className="m-title black">O endereço que você acessou não existe ou foi alterado</h3>
            <p className="mt-3">
              <Link to="/">Voltar para a página inicial</Link> · <Link to="/contato/">Falar com a escola</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
