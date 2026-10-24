import { Link, useLocation } from "react-router";
import { NAV } from "../content/nav";
import { findPage } from "../content/pages";
import { Img } from "./Img";

/** Faixa de topo das páginas internas (HTML do `breadcrumnd-banner` do template, ex.: contact.php). */
export function PageBanner({ title }: { title: string }) {
  const { pathname } = useLocation();
  const current = findPage(pathname)?.path ?? pathname;
  const parent = NAV.find((item) => item.children?.includes(current));

  return (
    <section className="breadcrumnd-banner cmn-bg overflow-hidden">
      <div className="container">
        <div className="breadcrumnd-wrapper">
          <div className="breadcrumnd-content">
            <h1 className="black mb-lg-4 mb-md-3 mb-2">{title}</h1>
            <ul className="bread-list d-flex align-items-center gap-lg-4 gap-md-3 gap-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right"></i>
              </li>
              {parent && (
                <>
                  <li>
                    <Link to={parent.path}>{parent.label}</Link>
                  </li>
                  <li>
                    <i className="fa-solid fa-chevron-right"></i>
                  </li>
                </>
              )}
              <li>{title}</li>
            </ul>
          </div>
          <div className="breadcrumnd-thumb position-relative">
            <Img src="abanner/bread-thumb.webp" alt="" className="mimg" loading="eager" />
            <Img src="abanner/bread-child.webp" alt="" className="bread-child" loading="eager" />
            <Img src="abanner/bread-cat.webp" alt="" className="bread-cat" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
