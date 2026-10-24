import type { ReactNode } from "react";
import { Link } from "react-router";
import type { ServiceDetailsProps } from "../components/ServiceDetails";
import { asset } from "../lib/assets";

/** Páginas de conteúdo no layout `service-details` do Ascent. Textos conforme o site atual (backup do WordPress, 2025). */
export interface ContentPageData {
  title: string;
  /** Meta description (≈155 caracteres). */
  description: string;
  details: ServiceDetailsProps;
}

/** Botão do template (theme-btn) para links externos. */
const ext = (href: string, label: string): ReactNode => (
  <a href={href} className="theme-btn p4-bg" target="_blank" rel="noopener noreferrer">
    <span>
      {label}
      <span className="visually-hidden"> (abre em nova aba)</span>
    </span>
  </a>
);

// Portal escolar (SVI): mesmos links do site antigo (colégio 02695 = Maracá, 02704 = Lilah).
const SVI = "http://www.svi.com.br/aeweb";

/** Lista simples de eventos dentro de um cartão. */
const events = (items: string[]): ReactNode => (
  <ul style={{ listStyle: "disc", paddingLeft: "1.1rem", textAlign: "left" }}>
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

/** Link para um PDF guardado no próprio site (copiado do backup do WordPress). */
const pdf = (file: string, label: string): ReactNode => (
  <a href={asset(`docs/proposta-pedagogica/${file}`)} target="_blank" rel="noopener noreferrer">
    {label} (PDF<span className="visually-hidden">, abre em nova aba</span>)
  </a>
);

const HERO = "aservices/details-big1.webp";
const MIDDLE = ["aservices/details-middle1.webp", "aservices/details-middle2.webp", "aservices/details-middle3.webp"];
const SIDE = "aservices/see-all.webp";

export const CONTENT_PAGES: Record<string, ContentPageData> = {
  "/educacao-infantil/": {
    title: "Educação Infantil",
    description:
      "Educação Infantil na Prisma Escola, de 2 a 5 anos: Maternal, Jardim e Pré-escola, com foco em coordenação motora, oralidade, autonomia e convivência.",
    details: {
      heroImg: HERO,
      title: "Descubra o caminho do aprendizado, do Maternal à Pré-escola",
      paragraphs: [
        "Na Prisma Escola, cada etapa da Educação Infantil, dos 2 aos 5 anos, é uma jornada emocionante de aprendizado que prepara nossos alunos para um futuro brilhante.",
        "Junte-se a nós e acompanhe o crescimento e a educação de seus filhos em todas as fases importantes da vida deles.",
      ],
      bulletsLeft: ["Desenvolvimento da coordenação motora ampla e fina", "Estímulo à oralidade e ampliação do vocabulário"],
      bulletsRight: ["Reconhecimento de cores e formas geométricas", "Higiene, autonomia e convivência em grupo"],
      middleImgs: MIDDLE,
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Maternal",
          text: "Coordenação motora ampla e fina, oralidade, cores e formas, partes do corpo, higiene, autonomia e as primeiras interações sociais.",
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Jardim",
          text: "Recorte, colagem e montagem, noções de igual/diferente e estreito/largo, vogais e escrita, orientação no espaço e no tempo, sentidos e números.",
        },
        {
          icon: "aicon/car-icons5.webp",
          title: "Pré-escola",
          text: "Escrita das sílabas, raciocínio lógico, hábitos de vida saudável, experiências com leis naturais e físicas, inglês e noções de informática.",
        },
      ],
      details: {
        title: "Pré-escola: a preparação para o Ensino Fundamental",
        text: "Na Pré-escola, as crianças avançam para a escrita das sílabas maiúsculas e minúsculas, ampliam o vocabulário e desenvolvem a capacidade de analisar, relacionar, comparar, classificar, ordenar e criar, por meio do raciocínio lógico.",
        list: [
          "Integração com a família, a escola e a sociedade",
          "Celebração e importância das datas comemorativas",
          "Hábitos de vida saudável: higiene, alimentação, recreação e repouso",
          "Início do estudo da língua inglesa e noções de informática",
        ],
        img: SIDE,
      },
    },
  },

  "/ensino-fundamental-1/": {
    title: "Ensino Fundamental I",
    description:
      "Ensino Fundamental Anos Iniciais (1º ao 5º ano) na Prisma Escola: leitura, escrita, comunicação, pensamento crítico e consciência global.",
    details: {
      heroImg: HERO,
      title: "Descubra um mundo de aprendizado excepcional (1º ao 5º ano)",
      paragraphs: [
        "Na Prisma Escola, nosso compromisso é nutrir o potencial infinito de cada aluno, oferecendo um ambiente educacional inspirador e inovador. Somos mais do que uma escola: somos o lugar onde os sonhos se transformam em realidade e onde o conhecimento se torna o trampolim para um futuro brilhante.",
      ],
      bulletsLeft: ["Excelência acadêmica: leitura, escrita e pensamento crítico", "Comunicação eficaz, oral e escrita"],
      bulletsRight: ["Consciência global: saúde, alimentação e preservação da natureza", "Pensamento crítico e prático: matemática e pensamento computacional"],
      middleImgs: MIDDLE,
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Excelência Acadêmica",
          text: "Desenvolvemos habilidades de leitura, escrita e pensamento crítico, com uma abordagem que abrange a linguagem verbal e a não-verbal.",
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Comunicação Eficaz",
          text: "Valorizamos a capacidade de expressar sentimentos, ideias, opiniões e experiências, formando comunicadores confiantes.",
        },
        {
          icon: "aicon/car-icons5.webp",
          title: "Consciência Global",
          text: "Exploramos higiene, saúde, alimentação e preservação da natureza, destacando a relação entre o ser humano e o meio ambiente.",
        },
      ],
      details: {
        title: "Educação abrangente: o aprendizado vai além da sala de aula",
        text: "Oferecemos uma educação completa, que enriquece a cultura pessoal dos alunos em todas as disciplinas.",
        list: [
          "Matemática e pensamento computacional para resolver desafios do mundo real",
          "Raciocínio lógico que acompanha o aluno por toda a vida",
          "Habilidades e conhecimentos para enfrentar desafios e oportunidades com confiança",
          "Faça parte da Família Prisma: visite a escola e veja como podemos transformar o futuro do seu filho",
        ],
        img: SIDE,
      },
    },
  },

  "/ensino-fundamental-2/": {
    title: "Ensino Fundamental II",
    description:
      "Ensino Fundamental Anos Finais (6º ao 9º ano) na Prisma Escola: formação de jovens autoconfiantes, criativos e participativos, com desenvolvimento integral.",
    details: {
      heroImg: HERO,
      title: "Preparando jovens para o futuro (6º ao 9º ano)",
      paragraphs: [
        "Os Anos Finais são uma fase crucial na transição da idade juvenil para a adolescência. Nosso objetivo principal é formar indivíduos autoconfiantes, criativos e participativos, capacitados para atuar com competência, senso crítico, dignidade e responsabilidade em nossa sociedade em constante transformação.",
        "Nossa missão central é cuidar do desenvolvimento integral do aluno, em um ambiente onde ele se sinta valorizado e consciente de todas as oportunidades que a vida tem a oferecer, capacitando-o a fazer escolhas alinhadas com seus objetivos pessoais.",
      ],
      bulletsLeft: ["Indivíduos autoconfiantes, criativos e participativos", "Competência, senso crítico, dignidade e responsabilidade"],
      bulletsRight: ["Desenvolvimento integral: físico, moral, mental e espiritual", "Equipe qualificada e em constante aprimoramento"],
      middleImgs: MIDDLE,
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Desenvolvimento integral",
          text: "Cuidamos do aluno como um todo, valorizando suas aptidões físicas, morais, mentais e espirituais.",
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Base pedagógica",
          text: "Nossa abordagem é fundamentada nas teorias de renomados educadores, como Vigotsky, Wallon e Piaget.",
        },
        {
          icon: "aicon/car-icons5.webp",
          title: "Equipe comprometida",
          text: "Profissionais altamente qualificados, que continuam buscando aprimoramento para oferecer uma educação de qualidade.",
        },
      ],
      details: {
        title: "Uma educação que vai além de um programa de estudos",
        text: "Encontramos inspiração nas orientações da educadora Ellen G. White: “a verdadeira educação vai além de um mero programa de estudos. Ela abrange o desenvolvimento harmônico de todas as dimensões: física, moral, mental e espiritual. Ensinamos o amor e o respeito por Deus, preparando nossos alunos para cumprirem com integridade seus deveres na vida.”",
        list: [
          "Cada aluno é uma estrela em ascensão, pronta para brilhar em um mundo de possibilidades",
          "Jovens preparados para se tornarem líderes do futuro",
          "Escolhas alinhadas aos objetivos pessoais de cada aluno",
          "Aprimoramento constante da equipe de profissionais",
        ],
        img: SIDE,
      },
    },
  },

  "/integral-semi-integral/": {
    title: "Integral e Semi-Integral",
    description:
      "Período semi-integral ou integral na Prisma Escola, do maternal ao 2º ano: ambiente seguro, almoço variado, descanso e atividades recreativas.",
    details: {
      heroImg: HERO,
      title: "Opções de período estendido na Prisma Escola",
      paragraphs: [
        "Na Prisma Escola, compreendemos as necessidades dos pais e oferecemos opções de período semi-integral ou integral para alunos do maternal ao 2º ano.",
      ],
      bulletsLeft: ["Conforto e tranquilidade para a família", "Equilíbrio entre aprendizado e recreação"],
      bulletsRight: ["Alimentação saudável e variada", "Tempo para descanso"],
      middleImgs: MIDDLE,
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Conforto e Tranquilidade",
          text: "Um ambiente seguro para os filhos durante todo o dia ou parte dele, para que você realize seus compromissos, como trabalho e estudo, com total tranquilidade.",
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Aprendizado e Recreação",
          text: "As atividades equilibram o tempo de aulas com o tempo dedicado aos deveres de casa e às atividades recreativas.",
        },
        {
          icon: "aicon/car-icons5.webp",
          title: "Alimentação Saudável",
          text: "Um delicioso almoço, com cardápio variado, garante refeições nutritivas enquanto as crianças estão conosco.",
        },
      ],
      details: {
        title: "Tempo para descanso",
        text: "Após as atividades da manhã, reservamos um horário especial para que as crianças desfrutem de um descanso tranquilo e recarreguem as energias para o restante do dia.",
        list: [
          "Período semi-integral ou integral, do maternal ao 2º ano",
          "Almoço com cardápio variado",
          "Horário reservado para o descanso",
          "Deveres de casa e atividades recreativas",
        ],
        img: SIDE,
      },
    },
  },

  "/extra-curriculares/": {
    title: "Extracurriculares",
    description:
      "Cursos extracurriculares na Prisma Escola: música, esporte e aprendizado de línguas, dentro da escola, com conforto e segurança.",
    details: {
      heroImg: HERO,
      title: "Música, esporte e o aprendizado de línguas",
      paragraphs: [
        "A Prisma Escola oferece a seus alunos de diferentes faixas etárias diversos cursos extracurriculares, que têm como objetivo favorecer o desenvolvimento de habilidades esportivas, corporais, artísticas, linguísticas e culturais, de forma progressiva e diferenciada, formando pessoas autônomas e críticas.",
        "Todas as aulas são praticadas dentro do ambiente do colégio, com muito conforto e segurança. Entre em contato conosco para conhecer as modalidades disponíveis para cada faixa etária!",
      ],
      bulletsLeft: ["Habilidades esportivas e corporais", "Habilidades artísticas e culturais"],
      bulletsRight: ["Habilidades linguísticas", "Aulas dentro da escola, com conforto e segurança"],
      cards: [
        { icon: "aicon/car-icons1.webp", title: "Música", text: "Desenvolvimento de habilidades artísticas e culturais, de forma progressiva e diferenciada." },
        { icon: "aservices/sertd1.webp", title: "Esporte", text: "Desenvolvimento de habilidades esportivas e corporais, para cada faixa etária." },
        { icon: "aicon/car-icons5.webp", title: "Línguas", text: "Aprendizado de línguas que forma pessoas autônomas e críticas." },
      ],
    },
  },

  "/ingles/": {
    title: "Inglês — English Stars",
    description:
      "Formação bilíngue na Prisma Escola com o programa English Stars: aulas totalmente em inglês, da Educação Infantil aos Anos Finais, com abordagem CLIL.",
    details: {
      heroImg: HERO,
      title: "English Stars: formação bilíngue efetiva",
      paragraphs: [
        "A missão do English Stars é levar uma formação bilíngue efetiva para o maior número possível de crianças, desenvolvendo competências para que elas possam estar preparadas para o futuro.",
        "O programa, que vai da Educação Infantil até os Anos Finais do Ensino Fundamental, propõe a formação bilíngue explorando a abordagem CLIL. A metodologia Stars tem como objetivo fornecer aos estudantes um ensino de inglês de qualidade, que proporcione o desenvolvimento das competências do século 21 apontadas pela Base Nacional Comum Curricular (BNCC).",
      ],
      bulletsLeft: ["Da Educação Infantil aos Anos Finais", "Abordagem CLIL"],
      bulletsRight: ["Todas as aulas ministradas totalmente em inglês", "Competências do século 21 (BNCC)"],
      middleImgs: MIDDLE,
      cards: [
        { icon: "aicon/car-icons1.webp", title: "Imersão", text: "Todas as aulas são ministradas totalmente em inglês, o que possibilita uma maior imersão no idioma." },
        { icon: "aservices/sertd1.webp", title: "Quatro habilidades", text: "Escuta, fala, escrita e leitura são trabalhadas de forma integral." },
        { icon: "aicon/car-icons5.webp", title: "Século 21", text: "Desenvolvimento das competências do século 21 apontadas pela BNCC." },
      ],
    },
  },

  "/missao-visao-valores/": {
    title: "Missão, Visão e Valores",
    description:
      "Missão, visão e valores da Prisma Escola: educação básica de qualidade, inspirada nos valores cristãos, com excelência acadêmica, humana e espiritual.",
    details: {
      heroImg: HERO,
      title: "Nossa missão, visão e valores",
      paragraphs: [
        "A Prisma Escola promove uma educação inspirada em valores cristãos, que busca o desenvolvimento máximo das potencialidades de cada aluno e a formação de uma sociedade justa, fraterna e sustentável.",
      ],
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Missão",
          text: "Promover Educação Básica de qualidade, inspirada nos valores cristãos, promovendo o desenvolvimento máximo das potencialidades físicas, mentais, emocionais e espirituais, visando a formação de uma sociedade justa, fraterna e sustentável.",
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Visão",
          text: "Ser referência na Educação Básica pela excelência na formação acadêmica, humana e espiritual.",
        },
        {
          icon: "aicon/car-icons5.webp",
          title: "Valores",
          text: "Cinco valores orientam a nossa prática educativa e o nosso convívio. Conheça cada um deles logo abaixo.",
        },
      ],
      details: {
        title: "Nossos valores",
        list: [
          "A fé em Deus sem distinção de religião",
          "O cuidado reverente com a vida em todas as suas manifestações",
          "A construção e o cultivo da Paz e do Bem",
          "O respeito pelo próximo e pelo diferente",
          "A perseverança e dedicação na aquisição da excelência acadêmica e humana",
        ],
        img: SIDE,
      },
    },
  },

  "/diferenciais-da-escola-adventista/": {
    title: "Diferenciais da Escola Adventista",
    description:
      "Por que escolher uma escola confessional adventista: valores, resultados reconhecidos e o diferencial do ensino cristão na formação dos alunos.",
    details: {
      heroImg: HERO,
      title: "Nosso diferencial",
      paragraphs: [
        "O ensino confessional chegou ao Brasil com os jesuítas e as demais ordens religiosas. Durante grande parte da nossa história educacional, a religião católica norteou os princípios pedagógicos como forma de perpetuação da fé e formação dos indivíduos. Com a Proclamação da República, há a separação entre Estado e Igreja. A escola passa então a ser uma instituição laica, tendo o ensino religioso facultativo decretado em 30 de abril de 1931. Permite, mas não obriga, o que nos parece justo.",
        "Em matéria publicada em uma revista de educação no país, os colégios que já aparecem entre os melhores do Brasil nos rankings de ensino e crescimento, segundo o Ministério da Educação (MEC), são os confessionais protestantes e, dentro deste grupo, os adventistas. É interessante notar o quão inusitado pode ser esta afirmação, tendo em vista que estamos em pleno século XXI, quando a laicização escolar é constitucionalmente instituída.",
        <em key="quote">
          “O trabalho revela que, no mesmo período, crescia um outro tipo de escola religiosa: os colégios adventistas, egressos de um ramo protestante dos mais
          tradicionais da igreja evangélica. O fato chamou a atenção dos especialistas. Já são 318 dessas escolas no país, com 37% de alunos a mais do que há dez
          anos... Os especialistas são unânimes em afirmar que um dos fatores que impulsionam essas e outras escolas religiosas que dão certo no Brasil são os
          valores que os pais acreditam estar nelas reunidos.”
        </em>,
      ],
    },
  },

  "/area-dos-professores/": {
    title: "Área dos Professores",
    description:
      "Área dos Professores da Prisma Escola: acesso ao sistema escolar das unidades Maracá e Lilah. Pais e responsáveis acessam o financeiro pelo portal do aluno.",
    details: {
      title: "Acesso ao sistema escolar",
      paragraphs: [
        "Os professores da Prisma Escola acessam o sistema escolar pelo portal da sua unidade. Pais e responsáveis encontram, mais abaixo, o acesso ao financeiro.",
      ],
      cards: [
        { icon: "aicon/car-icons1.webp", title: "Prisma Maracá", text: ext(`${SVI}/professor/default.aspx?colegio=02695`, "Área do professor") },
        { icon: "aservices/sertd1.webp", title: "Prisma Lilah", text: ext(`${SVI}/professor/default.aspx?colegio=02704`, "Área do professor") },
      ],
      after: (
        <div id="financeiro" className="cont-box mt-5">
          <h3 className="black mb-lg-3 mb-2">Financeiro</h3>
          <p className="pra mb-30">Pais e responsáveis acessam o financeiro e as informações do aluno pelo portal da unidade.</p>
          <div className="d-flex flex-wrap gap-3">
            {ext(`${SVI}/aluno/default.aspx?colegio=02695`, "Financeiro: Unidade Maracá")}
            {ext(`${SVI}/aluno/default.aspx?colegio=02704`, "Financeiro: Unidade Lilah")}
          </div>
        </div>
      ),
    },
  },

  "/itagyba/": {
    title: "Lista de Material Escolar",
    description: "Lista de material escolar da Prisma Escola, disponível na Livraria Itagyba. Acesse a lista e faça a compra dos livros e materiais.",
    details: {
      title: "Livros e material escolar",
      paragraphs: [
        "A lista de material escolar da Prisma Escola está disponível na Livraria Itagyba. Clique no botão abaixo para acessar a lista.",
        ext("https://www.livrariaitagyba.com.br/lista-escolar/", "Ver a lista de material na Livraria Itagyba"),
      ],
    },
  },

  "/atividades/": {
    title: "Atividades",
    description:
      "Atividades e eventos da Prisma Escola por etapa de ensino: semanas temáticas, capelas semanais, olimpíadas, gincanas e campeonatos.",
    details: {
      title: "Atividades por etapa de ensino",
      paragraphs: ["Confira as atividades realizadas em cada etapa de ensino da Prisma Escola."],
      cards: [
        {
          icon: "aicon/car-icons1.webp",
          title: "Educação Infantil",
          text: events([
            "Semana da Cortesia",
            "Semana da Páscoa",
            "Semana da Família",
            "Semana da Pátria",
            "Semana da Criança",
            "Capelas Semanais",
            "Olimpíadas, Gincanas e Campeonatos",
          ]),
        },
        {
          icon: "aservices/sertd1.webp",
          title: "Fundamental I",
          text: events([
            "Semana da Cortesia",
            "Semana da Páscoa",
            "Semana da Família",
            "Semana da Pátria",
            "Semana da Criança",
            "Capelas Semanais",
            "Olimpíadas, Gincanas e Campeonatos",
          ]),
        },
        { icon: "aicon/car-icons5.webp", title: "Fundamental II", text: events(["Capelas Semanais", "Gincanas", "Olimpíadas", "Campeonatos"]) },
      ],
    },
  },

  "/proposta-pedagogica/": {
    title: "Proposta Pedagógica",
    description:
      "Proposta pedagógica da Prisma Escola: cronogramas pedagógicos do Fundamental II por turma (arquivo do 2º bimestre de 2019).",
    details: {
      title: "Cronograma pedagógico: Fundamental II",
      paragraphs: ["Arquivo: cronogramas pedagógicos do 2º bimestre de 2019, por turma."],
      details: {
        title: "Cronogramas por turma",
        text: "Abra o PDF da turma do seu filho.",
        list: [
          pdf("cronograma-fundamental-2-2bim-2019.pdf", "Fundamental II: cronograma geral do 2º bimestre"),
          pdf("pp-6a.pdf", "6º Ano A"),
          pdf("pp-6b.pdf", "6º Ano B"),
          pdf("pp-6c.pdf", "6º Ano C"),
          pdf("pp-7a.pdf", "7º Ano A"),
          pdf("pp-7b.pdf", "7º Ano B"),
          pdf("pp-8a.pdf", "8º Ano A"),
          pdf("pp-8b.pdf", "8º Ano B"),
          pdf("pp-9a.pdf", "9º Ano A"),
          pdf("pp-9b.pdf", "9º Ano B"),
        ],
        img: SIDE,
      },
    },
  },

  "/pensamento-computacional/": {
    title: "Mundo Computacional",
    description:
      "Mundo Computacional na Prisma Escola, com a Mind Makers e a Somos Educação: pensamento computacional, programação, robótica e inteligência artificial.",
    details: {
      heroImg: HERO,
      title: "Mundo Computacional: preparando para o futuro",
      paragraphs: [
        "A Prisma Escola, em parceria com a Mind Makers e a Somos Educação, oferece a disciplina inovadora Mundo Computacional, que prepara estudantes da educação básica para enfrentar os desafios do século XXI.",
        "Com os nossos conteúdos, crianças e jovens colocam a mão na massa, explorando ferramentas e conceitos contemporâneos que desenvolvem a criatividade, a autonomia, a liderança, a colaboração e a empatia, entre outras habilidades que tecnologia alguma consegue substituir.",
      ],
      bulletsLeft: ["Abstração, algoritmo, padrões e decomposição", "Situações-problema interdisciplinares"],
      bulletsRight: ["Fundamentos práticos de inteligência artificial", "Circuitos, robótica, dispositivos digitais e Internet das Coisas"],
      middleImgs: MIDDLE,
      cards: [
        { icon: "aicon/car-icons1.webp", title: "Mundo Computacional", text: "Abstração, algoritmo, padrões e decomposição." },
        { icon: "aservices/sertd1.webp", title: "Inteligência Artificial", text: "Fundamentos práticos de uma tecnologia de grande impacto no futuro profissional." },
        { icon: "aicon/car-icons5.webp", title: "Maker", text: "Circuitos eletrônicos, robótica, dispositivos digitais e Internet das Coisas." },
      ],
      details: {
        title: "O que os estudantes aprendem",
        list: [
          "Resolução de problemas: situações-problema interdisciplinares",
          "Code: fundamentos em ciência da computação e linguagens de programação",
          "Projetos: trabalho em equipe, liderança, organização e planejamento",
          "Alinhamento integral com as habilidades e competências da BNCC Computação",
          <>
            Atividade interativa do 6º ao 9º ano: <Link to="/laboratorio-de-inteligencia-artificial/">Laboratório de Inteligência Artificial</Link>
          </>,
        ],
        img: SIDE,
      },
    },
  },
};
