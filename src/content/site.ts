/**
 * Dados institucionais usados em cabeçalho, rodapé, contato e SEO (uma única fonte de verdade).
 * Conferir com a escola antes do lançamento: e-mails por unidade, cidade/CEP e URLs das redes sociais.
 */
export interface Unit {
  id: "maraca" | "lilah";
  name: string;
  /** Rótulo curto para listas. */
  short: string;
  address: string;
  /** Exibição, ex.: "(11) 5873-7688". */
  phone: string;
  /** Formato do link `tel:`. */
  tel: string;
  /** Link do WhatsApp (já usado no site antigo). */
  whatsapp: string;
  /** Caminho da página da unidade (mesmo slug do WordPress). */
  path: string;
  /** CEP conferido no cadastro de CNPJ da Receita Federal (alimenta os dados estruturados do Google; sem ele o campo é omitido). */
  postalCode?: string;
}

export const UNITS: Unit[] = [
  {
    id: "maraca",
    name: "Unidade Maracá",
    short: "Jd. Maracá",
    address: "Av. Atos Tomás Ferracciú, 25",
    phone: "(11) 5873-7688",
    tel: "+551158737688",
    whatsapp: "https://wa.me/551158737688?text=Ol%C3%A1%2C%20desejo%20receber%20informa%C3%A7%C3%B5es%21",
    path: "/unidade-1-jd-maraca/",
    postalCode: "05861-020",
  },
  {
    id: "lilah",
    name: "Unidade Lilah",
    short: "Jd. Lilah",
    address: "Rua Costa Nova do Prado, 375",
    phone: "(11) 5870-9906",
    tel: "+551158709906",
    whatsapp: "https://wa.me/551158709906?text=Ol%C3%A1%2C%20desejo%20receber%20informa%C3%A7%C3%B5es%21",
    path: "/unidade-2-jd-lilah/",
    postalCode: "05885-190",
  },
];

/**
 * Pessoa jurídica responsável pelo site (controladora dos dados, para a LGPD). Conferido no cadastro da Receita Federal em 24/10/2026:
 * situação ATIVA, início das atividades em 04/12/1989; matriz = Unidade Maracá (CNPJ final /0001-30) e filial = Unidade Lilah (/0002-10).
 */
export const EMPRESA = {
  razaoSocial: "Prisma Escola de Educação Integral LTDA",
  nomeFantasia: "Escola Prisma",
  cnpj: "61.579.793/0001-30",
};

/** Encarregado pelo tratamento de dados pessoais (DPO, LGPD art. 41): a identidade e o contato precisam ser públicos (Política de Privacidade). */
export const ENCARREGADO = { nome: "WA Coders", email: "contact@wacoders.com" };

/** WhatsApp central de matrículas (ícone flutuante e botões "Matrículas 2027"): +55 11 99252-0541, só dígitos, como o wa.me pede. */
export const WHATSAPP_MATRICULAS = "5511992520541";

/**
 * Horário de atendimento (igual nas duas unidades, conforme o site antigo).
 * `days`/`time` são o texto exibido; `schema` é o mesmo horário em formato de máquina, usado nos dados estruturados do Google.
 */
export const HOURS = [
  { days: "Segunda a quinta", time: "8h às 17h45", schema: { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "17:45" } },
  { days: "Sexta", time: "8h às 16h45", schema: { dayOfWeek: ["Friday"], opens: "08:00", closes: "16:45" } },
];

/** Redes sociais da escola. Facebook informado pela escola em 24/10/2026; Instagram é o mais citado no banco do WordPress (confirmar com a escola). */
export const SOCIAL = {
  facebook: "https://www.facebook.com/prismaescola/",
  instagram: "https://www.instagram.com/prismaescolaoficial",
};

/** E-mail institucional: é o que as páginas das duas unidades mostram na versão mais recente do site antigo (09/2025). */
export const EMAIL = "prismaescola@hotmail.com";

/** Tour virtual 360° (o mesmo para as duas unidades, conforme o site antigo). */
export const TOUR_URL = "https://vila360.com.br/escola/escolaprisma/";

export const TAGLINE = "Educação Infantil e Ensino Fundamental";
