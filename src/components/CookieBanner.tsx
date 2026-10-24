import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TRACKING_ENABLED } from "../content/tracking";
import { applyConsent, clearTrackingCookies, getConsent, saveConsent, trackPageView, type Consent } from "../lib/tracking";

/** Evento que o link "Preferências de cookies" do rodapé dispara para reabrir o aviso. */
export const OPEN_COOKIE_PREFS = "prisma:cookie-prefs";

/** Aviso de cookies (LGPD): sem aceite, nenhum script de Google/Meta é carregado. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!TRACKING_ENABLED) return;
    if (!getConsent()) setVisible(true);
    const reopen = () => {
      const saved = getConsent();
      setAnalytics(!!saved?.analytics);
      setMarketing(!!saved?.marketing);
      setCustom(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_PREFS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS, reopen);
  }, []);

  if (!TRACKING_ENABLED || !visible) return null;

  function choose(c: Consent) {
    const prev = getConsent();
    saveConsent(c);
    setVisible(false);
    const withdrew = !!prev && ((prev.analytics && !c.analytics) || (prev.marketing && !c.marketing));
    if (withdrew) {
      // scripts já carregados não podem ser descarregados: limpa os cookies e recarrega a página sem eles
      clearTrackingCookies();
      window.location.reload();
      return;
    }
    applyConsent(c);
    trackPageView(window.location.pathname);
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <p>
        Usamos cookies para medir a audiência do site (Google Analytics) e os resultados dos nossos anúncios (Google Ads e Meta). Você escolhe o que permitir. Saiba mais na{" "}
        <Link to="/politica-de-privacidade/">Política de Privacidade</Link>.
      </p>
      {custom && (
        <div className="cookie-banner__options">
          <label>
            <input type="checkbox" checked disabled /> Essenciais (guardam esta escolha)
          </label>
          <label>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Estatísticas (Google Analytics)
          </label>
          <label>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing (Google Ads e Meta)
          </label>
        </div>
      )}
      <div className="cookie-banner__actions">
        <button type="button" className="theme-btn p5-btn p5-border" onClick={() => choose({ analytics: false, marketing: false })}>
          <span className="black fw-medium">Recusar</span>
        </button>
        {custom ? (
          <button type="button" className="theme-btn p4-bg" onClick={() => choose({ analytics, marketing })}>
            <span>Salvar preferências</span>
          </button>
        ) : (
          <button type="button" className="theme-btn gra-border2" onClick={() => setCustom(true)}>
            <span className="black fw-medium">Personalizar</span>
          </button>
        )}
        <button type="button" className="theme-btn p5-bg" onClick={() => choose({ analytics: true, marketing: true })}>
          <span>Aceitar todos</span>
        </button>
      </div>
    </div>
  );
}
