import { Link } from "react-router";
import { EMAIL, SOCIAL, TAGLINE, UNITS } from "../content/site";
import { TRACKING_ENABLED } from "../content/tracking";
import { OPEN_COOKIE_PREFS } from "./CookieBanner";
import { EmailForm } from "./EmailForm";
import { Img } from "./Img";

const YEAR = new Date().getFullYear();

function Social() {
  return (
    <div className="social-wrapper social-empact d-flex align-items-center">
      <a href={SOCIAL.facebook} className="white" target="_blank" rel="noopener noreferrer" aria-label="Facebook da Prisma Escola (abre em nova aba)">
        <i className="white fab fa-facebook-f"></i>
      </a>
      <a href={SOCIAL.instagram} className="white" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Prisma Escola (abre em nova aba)">
        <i className="white fab fa-instagram"></i>
      </a>
    </div>
  );
}

function ContactList() {
  return (
    <ul className="list-area list-contact">
      {UNITS.map((u) => (
        <li key={u.id}>
          <i className="fa-solid fa-location-dot"></i>
          <span className="lited">
            <Link to={u.path}>{u.name}</Link>: {u.address}
          </span>
        </li>
      ))}
      {UNITS.map((u) => (
        <li key={`${u.id}-tel`}>
          <i className="fa-solid fa-phone"></i>
          <a href={`tel:${u.tel}`} className="link">
            {u.short}: {u.phone}
          </a>
        </li>
      ))}
      <li>
        <i className="fa-regular fa-envelope"></i>
        <a href={`mailto:${EMAIL}`} className="link">
          {EMAIL}
        </a>
      </li>
    </ul>
  );
}

function PageLinks() {
  return (
    <ul className="list-area">
      <li>
        <Link to="/matriculas/">Matrículas</Link>
      </li>
      <li>
        <Link to="/vem-pra-prisma/">Vem Ser Prisma</Link>
      </li>
      <li>
        <Link to="/infraestrutura/">Infraestrutura</Link>
      </li>
      <li>
        <Link to="/trabalhe-conosco/">Trabalhe Conosco</Link>
      </li>
      <li>
        <Link to="/area-dos-professores/">Área dos Professores</Link>
      </li>
      <li>
        <Link to="/area-dos-professores/#financeiro">Financeiro</Link>
      </li>
      <li>
        <Link to="/contato/">Contato</Link>
      </li>
    </ul>
  );
}

function Bottom() {
  return (
    <div className="footer-bottom">
      <div className="container">
        <div className="footer-wrapper d-md-flex d-grid gap-md-0 gap-2 align-items-center justify-content-md-between justify-content-center text-md-start text-center">
          <p className="wow fadeInLeft color-2" data-wow-delay=".3s">
            &copy; <span suppressHydrationWarning>{YEAR}</span> Prisma Escola | Todos os direitos reservados
            <span className="footer-credit">
              {" "}
              | Desenvolvido por{" "}
              <a href="https://wacoders.com" target="_blank" rel="noopener noreferrer">
                WA Coders<span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </span>
          </p>
          <ul className="footer-menu wow fadeInRight" data-wow-delay=".5s">
            <li>
              <Link to="/politica-de-privacidade/">Política de Privacidade</Link>
            </li>
            <li>
              <Link to="/contato/">Fale conosco</Link>
            </li>
            {TRACKING_ENABLED && (
              <li>
                <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFS))}>
                  Preferências de cookies
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <a
        href="#"
        id="scrollUp"
        className="scroll-icon"
        aria-label="Voltar ao topo"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </a>
    </div>
  );
}

/** `variant="light"` = footer.php (usado só na home). `variant="dark"` = footer-2.php (todas as outras páginas). */
export function Footer({ variant }: { variant: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <footer className={dark ? "footer-section overflow-hidden position-relative footer-style2 p1-bg" : "footer-section overflow-hidden position-relative footer-style1 white-bg"}>
      <div className="footer-widgets-wrapper">
        <div className="container">
          <div className="row g-md-4 g-4 justify-content-between">
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".3s">
              <div className="single-footer-widget">
                <div className="widget-heads">
                  <Link to="/" className="footer-logo" aria-label="Prisma Escola — página inicial">
                    <Img src={dark ? "logo/logo-light.webp" : "logo/logo.webp"} alt="Prisma Escola" width={64} height={64} />
                  </Link>
                </div>
                <div className="footer-content">
                  <p className="pre-pragraph">{TAGLINE}. Excelência educacional e referência em formação humana.</p>
                  <Social />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".5s">
              <div className="single-footer-widget">
                <div className="widget-head">
                  <h4 className={dark ? "white" : undefined}>Páginas</h4>
                </div>
                <PageLinks />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".5s">
              <div className="single-footer-widget">
                <div className="widget-head">
                  <h4 className={dark ? "white" : undefined}>Contato</h4>
                </div>
                <ContactList />
              </div>
            </div>
            {dark && (
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".7s">
                <div className="single-footer-widget single-footer-form">
                  <div className="widget-head">
                    <h4 className="white">Receba informações</h4>
                  </div>
                  <p className="white">Deixe seu e-mail e fale com a gente sobre matrículas</p>
                  <EmailForm kind="footer" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Bottom />
      {/* Element */}
      <Img src="footer/f-apple.webp" alt="" className="footer-apple position-absolute" />
      <Img src="footer/f-cut.webp" alt="" className="footer-cut position-absolute" />
    </footer>
  );
}
