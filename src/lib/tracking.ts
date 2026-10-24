import { ADS_IDS, GA4_ID, META_PIXEL_ID, TRACKING_ENABLED } from "../content/tracking";

/**
 * Google Analytics 4, Google Ads (remarketing) e Meta Pixel, SOMENTE com consentimento (LGPD):
 * nenhum script de terceiros é carregado antes do aceite. Categorias: analytics (GA4) e marketing (Ads + Meta Pixel).
 */
export interface Consent {
  analytics: boolean;
  marketing: boolean;
}

const KEY = "prisma-cookie-consent-v1";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;
interface TrackingWindow extends Window {
  dataLayer?: unknown[];
  gtag?: AnyFn;
  fbq?: AnyFn;
  _fbq?: unknown;
}
const win = () => window as TrackingWindow;

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Consent>;
    return { analytics: !!v.analytics, marketing: !!v.marketing };
  } catch {
    return null;
  }
}

export function saveConsent(c: Consent) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...c, savedAt: new Date().toISOString() }));
  } catch {
    /* navegação privada / armazenamento bloqueado: a escolha vale só nesta página */
  }
}

let gtagReady = false;
const done = { ga: false, ads: new Set<string>(), pixel: false };

/** Carrega o gtag.js (uma vez) já com todas as permissões NEGADAS; a permissão é concedida depois, por categoria. */
function ensureGtag() {
  if (gtagReady) return;
  gtagReady = true;
  const w = win();
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // o gtag.js exige objetos `arguments` na dataLayer
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  w.gtag("js", new Date());
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID || ADS_IDS[0] || "")}`;
  document.head.appendChild(s);
}

function loadMetaPixel() {
  done.pixel = true;
  const w = win();
  if (!w.fbq) {
    // snippet padrão do Meta Pixel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const n: any = (w.fbq = function () {
      // eslint-disable-next-line prefer-rest-params
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  w.fbq!("init", META_PIXEL_ID);
}

/** Liga as ferramentas permitidas pela escolha do visitante (idempotente). */
export function applyConsent(c: Consent) {
  if (!TRACKING_ENABLED) return;
  const w = win();

  if ((c.analytics && GA4_ID) || (c.marketing && ADS_IDS.length)) {
    ensureGtag();
    const granted = (on: boolean) => (on ? "granted" : "denied");
    w.gtag!("consent", "update", {
      analytics_storage: granted(c.analytics),
      ad_storage: granted(c.marketing),
      ad_user_data: granted(c.marketing),
      ad_personalization: granted(c.marketing),
    });
  }
  if (c.analytics && GA4_ID && !done.ga) {
    done.ga = true;
    w.gtag!("config", GA4_ID, { send_page_view: false }); // a visualização de página é enviada à mão (rotas do SPA)
  }
  if (c.marketing) {
    for (const id of ADS_IDS) {
      if (done.ads.has(id)) continue;
      done.ads.add(id);
      w.gtag!("config", id, { send_page_view: false });
    }
    if (META_PIXEL_ID && !done.pixel) loadMetaPixel();
  }
}

/** Registra a página atual (chamar a cada navegação). Sem consentimento, não faz nada. */
export function trackPageView(path: string) {
  if (!TRACKING_ENABLED) return;
  const c = getConsent();
  if (!c) return;
  const w = win();
  if (c.analytics && GA4_ID && w.gtag) {
    w.gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
  }
  if (c.marketing && META_PIXEL_ID && w.fbq) w.fbq("track", "PageView");
}

/** Conversão: formulário enviado. GA4 `generate_lead` e Meta `Lead` (só com o consentimento da categoria). */
export function trackLead(form: string) {
  if (!TRACKING_ENABLED) return;
  const c = getConsent();
  if (!c) return;
  const w = win();
  if (c.analytics && GA4_ID && w.gtag) w.gtag("event", "generate_lead", { form_name: form });
  if (c.marketing && META_PIXEL_ID && w.fbq) w.fbq("track", "Lead");
}

/** Apaga os cookies de rastreamento (ao retirar o consentimento). */
export function clearTrackingCookies() {
  const parts = window.location.hostname.split(".");
  const domains = parts.map((_, i) => `.${parts.slice(i).join(".")}`).filter((d) => d.split(".").length > 2);
  domains.push(window.location.hostname);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim() ?? "";
    if (!/^(_ga|_gid|_gat|_gcl|_gac|_fbp|_fbc|IDE|test_cookie)/.test(name)) continue;
    const expire = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expire;
    for (const d of domains) document.cookie = `${expire}; domain=${d}`;
  }
}
