import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { WHATSAPP_MATRICULAS } from "../content/site";
import { trackLead } from "../lib/tracking";

/** Evento que abre o questionário do WhatsApp (os botões "Matrículas 2027" o disparam). */
export const OPEN_WHATSAPP_FORM = "prisma:whatsapp-form";
export const openWhatsAppForm = () => window.dispatchEvent(new Event(OPEN_WHATSAPP_FORM));

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Link do WhatsApp com a mensagem pronta. Nada disso passa pelo nosso site: vai direto do aparelho do visitante para o WhatsApp. */
function whatsappUrl({ parent, child, age }: { parent: string; child: string; age: string }) {
  const text = `Olá! Meu nome é ${parent}. Gostaria de informações sobre as matrículas na Prisma Escola.\nNome da criança: ${child}\nIdade: ${age}`;
  return `https://wa.me/${WHATSAPP_MATRICULAS}?text=${encodeURIComponent(text)}`;
}

const clean = (v: FormDataEntryValue | null) => String(v ?? "").replace(/\s+/g, " ").trim();

/**
 * Ícone do WhatsApp no canto da tela + questionário rápido (seu nome, nome e idade da criança).
 * Ao concluir, abre o WhatsApp da escola com a mensagem já escrita. Aparece em todas as páginas.
 */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocusTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSentUrl(null);
    setError("");
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    returnFocusTo.current?.focus();
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_WHATSAPP_FORM, show);
    return () => window.removeEventListener(OPEN_WHATSAPP_FORM, show);
  }, [show]);

  // Com o questionário aberto: foco no primeiro campo, Esc fecha, Tab não escapa dele e a página de trás não rola.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`; // evita o "pulo" da página quando a barra de rolagem some

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hide();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const items = Array.from(cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, hide]);

  // ao concluir, o foco vai para a confirmação (leitores de tela anunciam o resultado)
  useEffect(() => {
    if (sentUrl) doneRef.current?.focus();
  }, [sentUrl]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const data = { parent: clean(d.get("parent")), child: clean(d.get("child")), age: clean(d.get("age")) };
    if (!data.parent || !data.child || !data.age) {
      setError("Preencha os três campos para continuar.");
      return;
    }
    const url = whatsappUrl(data);
    trackLead("whatsapp");
    // abre dentro do clique (senão o navegador bloqueia); se mesmo assim for bloqueado, a confirmação traz o link
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setSentUrl(url);
  }

  return (
    <>
      <button type="button" className="wa-fab" aria-label="Falar com a Prisma pelo WhatsApp" aria-haspopup="dialog" onClick={show}>
        <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
        <span className="wa-fab__label">Fale conosco</span>
      </button>

      {open && (
        <div className="wa-modal" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
          <div className="wa-modal__card" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <button type="button" className="wa-modal__close" aria-label="Fechar" onClick={hide}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>

            {sentUrl ? (
              <div ref={doneRef} tabIndex={-1} className="wa-modal__done">
                <span className="wa-modal__badge">
                  <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                </span>
                <h2 id={titleId}>Tudo certo!</h2>
                <p>Abrimos o WhatsApp com a mensagem pronta. É só tocar em enviar e nossa equipe responde por lá.</p>
                <p>Não abriu? Use o botão abaixo.</p>
                <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="theme-btn w-100 round100 p4-bg py-3 mt-2">
                  <span className="white fw-medium">
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> Abrir o WhatsApp
                  </span>
                </a>
                <button type="button" className="link-btn wa-modal__later" onClick={hide}>
                  Fechar
                </button>
              </div>
            ) : (
              <div className="write-comment">
                <span className="wa-modal__badge">
                  <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                </span>
                <h2 id={titleId}>Fale com a Prisma pelo WhatsApp</h2>
                <p>Conte um pouco sobre a criança e abriremos o WhatsApp com a mensagem pronta para a nossa equipe de matrículas.</p>
                <form className="row g-3" onSubmit={onSubmit}>
                  <div className="col-12">
                    <div className="comment-grp">
                      <input ref={firstFieldRef} type="text" name="parent" placeholder="Seu nome *" aria-label="Seu nome" required maxLength={60} autoComplete="name" />
                      <i className="fa-solid fa-user" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="comment-grp">
                      <input type="text" name="child" placeholder="Nome da criança *" aria-label="Nome da criança" required maxLength={60} autoComplete="off" />
                      <i className="fa-solid fa-child" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="comment-grp">
                      <input type="text" name="age" placeholder="Idade da criança * (ex.: 4 anos)" aria-label="Idade da criança" required maxLength={24} autoComplete="off" />
                      <i className="fa-solid fa-cake-candles" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="theme-btn w-100 round100 p4-bg py-3">
                      <span className="white fw-medium">
                        <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> Continuar no WhatsApp
                      </span>
                    </button>
                    <p className="form-message error" role="alert">
                      {error}
                    </p>
                    <p className="wa-modal__note">Estas informações não ficam salvas no site: seguem apenas na mensagem que você enviar pelo WhatsApp.</p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
