import { useState, type FormEvent } from "react";
import { submitForm, type FormPayload } from "../lib/forms/submit";
import { trackLead } from "../lib/tracking";

export interface FieldSpec {
  name: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "checkboxes";
  required?: boolean;
  /** Classe do ícone Font Awesome (campos de uma linha). */
  icon?: string;
  /** Opções (type="checkboxes"). */
  options?: string[];
  /** Título do grupo de opções (type="checkboxes"). */
  legend?: string;
  /** Ocupa metade da largura no desktop. */
  half?: boolean;
  autoComplete?: string;
}

interface DynamicFormProps {
  fields: FieldSpec[];
  /** Nome do formulário para a medição de conversão (GA4 `generate_lead`). */
  formName: string;
  button: string;
  success: string;
  /** Converte os valores digitados no e-mail que será enviado. */
  build: (values: Record<string, string>) => FormPayload;
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; text: string };

/** Formulário no estilo do contact.php do Ascent (mesma marcação), montado a partir de uma lista de campos. */
export function DynamicForm({ fields, formName, button, success, build }: DynamicFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: Record<string, string> = {};
    for (const f of fields) values[f.name] = f.type === "checkboxes" ? data.getAll(f.name).join(", ") : String(data.get(f.name) ?? "").trim();
    setStatus({ kind: "sending" });
    const result = await submitForm({ ...build(values), botcheck: String(data.get("botcheck") ?? "") });
    if (result.ok) {
      trackLead(formName);
      setStatus({ kind: "ok" });
      form.reset();
    } else {
      setStatus({ kind: "error", text: result.error });
    }
  }

  const sending = status.kind === "sending";
  return (
    <form className="row g-lg-4 g-3" onSubmit={onSubmit}>
      {fields.map((f) => {
        if (f.type === "checkboxes") {
          return (
            <div key={f.name} className="col-lg-12">
              <fieldset>
                {f.legend && <legend className="black fw-medium mb-2">{f.legend}</legend>}
                {f.options?.map((o) => (
                  <label key={o} className="d-block pra mb-1">
                    <input type="checkbox" name={f.name} value={o} /> {o}
                  </label>
                ))}
              </fieldset>
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.name} className="col-lg-12 mb-xl-3">
              <div className="comment-grp text-aras position-relative">
                <textarea name={f.name} rows={5} placeholder={f.placeholder} aria-label={f.placeholder} required={f.required}></textarea>
                <span className="enves">
                  <i className="fa-solid fa-envelope"></i>
                </span>
              </div>
            </div>
          );
        }
        return (
          <div key={f.name} className={f.half ? "col-lg-6" : "col-lg-12"}>
            <div className="comment-grp">
              <input type={f.type ?? "text"} name={f.name} placeholder={f.placeholder} aria-label={f.placeholder} required={f.required} autoComplete={f.autoComplete} />
              {f.icon && <i className={f.icon}></i>}
            </div>
          </div>
        );
      })}
      <input type="text" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="comment-btn">
        <button type="submit" className="theme-btn w-100 round100 p2-bg py-3 px-xl-5 px-4" disabled={sending}>
          <span className="white fw-medium">{sending ? "Enviando..." : button}</span>
        </button>
        <p className={status.kind === "ok" ? "form-message success" : status.kind === "error" ? "form-message error" : "form-message"} role="status" aria-live="polite">
          {status.kind === "ok" && success}
          {status.kind === "error" && status.text}
        </p>
      </div>
    </form>
  );
}
