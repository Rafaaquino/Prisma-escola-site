import { Link } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { ServiceDetails } from "../components/ServiceDetails";
import { StaySection } from "../components/StaySection";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Matrículas 2027",
    description:
      "Matrículas 2027 abertas na Prisma Escola: horários de cada etapa, documentos necessários, uniformes e lista de material. Fale com a unidade Maracá ou Lilah.",
    path: "/matriculas/",
  });
}

// Conteúdo da página "Matrículas" do site atual (backup, 2025). A seção "Valores" estava em branco e o texto de início das
// aulas é de 2026: ambos ficam de fora até a escola informar os dados de 2027.
export default function Matriculas() {
  return (
    <>
      <PageBanner title="Matrículas 2027" />
      <ServiceDetails
        title="Matrículas 2027 abertas"
        paragraphs={[
          "Venha conhecer a Prisma Escola e garanta a vaga do seu filho. Veja a seguir os documentos necessários, os horários de cada etapa, o endereço para uniformes e a lista de material.",
          <strong key="docs">Documentos necessários para a matrícula:</strong>,
        ]}
        bulletsLeft={[
          "1 foto 3x4 (recente) do aluno",
          "Certidão de nascimento do aluno (cópia)",
          "RG e CPF do aluno (cópia)",
          "CPF e RG do pai (cópia)",
          "CPF e RG da mãe (cópia)",
        ]}
        bulletsRight={[
          "Comprovante de endereço com CEP (cópia)",
          "Convênio/SUS",
          "Declaração de transferência (para alunos vindos de outra escola)",
          "Carta de anuência",
        ]}
        cards={[
          {
            icon: "aicon/car-icons1.webp",
            title: "Horários: Educação Infantil",
            text: "Manhã: segunda a sexta, das 7h30 às 11h30. Tarde: segunda a quinta, das 13h às 17h; sexta, das 13h às 16h.",
          },
          {
            icon: "aservices/sertd1.webp",
            title: "Horários: Fundamental I (1º ao 5º ano)",
            text: "Manhã: segunda a sexta, das 7h30 às 11h30. Tarde: segunda a quinta, das 13h às 17h20; sexta, das 13h às 16h.",
          },
          {
            icon: "aicon/car-icons5.webp",
            title: "Horários: Fundamental II (6º ao 9º ano)",
            text: "Manhã: segunda a sexta, das 7h às 11h45. Tarde: segunda a quinta, das 13h às 17h45; sexta, das 13h às 16h.",
          },
        ]}
        details={{
          title: "Uniformes e material escolar",
          text: "Veja onde encontrar o uniforme da Prisma Escola e a lista de material do seu filho.",
          list: [
            "Uniformes: RC Confecções, Rua dos Mercantéis, 565 (próximo ao Posto de Saúde do Jardim Lilah)",
            "RC Confecções: telefone 5821-6525",
            "RC Confecções: WhatsApp 98710-9796 (Rosa) e 97992-0243 (Telma)",
            <>
              Lista de material escolar: <Link to="/itagyba/">veja a lista</Link> ou compre na{" "}
              <a href="https://www.livrariaitagyba.com.br/lista-escolar/" target="_blank" rel="noopener noreferrer">
                Livraria Itagyba (abre em nova aba)
              </a>
            </>,
          ],
          img: "aservices/see-all.webp",
        }}
      />
      <StaySection />
    </>
  );
}
