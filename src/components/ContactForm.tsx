import { useState, type FormEvent } from "react";
import { UNITS } from "../content/site";
import { submitForm } from "../lib/forms/submit";
import { trackLead } from "../lib/tracking";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; text: string };

/** Formulário do contact.php do Ascent (mesma marcação), com os campos da Prisma e envio funcional. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus({ kind: "sending" });
    const unit = String(d.get("unit") ?? "");
    const result = await submitForm({
      subject: `Contato pelo site${unit ? ` — ${unit}` : ""}`,
      name: String(d.get("name") ?? ""),
      email: String(d.get("email") ?? ""),
      phone: String(d.get("phone") ?? ""),
      unit,
      message: String(d.get("message") ?? ""),
      botcheck: String(d.get("botcheck") ?? ""),
    });
    if (result.ok) {
      trackLead("contato");
      setStatus({ kind: "ok" });
      form.reset();
    } else {
      setStatus({ kind: "error", text: result.error });
    }
  }

  const sending = status.kind === "sending";
  return (
    <form className="row g-lg-4 g-3" onSubmit={onSubmit}>
      <div className="col-lg-6">
        <div className="comment-grp">
          <input type="text" name="name" placeholder="Seu nome *" aria-label="Seu nome" required autoComplete="name" />
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="comment-grp">
          <input type="email" name="email" placeholder="Seu e-mail *" aria-label="Seu e-mail" required autoComplete="email" />
          <i className="fa-solid fa-envelope"></i>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="comment-grp">
          <input type="tel" name="phone" placeholder="Telefone / WhatsApp" aria-label="Telefone ou WhatsApp" autoComplete="tel" />
          <i className="fa-solid fa-phone"></i>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="comment-grp">
          <select name="unit" aria-label="Unidade de interesse" defaultValue="">
            <option value="">Unidade de interesse</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-location-dot"></i>
        </div>
      </div>
      <div className="col-lg-12 mb-xl-3">
        <div className="comment-grp text-aras position-relative">
          <textarea name="message" rows={5} placeholder="Escreva sua mensagem *" aria-label="Sua mensagem" required></textarea>
          <span className="enves">
            <i className="fa-solid fa-envelope"></i>
          </span>
        </div>
      </div>
      <input type="text" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="comment-btn">
        <button type="submit" className="theme-btn w-100 round100 p2-bg py-3 px-xl-5 px-4" disabled={sending}>
          <span className="white fw-medium">{sending ? "Enviando..." : "Enviar mensagem"}</span>
        </button>
        <p
          className={status.kind === "ok" ? "form-message success" : status.kind === "error" ? "form-message error" : "form-message"}
          role="status"
          aria-live="polite"
        >
          {status.kind === "ok" && "Mensagem enviada! Retornaremos o contato em breve."}
          {status.kind === "error" && status.text}
        </p>
      </div>
    </form>
  );
}
