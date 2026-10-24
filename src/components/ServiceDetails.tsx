import type { ReactNode } from "react";
import { Img } from "./Img";

export interface DetailCard {
  /** Ícone do template (ex.: "aicon/car-icons1.webp"). */
  icon: string;
  title: string;
  text: ReactNode;
}

export interface ServiceDetailsProps {
  /** Imagem grande do topo (ex.: "aservices/details-big1.webp"). */
  heroImg?: string;
  /** Descrição da imagem do topo (para leitores de tela e buscadores). Vazio = imagem decorativa. */
  heroAlt?: string;
  title: string;
  paragraphs?: ReactNode[];
  /** Duas colunas de marcadores com seta. */
  bulletsLeft?: ReactNode[];
  bulletsRight?: ReactNode[];
  /** Três imagens lado a lado (só o caminho, ou o caminho com a descrição da imagem). */
  middleImgs?: (string | { src: string; alt: string })[];
  /** Até três cartões com ícone. */
  cards?: DetailCard[];
  /** Bloco final: título + texto + lista (com seta dupla) ao lado de uma imagem. */
  details?: { title: string; text?: ReactNode; list: ReactNode[]; img: string; imgAlt?: string };
  /** Conteúdo extra no fim do container (ex.: mapa, botões). */
  after?: ReactNode;
}

const DEFAULT_ICONS = ["aicon/car-icons1.webp", "aservices/sertd1.webp", "aicon/car-icons5.webp"];

/** Layout do `service-details.php` do Ascent (mesma marcação e classes). Todos os blocos são opcionais. */
export function ServiceDetails({ heroImg, heroAlt, title, paragraphs, bulletsLeft, bulletsRight, middleImgs, cards, details, after }: ServiceDetailsProps) {
  return (
    <section className="service-dtails overflow-hidden section-padding position-relative">
      <div className="container">
        {heroImg && (
          <div className="details-thumb mb-30 w-100 wow fadeInUp" data-wow-delay=".2s">
            <Img src={heroImg} alt={heroAlt} className="w-100 round10" priority />
          </div>
        )}
        <div className="common-content-box mb-40 wow fadeInUp" data-wow-delay=".3s">
          <h2 className="custom-title black mb-lg-3 mb-2">{title}</h2>
          {paragraphs?.map((p, i) => (
            <p key={i} className="pra mb-30">
              {p}
            </p>
          ))}
          {(bulletsLeft || bulletsRight) && (
            <div className="d-flex justify-content-between mb-40 gap-lg-4 gap-2 flex-wrap flex-md-nowrap">
              {[bulletsLeft, bulletsRight].map(
                (col, c) =>
                  col && (
                    <ul key={c}>
                      {col.map((b, i) => (
                        <li key={i} className="d-flex align-items-center gap-xl-3 gap-2 pra mb-2">
                          <i className="fa-solid fa-chevron-right p5-clr"></i>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ),
              )}
            </div>
          )}
          {middleImgs && (
            <div className="row justify-content-center g-xl-4 g-3 mb-60">
              {middleImgs.map((m) => {
                const { src, alt } = typeof m === "string" ? { src: m, alt: "" } : m;
                return (
                  <div key={src} className="col-lg-4 col-md-6 col-sm-6">
                    <div className="details-thumb-middile w-100">
                      <Img src={src} alt={alt} className="w-100 round10" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {cards && (
            <div className="row justify-content-center g-xl-4 g-3 mb-40">
              {cards.map((c, i) => (
                <div key={c.title} className="col-lg-4 col-md-6 col-sm-6">
                  <div className="details-class-info w-100">
                    <div className="icon d-center">
                      <Img src={c.icon || DEFAULT_ICONS[i % 3]} alt="" />
                    </div>
                    <h3 className="black mb-xl-3 mb-2" style={{ fontSize: "1.5rem" }}>
                      {c.title}
                    </h3>
                    <p className="pra">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {details && (
          <>
            <div className="cont-box mb-30 wow fadeInUp" data-wow-delay=".4s">
              <h3 className="black mb-lg-3 mb-2">{details.title}</h3>
              {details.text && <p className="pra">{details.text}</p>}
            </div>
            <div className="row align-items-center g-lg-4 g-3 wow fadeInUp" data-wow-delay=".5s">
              <div className="col-lg-6 col-md-6">
                <div className="see-content">
                  <ul className="d-grid gap-xl-4 gap-lg-2 gap-md-1">
                    {details.list.map((item, i) => (
                      <li key={i} className="d-flex align-items-center gap-xl-3 gap-2 pra mb-2">
                        <i className="fa-solid fa-angles-right p5-clr"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="see-all-thumb w-100">
                  <Img src={details.img} alt={details.imgAlt} className="w-100 round10" />
                </div>
              </div>
            </div>
          </>
        )}
        {after}
      </div>
    </section>
  );
}
