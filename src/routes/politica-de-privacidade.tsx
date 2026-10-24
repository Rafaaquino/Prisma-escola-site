import type { ReactNode } from "react";
import { PageBanner } from "../components/PageBanner";
import { StaySection } from "../components/StaySection";
import { EMAIL, UNITS } from "../content/site";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Política de Privacidade",
    description:
      "Como a Prisma Escola trata os dados pessoais de quem usa este site: cookies, Google Analytics e Pixel da Meta, conforme a LGPD.",
    path: "/politica-de-privacidade/",
  });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-40">
      <h2 className="custom-title black mb-lg-3 mb-2">{title}</h2>
      {children}
    </div>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-30">
      {items.map((item, i) => (
        <li key={i} className="d-flex align-items-start gap-xl-3 gap-2 pra mb-2">
          <i className="fa-solid fa-chevron-right p5-clr mt-2"></i>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

// RASCUNHO: texto-base alinhado à LGPD (Lei nº 13.709/2018). A seção de cookies descreve o funcionamento com AVISO DE COOKIES e consentimento
// prévio (Google Analytics e Pixel da Meta só carregam depois do "aceitar"): o site precisa implementar esse aviso antes de ativar as ferramentas.
// Antes de publicar, a escola deve completar razão social/CNPJ e a indicação do encarregado de dados, e revisar o texto com assessoria jurídica.
export default function PoliticaDePrivacidade() {
  return (
    <>
      <PageBanner title="Política de Privacidade" />
      <section className="service-dtails overflow-hidden section-padding position-relative">
        <div className="container">
          <div className="common-content-box">
            <p className="pra mb-30">Última atualização: 23 de outubro de 2026.</p>

            <Section title="1. Quem somos">
              <p className="pra mb-30">
                Este site é mantido pela Prisma Escola (“Prisma”, “nós”), com unidades em {UNITS[0].address} ({UNITS[0].short}) e {UNITS[1].address} ({UNITS[1].short}).
                Esta política explica como tratamos os dados pessoais de quem usa o site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
              </p>
            </Section>

            <Section title="2. Quais dados coletamos">
              <List
                items={[
                  <>
                    <strong>Dados que você nos envia:</strong> nome, e-mail, telefone ou WhatsApp, unidade de interesse e a mensagem, quando você usa o formulário de
                    contato ou deixa seu e-mail para receber informações. Ao se candidatar a uma vaga, as informações profissionais que você nos enviar.
                  </>,
                  <>
                    <strong>Questionário do WhatsApp:</strong> no botão de WhatsApp do site e nos botões de matrícula, você informa seu nome e o nome e a idade da criança. Essas
                    informações <strong>não são enviadas nem guardadas por este site</strong>: servem apenas para montar a mensagem que você mesmo envia pelo WhatsApp à nossa
                    equipe de matrículas.
                  </>,
                  <>
                    <strong>Dados técnicos de acesso:</strong> como em qualquer site, o provedor de hospedagem pode registrar o endereço IP, o navegador e a data e a hora
                    do acesso, por motivos de segurança e funcionamento.
                  </>,
                  <>
                    <strong>Dados de navegação e de interação</strong>, coletados por cookies e identificadores semelhantes, <strong>somente se você aceitar</strong> (veja a
                    seção 3): páginas visitadas, tempo no site, dispositivo e navegador, origem do acesso, localização aproximada e ações realizadas, como cliques em botões e
                    envio de formulários.
                  </>,
                ]}
              />
            </Section>

            <Section title="3. Cookies, Google Analytics e Pixel da Meta">
              <p className="pra mb-30">
                Usamos ferramentas de terceiros (Google Analytics, Google Ads e Pixel da Meta), <strong>apenas com o seu consentimento</strong>. Elas só são carregadas depois que você aceita no aviso de cookies que
                aparece no site. Se você recusar, o site funciona normalmente.
              </p>
              <List
                items={[
                  <>
                    <strong>Essenciais:</strong> guardam a sua escolha sobre cookies. Não dependem de consentimento.
                  </>,
                  <>
                    <strong>Estatísticas, com o Google Analytics</strong> (Google): mostram como o site é usado (páginas mais vistas, tempo de visita, tipo de dispositivo e
                    origem do acesso), para melhorarmos o conteúdo e a navegação.
                  </>,
                  <>
                    <strong>Marketing, com o Google Ads (remarketing) e o Pixel da Meta</strong> (Facebook e Instagram): registram ações no site, como páginas vistas, cliques e envio de formulários. Usamos essas informações para medir os resultados dos nossos anúncios e para mostrar anúncios da Prisma a pessoas que já visitaram o site. O Google e a Meta podem associar essas informações à sua conta, se você estiver conectado a ela.
                  </>,
                ]}
              />
              <p className="pra mb-30">
                <strong>Como mudar de ideia:</strong> você pode alterar ou retirar o consentimento a qualquer momento pelo link “Preferências de cookies”, no rodapé do site, e
                também pelas configurações do seu navegador. Você ainda pode usar o{" "}
                {ext("https://tools.google.com/dlpage/gaoptout", "complemento de desativação do Google Analytics")} e gerenciar os anúncios que vê nas configurações da sua
                conta da Meta.
              </p>
              <p className="pra mb-30">
                Cada empresa trata os dados conforme a sua própria política: {ext("https://policies.google.com/privacy", "Política de Privacidade do Google")} e{" "}
                {ext("https://www.facebook.com/privacy/policy/", "Política de Privacidade da Meta")}.
              </p>
            </Section>

            <Section title="4. Para que usamos os dados">
              <List
                items={[
                  "Responder ao seu contato e aos pedidos de informação, de visita e de matrícula.",
                  "Processar candidaturas a vagas de trabalho.",
                  "Entender como o site é usado e melhorá-lo (Google Analytics, com consentimento).",
                  "Medir a eficácia dos nossos anúncios e mostrá-los a quem já visitou o site (Google Ads e Pixel da Meta, com consentimento).",
                  "Manter a segurança e o bom funcionamento do site.",
                  "Cumprir obrigações legais e regulatórias.",
                ]}
              />
            </Section>

            <Section title="5. Base legal">
              <p className="pra mb-30">
                Tratamos seus dados com base no seu consentimento (ao enviar um formulário e ao aceitar os cookies de estatística e de marketing), na realização de
                procedimentos preliminares a pedido seu (como informações sobre matrícula), no cumprimento de obrigações legais e no nosso legítimo interesse em manter o site
                seguro.
              </p>
            </Section>

            <Section title="6. Com quem compartilhamos">
              <p className="pra mb-30">Não vendemos dados pessoais. Alguns prestadores de serviço tratam dados em nosso nome ou por conta própria:</p>
              <List
                items={[
                  "Provedor de envio de formulários (atualmente, Web3Forms): entrega a mensagem que você escreve ao e-mail da escola.",
                  "Provedor de hospedagem do site (GitHub Pages).",
                  "Google (Google Analytics e Google Ads, com consentimento, e Google Maps): os mapas das páginas de contato e das unidades são carregados do Google, que pode coletar dados do seu navegador e usar cookies conforme a política dele.",
                  "YouTube (Google): os vídeos só são carregados quando você clica em reproduzir, no modo de privacidade ampliada. A partir daí, valem as regras do YouTube.",
                  "Meta (Pixel do Facebook e do Instagram, com consentimento): recebe informações sobre as suas ações no site e pode utilizá-las conforme a política da Meta.",
                  "WhatsApp (Meta): ao concluir o questionário, a conversa passa a acontecer no WhatsApp e segue os termos e a política de privacidade dele.",
                  "Links para sites de terceiros (tour virtual 360°, sistema escolar, Livraria Itagyba e redes sociais) têm políticas de privacidade próprias.",
                ]}
              />
              <p className="pra mb-30">
                Esses prestadores podem armazenar dados em servidores fora do Brasil, inclusive nos Estados Unidos. Procuramos trabalhar com empresas que adotam medidas de
                proteção compatíveis com a LGPD.
              </p>
            </Section>

            <Section title="7. Por quanto tempo guardamos os dados">
              <p className="pra mb-30">
                Guardamos as informações pelo tempo necessário para atender ao seu pedido e para cumprir obrigações legais. Depois disso, os dados são eliminados ou
                anonimizados. Os dados coletados pelo Google Analytics, pelo Google Ads e pelo Pixel da Meta ficam pelo período definido nas configurações dessas ferramentas.
              </p>
            </Section>

            <Section title="8. Seus direitos">
              <p className="pra mb-30">Você pode, a qualquer momento, solicitar:</p>
              <List
                items={[
                  "a confirmação de que tratamos seus dados e o acesso a eles;",
                  "a correção de dados incompletos, inexatos ou desatualizados;",
                  "a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei;",
                  "a portabilidade dos dados e a informação sobre com quem os compartilhamos;",
                  "a revogação do consentimento, quando o tratamento se basear nele.",
                ]}
              />
            </Section>

            <Section title="9. Crianças e adolescentes">
              <p className="pra mb-30">
                O site é destinado a pais e responsáveis. Não coletamos intencionalmente dados de crianças e adolescentes por meio do site (o nome e a idade da criança
                informados no questionário do WhatsApp são digitados pelo responsável, seguem só na mensagem dele e servem para responder sobre vagas), e não direcionamos
                anúncios a menores de idade. Os dados dos alunos são tratados no processo de matrícula, com o consentimento de pelo menos um dos pais ou do responsável legal.
              </p>
            </Section>

            <Section title="10. Segurança">
              <p className="pra mb-30">
                Adotamos medidas razoáveis para proteger os dados, como o uso de conexão segura (HTTPS). Nenhum método de transmissão ou de armazenamento é totalmente livre de
                riscos, e por isso não podemos garantir segurança absoluta.
              </p>
            </Section>

            <Section title="11. Alterações nesta política">
              <p className="pra mb-30">Podemos atualizar esta política. A data da última atualização fica sempre no topo desta página.</p>
            </Section>

            <Section title="12. Fale com a gente">
              <p className="pra mb-30">
                Para exercer seus direitos ou tirar dúvidas sobre esta política, escreva para <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou ligue para a unidade Maracá,{" "}
                <a href={`tel:${UNITS[0].tel}`}>{UNITS[0].phone}</a>, ou para a unidade Lilah, <a href={`tel:${UNITS[1].tel}`}>{UNITS[1].phone}</a>.
              </p>
            </Section>
          </div>
        </div>
      </section>
      <StaySection />
    </>
  );
}
