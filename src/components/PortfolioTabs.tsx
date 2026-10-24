import { useState } from "react";
import { Link } from "react-router";
import { Img } from "./Img";

export interface GalleryItem {
  title: string;
  sub: string;
  /** Página para onde o item leva. Sem ele, o item é só uma foto com legenda (sem link nem seta). */
  to?: string;
  /** Imagem em public/assets/img, já recortada na proporção do espaço (ex.: "infra/sala-ampla.webp"). */
  img: string;
}

/** Os 4 arranjos do template (index.php): A = 5 itens, B = 4, C = 2 iguais, D = 2 (grande + pequeno). */
export type GalleryLayout = "A" | "B" | "C" | "D";

export interface GalleryTab {
  label: string;
  layout: GalleryLayout;
  items: GalleryItem[];
}

function Item({ item }: { item: GalleryItem }) {
  return (
    <div className="protfolio-itemv1 position-relative overflow-hidden round10">
      <Img src={item.img} alt={item.title} />
      <div className="protfolio-content-box p-lg-2 p-1">
        <div className="box">
          <h4>
            {item.to ? (
              <Link to={item.to} className="white">
                {item.title}
              </Link>
            ) : (
              <span className="white">{item.title}</span>
            )}
          </h4>
          <p className="white">{item.sub}</p>
        </div>
        {item.to && (
          <Link to={item.to} className="prot-arrow" aria-label={`Saiba mais: ${item.title}`}>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        )}
      </div>
    </div>
  );
}

function Content({ layout, items }: { layout: GalleryLayout; items: GalleryItem[] }) {
  const i = items;
  switch (layout) {
    case "A":
      return (
        <div className="row align-items-start g-lg-4 g-2">
          <div className="col-lg-4 col-md-4 col-sm-6 wow fadeInUp" data-wow-delay=".3s">
            <Item item={i[0]} />
          </div>
          <div className="col-lg-8 col-md-8 col-sm-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="row g-lg-4 g-2">
              <div className="col-lg-8 col-md-6">
                <Item item={i[1]} />
              </div>
              <div className="col-lg-4 col-md-6">
                <Item item={i[2]} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Item item={i[3]} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Item item={i[4]} />
              </div>
            </div>
          </div>
        </div>
      );
    case "B":
      return (
        <div className="row align-items-start g-lg-4 g-2">
          <div className="col-lg-12 wow fadeInUp" data-wow-delay=".3s">
            <div className="row g-lg-4 g-2">
              <div className="col-lg-8 col-md-6">
                <Item item={i[0]} />
              </div>
              <div className="col-lg-4 col-md-6">
                <Item item={i[1]} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Item item={i[2]} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Item item={i[3]} />
              </div>
            </div>
          </div>
        </div>
      );
    case "C":
      return (
        <div className="row align-items-start g-lg-4 g-2">
          <div className="col-lg-12 wow fadeInUp" data-wow-delay=".3s">
            <div className="row g-lg-4 g-2">
              <div className="col-lg-6 col-md-6">
                <Item item={i[0]} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Item item={i[1]} />
              </div>
            </div>
          </div>
        </div>
      );
    case "D":
      return (
        <div className="row align-items-start g-lg-4 g-2">
          <div className="col-lg-12 wow fadeInUp" data-wow-delay=".3s">
            <div className="row g-lg-4 g-2">
              <div className="col-lg-8 col-md-6">
                <Item item={i[0]} />
              </div>
              <div className="col-lg-4 col-md-6">
                <Item item={i[1]} />
              </div>
            </div>
          </div>
        </div>
      );
  }
}

/** Abas com galeria do template (`.singletab`). Todas as abas ficam no HTML; só a ativa é exibida pelo CSS do template. */
export function PortfolioTabs({ tabs }: { tabs: GalleryTab[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="singletab">
      <div className="protfolio-tabs mb-60">
        <ul className="tablinks" role="tablist">
          {tabs.map((t, idx) => (
            <li key={t.label} role="presentation" className={idx === active ? "nav-links active" : "nav-links"}>
              <button type="button" className="tablink" role="tab" aria-selected={idx === active} onClick={() => setActive(idx)}>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="tabcontents">
        {tabs.map((t, idx) => (
          <div key={t.label} className={idx === active ? "tabitem active" : "tabitem"} role="tabpanel" inert={idx !== active}>
            <Content layout={t.layout} items={t.items} />
          </div>
        ))}
      </div>
    </div>
  );
}
