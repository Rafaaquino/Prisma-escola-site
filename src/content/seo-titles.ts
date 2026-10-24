/**
 * Título que aparece no Google e nas abas do navegador (acrescido de " | Prisma Escola"), por página.
 * Páginas que não estão aqui usam o próprio título (o da faixa de topo). Este mapa NÃO muda o título exibido na página
 * nem o breadcrumb: serve só para a busca. Mantenha cada um com até ~45 caracteres (o Google corta perto de 60 no total).
 * Escreva só o que a página realmente tem.
 */
export const SEO_TITLES: Record<string, string> = {
  "/historia/": "História desde 1989",
  "/institucional/": "Institucional: história, missão e valores",
  "/ensino/": "Ensino: da Educação Infantil ao Fundamental II",
  "/educacao-infantil/": "Educação Infantil, de 2 a 5 anos",
  "/ensino-fundamental-1/": "Ensino Fundamental I (1º ao 5º ano)",
  "/ensino-fundamental-2/": "Ensino Fundamental II (6º ao 9º ano)",
  "/integral-semi-integral/": "Período Integral e Semi-Integral",
  "/extra-curriculares/": "Extracurriculares: música, esporte e línguas",
  "/ingles/": "Inglês bilíngue — English Stars",
  "/pensamento-computacional/": "Mundo Computacional: robótica e programação",
  "/unidades/": "Unidades Maracá e Lilah",
  "/infraestrutura/": "Infraestrutura: quadra coberta, pátio e salas",
  "/matriculas/": "Matrículas 2027: documentos e horários",
  "/contato/": "Contato, endereços e telefones das unidades",
  "/vem-pra-prisma/": "Vem Ser Prisma: faça seu cadastro",
  "/trabalhe-conosco/": "Trabalhe Conosco: envie seu currículo",
  "/atividades/": "Atividades e eventos escolares",
  "/video-aulas/": "Vídeo aulas de matemática",
};
