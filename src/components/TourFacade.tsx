import { useState } from "react";
import { TOUR_URL } from "../content/site";
import { Img } from "./Img";

/**
 * Visita virtual 360° (Vila 360) que só é carregada quando a pessoa clica em iniciar (privacidade e desempenho):
 * nenhum recurso do vila360.com.br é pedido antes do clique. Mesma ideia do `YouTubeFacade`.
 */
export function TourFacade() {
  const [started, setStarted] = useState(false);
  return (
    <div className="ratio tour-frame round10 overflow-hidden">
      {started ? (
        <iframe
          src={TOUR_URL}
          title="Visita virtual 360° da Prisma Escola"
          allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      ) : (
        <button type="button" className="tour-facade" onClick={() => setStarted(true)} aria-label="Iniciar a visita virtual 360° da Prisma Escola">
          <Img src="infra/tour-capa.webp" alt="" />
          <span className="tour-facade-content">
            <i className="fa-solid fa-circle-play" aria-hidden="true"></i>
            <span>Iniciar visita virtual 360°</span>
          </span>
        </button>
      )}
    </div>
  );
}
