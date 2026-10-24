import { useState } from "react";

/**
 * Vídeo do YouTube que só é carregado quando a pessoa clica em reproduzir (privacidade e desempenho):
 * nenhum recurso do YouTube/Google é pedido antes do clique, e o player usa o modo de privacidade ampliada.
 */
export function YouTubeFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="ratio ratio-16x9 round10 overflow-hidden">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      ) : (
        <button type="button" className="yt-facade" onClick={() => setPlaying(true)} aria-label={`Reproduzir vídeo: ${title}`}>
          <i className="fa-solid fa-circle-play" aria-hidden="true"></i>
          <span>Reproduzir vídeo</span>
        </button>
      )}
    </div>
  );
}
