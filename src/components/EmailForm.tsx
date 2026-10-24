import { useState, type FormEvent } from "react";
import { submitForm } from "../lib/forms/submit";
import { trackLead } from "../lib/tracking";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; text: string };

interface EmailFormProps {
  /** "inspair" = faixa "Get Connected" da home (botão com texto); "footer" = coluna do rodapé escuro (botão só com seta). */
  kind: "inspair" | "footer";
}

/** Formulário de e-mail do template (`.footer-form`), agora funcional. */
export function EmailForm({ kind }: EmailFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "sending" });
    const result = await submitForm({
      subject: "Pedido de informações sobre matrículas (site)",
      email: String(data.get("email") ?? ""),
      message: "Deixou o e-mail para receber informações sobre matrículas.",
      botcheck: String(data.get("botcheck") ?? ""),
    });
    if (result.ok) {
      trackLead("email");
      setStatus({ kind: "ok" });
      form.reset();
    } else {
      setStatus({ kind: "error", text: result.error });
    }
  }

  const sending = status.kind === "sending";
  return (
    <>
      <form className={kind === "inspair" ? "footer-form wow fadeInUp" : "footer-form"} data-wow-delay=".4s" onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Digite seu e-mail" aria-label="Seu e-mail" required />
        <input type="text" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {kind === "inspair" ? (
          <button type="submit" className="white d-flex align-content-center gap-2" disabled={sending}>
            {sending ? "Enviando..." : "Enviar"}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          <button type="submit" aria-label="Enviar e-mail" disabled={sending}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        )}
      </form>
      <p className={status.kind === "ok" ? "form-message success" : status.kind === "error" ? "form-message error" : "form-message"} role="status" aria-live="polite">
        {status.kind === "ok" && "Recebemos seu e-mail! Em breve entraremos em contato."}
        {status.kind === "error" && status.text}
      </p>
    </>
  );
}
