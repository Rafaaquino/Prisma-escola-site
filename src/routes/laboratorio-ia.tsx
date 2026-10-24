import { useRef, useState, type ReactNode } from "react";
import type { LinksFunction } from "react-router";
import { PageBanner } from "../components/PageBanner";
import { GRADES, SITUATIONS, type Block, type GradeNumber } from "../content/ia-lab";
import { asset } from "../lib/assets";
import { buildMeta } from "../lib/seo";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: asset("css/ia-lab.min.css") }];

export function meta() {
  return buildMeta({
    title: "Laboratório de Inteligência Artificial",
    description:
      "Atividade de Pensamento Computacional da Prisma Escola para o 6º ao 9º ano: dados, nuvem, prompts seguros, vieses de IA e verificação de informações.",
    path: "/laboratorio-de-inteligencia-artificial/",
  });
}

interface Result {
  nome: string;
  turma: string;
  score: number;
  total: number;
  pct: number;
  s7?: number;
  date: string;
}

const SAFETY = [
  { value: "seguro", label: "Seguro" },
  { value: "cuidado", label: "Cuidado" },
  { value: "perigoso", label: "Perigoso" },
];

function Field({ block }: { block: Extract<Block, { kind: "field" }> }) {
  const { id, label, input = "textarea", placeholder, options } = block;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {input === "textarea" && <textarea id={id} placeholder={placeholder}></textarea>}
      {input === "input" && <input id={id} placeholder={placeholder} />}
      {input === "select" && (
        <select id={id} defaultValue="">
          <option value="">Selecione</option>
          {options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </>
  );
}

function BlockView({ block }: { block: Block }): ReactNode {
  switch (block.kind) {
    case "p":
      return <p>{block.content}</p>;
    case "example":
      return <div className="ia-example">{block.content}</div>;
    case "choice":
      return (
        <div className="ia-grid">
          {block.options.map((o) => (
            <label key={o} className="ia-scenario">
              <input type="radio" name={block.name} value={o} /> {o}
            </label>
          ))}
        </div>
      );
    case "scenarios":
      return (
        <div className="ia-grid">
          {block.items.map((s, i) => (
            <div key={s} className="ia-scenario">
              <b>Situação {i + 1}</b>
              <br />
              {s}
            </div>
          ))}
        </div>
      );
    case "badges":
      return (
        <p>
          {block.items.map((b) => (
            <span key={b} className="ia-badge">
              {b}
            </span>
          ))}
        </p>
      );
    case "situations":
      return (
        <div>
          {SITUATIONS.map((s, i) => (
            <div key={s.text} className="ia-question">
              <p>
                {i + 1}. {s.text}
              </p>
              {SAFETY.map((o) => (
                <label key={o.value} className="ia-option">
                  <input type="radio" name={`s7_${i}`} value={o.value} /> {o.label}
                </label>
              ))}
              <label htmlFor={`s7why_${i}`}>Por quê?</label>
              <textarea id={`s7why_${i}`}></textarea>
            </div>
          ))}
        </div>
      );
    case "field":
      return <Field block={block} />;
  }
}

// Portado do site antigo (HTML/JS do backup, 09/2026). Mudanças: lógica em React; "Finalizar" mostra um aviso na página em vez de alert();
// o total do 7º ano é 4 (o original dividia sempre por 3 e podia mostrar "4/3"); a data do PDF passou a ser a do dia em que a atividade é finalizada.
export default function LaboratorioIa() {
  const rootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [grade, setGrade] = useState<GradeNumber>(6);
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function showGrade(g: GradeNumber, fromTurmaSelect = false) {
    setGrade(g);
    if (!fromTurmaSelect && (!turma || parseInt(turma, 10) !== g)) setTurma("");
    setResult(null);
    setError("");
  }

  function onTurma(value: string) {
    setTurma(value);
    if (value) showGrade(parseInt(value, 10) as GradeNumber, true);
  }

  const checked = (name: string) => rootRef.current?.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? "";

  function finish() {
    const name = nome.trim();
    if (!name || !turma) {
      setError("Digite seu nome e selecione a turma.");
      return;
    }
    const g = parseInt(turma, 10) as GradeNumber;
    const data = GRADES.find((x) => x.grade === g)!;
    const score = data.objective.filter((o, i) => checked(`q${g}_${i + 1}`) === o.answer).length;
    const total = data.objective.length;
    const s7 = g === 7 ? SITUATIONS.filter((s, i) => checked(`s7_${i}`) === s.answer).length : undefined;
    setError("");
    setResult({ nome: name, turma, score, total, pct: Math.round((score / total) * 100), s7, date: new Date().toLocaleDateString("pt-BR") });
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  const extra = result?.s7 !== undefined ? (
    <>
      {" "}
      Situações práticas corretas: <b>{result.s7}/6</b>.
    </>
  ) : null;

  return (
    <>
      <PageBanner title="Laboratório de Inteligência Artificial" />
      <section className="space-top space-bottom">
        <div className="container">
          <div id="ia-lab" ref={rootRef}>
            <header>
              <h2>Laboratório de Inteligência Artificial</h2>
              <p>Pensamento Computacional • Prisma Escola • 22/09/2026</p>
            </header>
            <div className="ia-main">
              <div id="intro" className="ia-card">
                <h2>Identificação do aluno</h2>
                <label htmlFor="ia-nome">Nome completo</label>
                <input id="ia-nome" placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
                <label htmlFor="ia-turma">Turma</label>
                <select id="ia-turma" value={turma} onChange={(e) => onTurma(e.target.value)}>
                  <option value="">Selecione sua turma</option>
                  {["6º A", "6º B", "7º A", "7º B", "8º A", "8º B", "9º A", "9º B"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <p className="ia-small">Selecione sua turma. A atividade correspondente será exibida.</p>
              </div>

              <div className="ia-tabs no-print" role="tablist" aria-label="Ano">
                {GRADES.map((g) => (
                  <button key={g.grade} type="button" role="tab" aria-selected={g.grade === grade} className={g.grade === grade ? "ia-tab active" : "ia-tab"} onClick={() => showGrade(g.grade)}>
                    {g.grade}º ano
                  </button>
                ))}
              </div>

              {GRADES.map((g) => (
                <section key={g.grade} id={`g${g.grade}`} className={g.grade === grade ? "ia-grade" : "ia-grade hidden"}>
                  <div className="ia-card">
                    <h2>{g.title}</h2>
                    {g.objective.map((o, i) => (
                      <div key={o.text} className="ia-question">
                        <p>
                          {i + 1}. {o.text}
                        </p>
                        {o.options.map((opt) => (
                          <label key={opt.value} className="ia-option">
                            <input type="radio" name={`q${g.grade}_${i + 1}`} value={opt.value} /> {opt.label}
                          </label>
                        ))}
                      </div>
                    ))}
                    {g.open.map((q, j) => (
                      <div key={q.id} className="ia-question">
                        <p>
                          {g.objective.length + j + 1}. {q.text}
                        </p>
                        <textarea id={q.id} aria-label={`Resposta da questão ${g.objective.length + j + 1}`}></textarea>
                      </div>
                    ))}
                  </div>
                  {g.cards.map((card) => (
                    <div key={card.title} className="ia-card">
                      <h2>{card.title}</h2>
                      {card.blocks.map((b, i) => (
                        <BlockView key={i} block={b} />
                      ))}
                    </div>
                  ))}
                </section>
              ))}

              <div className="ia-card ia-actions no-print">
                <button type="button" onClick={finish}>
                  Finalizar atividade
                </button>{" "}
                <button type="button" className="secondary" onClick={() => window.print()}>
                  Imprimir / salvar PDF
                </button>
                {error && (
                  <p role="alert" style={{ color: "#b3261e", fontWeight: "bold", marginTop: 12 }}>
                    {error}
                  </p>
                )}
                <div ref={resultRef} id="resultado" aria-live="polite">
                  {result && (
                    <div className="ia-result">
                      <b>{result.nome}</b>, você acertou <b>{result.score}/{result.total}</b> questões objetivas ({result.pct}%).{extra}
                      <br />
                      <br />
                      Revise também as respostas discursivas e a atividade prática. Para gerar o PDF com nome e turma, clique em <b>Imprimir / salvar PDF</b> e escolha “Salvar como PDF”.
                    </div>
                  )}
                </div>
              </div>

              {/* cabeçalho que só aparece na impressão / PDF */}
              <div className="print-only ia-card" id="cabecalhoPdf">
                {result && (
                  <>
                    <div style={{ borderBottom: "2px solid #18212b", paddingBottom: 12, marginBottom: 18 }}>
                      <p style={{ margin: "0 0 10px", fontSize: 25, fontWeight: "bold" }}>LABORATÓRIO DE INTELIGÊNCIA ARTIFICIAL</p>
                      <p style={{ margin: "4px 0", fontSize: 17 }}>
                        <b>ALUNO:</b> {result.nome}
                      </p>
                      <p style={{ margin: "4px 0", fontSize: 17 }}>
                        <b>TURMA:</b> {result.turma}
                      </p>
                      <p style={{ margin: "4px 0", fontSize: 15 }}>
                        <b>DATA:</b> {result.date}
                      </p>
                    </div>
                    <p>
                      <b>Questões objetivas:</b> {result.score}/{result.total} ({result.pct}%).{extra}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
