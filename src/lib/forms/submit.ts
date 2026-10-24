/**
 * Envio de formulários. Este é o ÚNICO arquivo que conhece o provedor de e-mail (hoje Web3Forms):
 * para trocar de método no futuro (Formspree, Apps Script, Worker...), basta mudar `submitForm`.
 * A chave (VITE_WEB3FORMS_KEY) é pública por natureza — não coloque nada secreto aqui.
 */
export interface FormPayload {
  subject: string;
  name?: string;
  email?: string;
  phone?: string;
  unit?: string;
  message?: string;
  /** Campo-isca (honeypot): preenchido só por robôs. */
  botcheck?: string;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

const ENDPOINT = "https://api.web3forms.com/submit";

export async function submitForm(payload: FormPayload): Promise<SubmitResult> {
  const { botcheck, ...fields } = payload;
  if (botcheck) return { ok: true }; // robô: finge sucesso e descarta

  const key = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!key) {
    return { ok: false, error: "O envio de mensagens ainda não está ativo. Ligue para a escola ou chame no WhatsApp." };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: key, from_name: "Site da Prisma Escola", ...fields }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (res.ok && data?.success) return { ok: true };
    // o motivo técnico (em inglês, vindo do serviço) fica só no console: o visitante vê uma mensagem em português
    console.error("Web3Forms recusou o envio:", res.status, data?.message);
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes ou chame a escola no WhatsApp." };
  } catch {
    return { ok: false, error: "Sem conexão. Tente novamente ou chame a escola no WhatsApp." };
  }
}
