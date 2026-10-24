import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { NAV, type NavItem } from "../content/nav";
import { findPage } from "../content/pages";
import { HOURS, SOCIAL, UNITS } from "../content/site";
import { useStickyHeader } from "../lib/hooks";
import { Img } from "./Img";
import { openWhatsAppForm } from "./WhatsAppWidget";

const label = (path: string) => {
  const p = findPage(path);
  return p?.label ?? p?.title ?? path;
};

const isActive = (pathname: string, item: NavItem) => pathname === item.path || !!item.children?.includes(pathname);

function Social({ className }: { className?: string }) {
  return (
    <>
      <a href={SOCIAL.facebook} className={className} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Prisma Escola (abre em nova aba)">
        <i className={`${className ?? ""} fab fa-facebook-f`.trim()}></i>
      </a>
      <a href={SOCIAL.instagram} className={className} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Prisma Escola (abre em nova aba)">
        <i className={`${className ?? ""} fab fa-instagram`.trim()}></i>
      </a>
    </>
  );
}

/** Menu do painel lateral (no template, gerado pelo meanmenu a partir de #mobile-menu). */
function MobileMenu({ pathname }: { pathname: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="mean-container">
      <div className="mean-bar">
        <nav className="mean-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.path} className={isActive(pathname, item) ? "active" : undefined}>
                <Link to={item.path}>{item.label}</Link>
                {item.children && (
                  <>
                    <a
                      href="#"
                      className={expanded === item.path ? "mean-expand mean-clicked" : "mean-expand"}
                      aria-label={`Mostrar submenu de ${item.label}`}
                      aria-expanded={expanded === item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setExpanded(expanded === item.path ? null : item.path);
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </a>
                    <ul style={{ display: expanded === item.path ? "block" : "none" }}>
                      {item.children.map((child) => (
                        <li key={child}>
                          <Link to={child}>{label(child)}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const sticky = useStickyHeader(250);

  // fecha o painel ao navegar e com Esc
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className={open ? "offcanvas__info info-open" : "offcanvas__info"} inert={!open} role="dialog" aria-label="Menu">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-4 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/">
                    <Img src="logo/logo.webp" alt="Prisma Escola" width={64} height={64} loading="eager" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix mb-3">{open && <MobileMenu pathname={pathname} />}</div>
              <div className="offcanvas__contact">
                <h4>Fale conosco</h4>
                <ul>
                  {UNITS.map((u) => (
                    <li key={u.id} className="d-flex align-items-center">
                      <div className="offcanvas__contact-icon">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="offcanvas__contact-text">
                        <Link to={u.path}>
                          {u.name}: {u.address}
                        </Link>
                      </div>
                    </li>
                  ))}
                  {UNITS.map((u) => (
                    <li key={`${u.id}-tel`} className="d-flex align-items-center">
                      <div className="offcanvas__contact-icon mr-15">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div className="offcanvas__contact-text">
                        <a href={`tel:${u.tel}`}>
                          {u.short}: {u.phone}
                        </a>
                      </div>
                    </li>
                  ))}
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <span>{HOURS.map((h) => `${h.days}: ${h.time}`).join(" · ")}</span>
                    </div>
                  </li>
                </ul>
                <div className="header-button mt-4">
                  {/* o link continua apontando para /matriculas/ (sem JavaScript ele navega); com JavaScript abre o questionário do WhatsApp */}
                  <Link
                    to="/matriculas/"
                    className="theme-btn p2-bg text-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      openWhatsAppForm();
                    }}
                  >
                    <span>
                      Matrículas 2027
                      <span className="ani-arrow">
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </span>
                    </span>
                  </Link>
                </div>
                <div className="social-icon d-flex align-items-center">
                  <Social />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={open ? "offcanvas__overlay overlay-open" : "offcanvas__overlay"} onClick={() => setOpen(false)}></div>

      {/* Header Top Section Start */}
      <div className="header-top-section d-lg-block d-none">
        <div className="container">
          <div className="header-top-wrapper">
            <ul className="contact-list">
              {UNITS.map((u) => (
                <li key={u.id}>
                  <a href={`tel:${u.tel}`}>
                    <i className="fa-solid fa-phone"></i> {u.name}: {u.phone}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/trabalhe-conosco/" className="link">
                  <i className="fa-solid fa-briefcase"></i> Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link to="/area-dos-professores/" className="link">
                  <i className="fa-solid fa-chalkboard-user"></i> Área dos Professores
                </Link>
              </li>
            </ul>
            <div className="social-wrapper d-flex align-items-center">
              <Social className="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Header Section Start */}
      <header id="header-sticky" className={sticky ? "header-1 white-bg sticky" : "header-1 white-bg"}>
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main style-2">
              <div className="header-left">
                <div className="logo">
                  <Link to="/" className="header-logo" aria-label="Prisma Escola — página inicial">
                    <Img src="logo/logo.webp" alt="Prisma Escola" width={64} height={64} loading="eager" />
                  </Link>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper">
                  <div className="main-menu">
                    <nav id="mobile-menu" aria-label="Menu principal">
                      <ul>
                        {NAV.map((item) => {
                          const cls = [item.children && "has-dropdown", isActive(pathname, item) && "active"].filter(Boolean).join(" ");
                          return (
                            <li key={item.path} className={cls || undefined}>
                              <Link to={item.path}>
                                {item.label}
                                {item.children && <i className="fas fa-angle-down"></i>}
                              </Link>
                              {item.children && (
                                <ul className="submenu">
                                  {item.children.map((child) => (
                                    <li key={child}>
                                      <Link to={child}>{label(child)}</Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                </div>
                <div className="header-button d-sm-block d-none">
                  <Link
                    to="/matriculas/"
                    className="theme-btn p5-bg"
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsAppForm();
                    }}
                  >
                    <span>
                      Matrículas 2027
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </span>
                  </Link>
                </div>
                <div className="header__hamburger d-xl-none my-auto">
                  <button type="button" className="sidebar__toggle" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)}>
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
