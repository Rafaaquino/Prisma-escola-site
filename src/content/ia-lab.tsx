import type { ReactNode } from "react";

/**
 * Conteúdo do Laboratório de Inteligência Artificial (atividade de Pensamento Computacional, 6º ao 9º ano).
 * Textos transcritos da página do site atual (backup do WordPress, 09/2026).
 */
export type GradeNumber = 6 | 7 | 8 | 9;

export interface Objective {
  text: string;
  options: { value: string; label: string }[];
  /** Valor da alternativa correta. */
  answer: string;
}

export type Block =
  | { kind: "p"; content: ReactNode }
  | { kind: "example"; content: ReactNode }
  /** Grupo de alternativas em cartões (só um dispositivo/sistema pode ser escolhido). */
  | { kind: "choice"; name: string; options: string[] }
  /** Situações apenas para ler (sem campo). */
  | { kind: "scenarios"; items: string[] }
  | { kind: "badges"; items: string[] }
  /** 7º ano: classificar cada situação em seguro/cuidado/perigoso e explicar. */
  | { kind: "situations" }
  | { kind: "field"; id: string; label: string; input?: "textarea" | "input" | "select"; placeholder?: string; options?: string[] };

export interface LabCard {
  title: string;
  blocks: Block[];
}

export interface LabGrade {
  grade: GradeNumber;
  title: string;
  objective: Objective[];
  open: { id: string; text: ReactNode }[];
  cards: LabCard[];
}

const abc = (a: string, b: string, c: string) => [
  { value: "A", label: a },
  { value: "B", label: b },
  { value: "C", label: c },
];
const safety = [
  { value: "seguro", label: "Seguro" },
  { value: "cuidado", label: "Cuidado" },
  { value: "perigoso", label: "Perigoso" },
];

/** 7º ano, atividade prática: cada situação e a classificação esperada. */
export const SITUATIONS: { text: string; answer: string }[] = [
  { text: "Pedir à IA uma explicação sobre frações.", answer: "seguro" },
  { text: "Enviar uma foto de um documento pessoal para a IA.", answer: "perigoso" },
  { text: "Pedir uma história sobre um personagem fictício.", answer: "seguro" },
  { text: "Informar uma senha para a IA “guardar”.", answer: "perigoso" },
  { text: "Informar o endereço de um colega para a IA criar uma história.", answer: "perigoso" },
  { text: "Pedir ajuda para estudar para uma prova.", answer: "seguro" },
];

const field = (id: string, label: string, extra: Partial<Extract<Block, { kind: "field" }>> = {}): Block => ({ kind: "field", id, label, ...extra });

export const GRADES: LabGrade[] = [
  {
    grade: 6,
    title: "6º ano • IA, dados, nuvem e IoT",
    objective: [
      {
        text: "O que chamamos de “nuvem” nesse contexto?",
        options: abc("Um espaço físico no céu.", "Recursos e dados acessados por computadores e servidores pela rede.", "Apenas a memória do celular."),
        answer: "B",
      },
      {
        text: "Qual sequência representa melhor a jornada de um dado?",
        options: abc(
          "Resultado → IA → Internet → dispositivo",
          "Dispositivo → Internet → servidor/nuvem → processamento → resultado",
          "Internet → resultado → dispositivo → servidor",
        ),
        answer: "B",
      },
      {
        text: "O que é IoT?",
        options: abc("Objetos conectados à Internet que podem coletar/trocar dados.", "Um tipo de senha.", "Um programa usado apenas para editar fotos."),
        answer: "A",
      },
    ],
    open: [
      { id: "q6_4", text: "Cite um exemplo de dispositivo que pode enviar dados para um sistema de IA." },
      { id: "q6_5", text: "Por que devemos ter cuidado com os dados enviados a serviços de IA?" },
      { id: "q6_6", text: "Explique com suas palavras o que acontece com um dado depois que ele é enviado pela Internet para ser processado." },
    ],
    cards: [
      {
        title: "Atividade prática: A jornada de um dado",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                Você vai escolher <b>um dispositivo diferente do exemplo</b> e acompanhar o caminho de um dado desde o dispositivo até o resultado.
              </>
            ),
          },
          {
            kind: "example",
            content: (
              <>
                <b>Exemplo do professor: geladeira inteligente</b>
                <br />A geladeira possui sensores que identificam a temperatura → envia os dados pela Internet → os dados chegam a um servidor → um sistema analisa a
                temperatura → o sistema pode avisar que a temperatura está muito alta.
                <br />
                <br />
                <b>Agora não escolha a geladeira.</b>
              </>
            ),
          },
          { kind: "p", content: <b>Escolha um:</b> },
          { kind: "choice", name: "device6", options: ["Relógio inteligente", "Câmera de segurança inteligente", "Carro conectado", "Caixa de som inteligente"] },
          field("j6_1", "Que dado esse dispositivo coleta?"),
          field("j6_2", "Como o dado chega ao sistema? (descreva o caminho)", { placeholder: "Dispositivo → Internet → servidor/nuvem → processamento..." }),
          field("j6_3", "O que a IA ou o sistema pode fazer com esse dado?"),
          field("j6_4", "Qual seria um risco se esse dado fosse exposto?"),
        ],
      },
    ],
  },
  {
    grade: 7,
    title: "7º ano • IA, prompts e segurança digital",
    objective: [
      {
        text: "O que é um prompt?",
        options: abc("Uma instrução ou pedido dado a um sistema de IA.", "Um tipo de vírus.", "Uma senha automática."),
        answer: "A",
      },
      {
        text: "Qual prompt apresenta maior risco?",
        options: abc("“Explique o que é energia solar.”", "“Crie uma história sobre um personagem fictício.”", "“Use meu endereço, telefone e senha para criar um texto.”"),
        answer: "C",
      },
      {
        text: "Qual é uma boa regra ao usar IA?",
        options: abc("Compartilhar o máximo possível.", "Compartilhar apenas o necessário e evitar dados pessoais sensíveis.", "Enviar senhas para a IA guardar."),
        answer: "B",
      },
      { text: "Classifique: “Enviar uma foto de um documento pessoal para uma IA.”", options: safety, answer: "perigoso" },
    ],
    open: [
      { id: "q7_5", text: "Reescreva de forma segura: “Crie uma história usando meu nome completo, endereço, telefone e senha.”" },
      { id: "q7_6", text: "Explique por que uma senha nunca deve ser colocada em um prompt." },
    ],
    cards: [
      {
        title: "Atividade prática: Prompt seguro ou perigoso?",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                Leia cada situação. Classifique como <b>SEGURO, CUIDADO ou PERIGOSO</b> e explique sua escolha.
              </>
            ),
          },
          { kind: "scenarios", items: SITUATIONS.map((s) => s.text) },
          { kind: "situations" },
        ],
      },
      {
        title: "Desafio: torne o prompt seguro",
        blocks: [
          {
            kind: "p",
            content: "Escolha uma das situações que você classificou como perigosa e transforme-a em uma solicitação que não revele dados pessoais desnecessários.",
          },
          field("s7choose", "Qual situação você escolheu?", { input: "input" }),
          field("s7safe", "Seu novo prompt seguro"),
          field("s7why", "O que você retirou ou modificou?"),
        ],
      },
    ],
  },
  {
    grade: 8,
    title: "8º ano • IA, dados, padrões e vieses",
    objective: [
      {
        text: "Por que os dados são importantes para sistemas de IA?",
        options: abc(
          "Porque muitos sistemas aprendem padrões a partir de dados.",
          "Porque dados tornam qualquer resposta automaticamente verdadeira.",
          "Porque a IA não precisa de regras ou modelos.",
        ),
        answer: "A",
      },
      {
        text: "O que pode acontecer se os dados de treinamento forem incompletos ou pouco variados?",
        options: abc("Nada.", "O sistema pode apresentar erros ou resultados distorcidos em alguns casos.", "A IA deixa de ser um computador."),
        answer: "B",
      },
      {
        text: "O que significa viés em um sistema de IA?",
        options: abc("Uma tendência sistemática que pode surgir dos dados, regras ou escolhas do sistema.", "Qualquer erro de digitação.", "Uma atualização obrigatória."),
        answer: "A",
      },
    ],
    open: [
      { id: "q8_4", text: "Dê um exemplo de sistema de IA que poderia ser afetado pela qualidade dos dados." },
      { id: "q8_5", text: "Imagine uma IA treinada somente com fotos de cães e gatos. Que problema poderia aparecer ao tentar reconhecer outro animal?" },
      { id: "q8_6", text: "Complete: “Antes de confiar no resultado de uma IA, devemos perguntar...”" },
    ],
    cards: [
      {
        title: "Atividade prática: investigue o sistema",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                Escolha <b>uma</b> situação. Pense nos dados que a IA usaria, em um possível problema nesses dados e no efeito que isso poderia causar.
              </>
            ),
          },
          {
            kind: "choice",
            name: "sys8",
            options: ["Recomendação de filmes", "Reconhecimento de imagens", "Seleção automatizada de candidatos", "Recomendação de notícias"],
          },
          field("a8_1", "Que dados esse sistema poderia usar?"),
          field("a8_2", "Que problema poderia existir nesses dados?"),
          field("a8_3", "Como esse problema poderia afetar o resultado?"),
          field("a8_4", "Que pergunta você faria para investigar melhor esse sistema?"),
        ],
      },
    ],
  },
  {
    grade: 9,
    title: "9º ano • IA, deepfakes e verificação",
    objective: [
      {
        text: "Um conteúdo criado por IA é automaticamente falso?",
        options: abc("Sim, todo conteúdo de IA é falso.", "Não. É preciso analisar o contexto e a finalidade.", "Sim, porque IA não consegue criar nada útil."),
        answer: "B",
      },
      {
        text: "Qual é o objetivo do protocolo CHECK 5?",
        options: abc("Compartilhar notícias rapidamente.", "Investigar autoria, data, fonte, evidências e outras fontes.", "Descobrir somente se uma imagem foi criada por IA."),
        answer: "B",
      },
      {
        text: "“Muita gente compartilhou, então é verdade.” Qual é o problema?",
        options: abc("Compartilhamento não substitui evidência.", "Toda informação compartilhada é verdadeira.", "Redes sociais sempre verificam tudo."),
        answer: "A",
      },
    ],
    open: [
      { id: "q9_4", text: "Para a afirmação “Estudo revela que estudantes que usam IA todos os dias deixam de aprender”, qual seria a primeira coisa a investigar?" },
      { id: "q9_5", text: "Por que “não encontrei provas” não significa necessariamente “é falso”?" },
      { id: "q9_6", text: "Escreva duas perguntas que você faria antes de compartilhar uma notícia suspeita." },
    ],
    cards: [
      {
        title: "Atividade prática: Antes de compartilhar",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                Analise a afirmação abaixo usando o <b>CHECK 5</b>.
              </>
            ),
          },
          {
            kind: "example",
            content: (
              <>
                <b>Afirmação:</b> “Estudo revela que estudantes que usam IA todos os dias deixam de aprender.”
              </>
            ),
          },
          { kind: "badges", items: ["QUEM?", "QUANDO?", "FONTE?", "EVIDÊNCIA?", "OUTRAS FONTES?"] },
          field("c9_1", "QUEM publicou ou divulgou?"),
          field("c9_2", "QUANDO foi publicado?"),
          field("c9_3", "Qual é a FONTE original?"),
          field("c9_4", "Que EVIDÊNCIA existe?"),
          field("c9_5", "Você encontrou OUTRAS FONTES?"),
          field("c9_6", "Conclusão", { input: "select", options: ["Confirmada", "Não confirmada", "Precisa de mais informações"] }),
          field("c9_7", "Justifique sua conclusão"),
        ],
      },
    ],
  },
];
