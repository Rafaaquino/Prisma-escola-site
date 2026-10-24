/** Menu principal (mesma estrutura do site antigo). `children` são caminhos de src/content/pages.json. */
export interface NavItem {
  path: string;
  label: string;
  children?: string[];
}

export const NAV: NavItem[] = [
  { path: "/", label: "Home" },
  {
    path: "/institucional/",
    label: "Institucional",
    children: ["/historia/", "/missao-visao-valores/", "/diferenciais-da-escola-adventista/"],
  },
  {
    path: "/ensino/",
    label: "Ensino",
    children: [
      "/educacao-infantil/",
      "/ensino-fundamental-1/",
      "/ensino-fundamental-2/",
      "/integral-semi-integral/",
      "/extra-curriculares/",
      "/ingles/",
      "/pensamento-computacional/",
    ],
  },
  { path: "/unidades/", label: "Unidades", children: ["/unidade-1-jd-maraca/", "/unidade-2-jd-lilah/"] },
  { path: "/infraestrutura/", label: "Infraestrutura" },
  { path: "/matriculas/", label: "Matrículas" },
  { path: "/contato/", label: "Contato" },
];
