/** URL de um arquivo em public/assets/ (respeita o caminho-base do build, ex.: /repositorio/ em revisão). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
