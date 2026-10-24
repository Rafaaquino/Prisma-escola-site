// Publica o site no GitHub Pages pela branch `gh-pages`.
//
//   npm run deploy                     MODO REVISÃO (padrão): https://<usuario>.github.io/<repositorio>/
//                                      com noindex, robots.txt bloqueando tudo e SEM rastreamento (para a escola conferir)
//   npm run deploy -- --producao       MODO PRODUÇÃO: domínio próprio (www.prismaescola.com.br), indexação liberada,
//                                      grava o arquivo CNAME. Só use depois de o DNS estar pronto (docs/plano-implementacao.md §8)
//   npm run deploy -- --simular        faz tudo (build, checagens, commit temporário) e um `git push --dry-run`: NADA é publicado
//   npm run deploy -- --sem-checagens  pula check:urls e check:seo (não recomendado)
//   npm run deploy -- --sim            não pede confirmação no modo produção
//
// O que faz: 1) build; 2) check:urls e check:seo (para se algo estiver errado); 3) copia build/client para uma pasta
// temporária, cria um único commit novo e o envia à branch gh-pages (force push SÓ nessa branch, que é só de publicação;
// a main nunca é tocada). Usa o `git` da sua máquina, então o login do GitHub é o que já está configurado nele.
//
// No GitHub: Settings → Pages → Source: "Deploy from a branch" → Branch: gh-pages, pasta / (root).
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const flags = new Set(process.argv.slice(2));
const PRODUCAO = flags.has("--producao");
const SIMULAR = flags.has("--simular");
const SEM_CHECAGENS = flags.has("--sem-checagens");
const SIM = flags.has("--sim");
const DOMINIO = process.env.DEPLOY_DOMAIN ?? "www.prismaescola.com.br";
const BRANCH = "gh-pages";

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};
const step = (msg) => console.log(`\n▶ ${msg}`);

/** Roda `npm run <script>` mostrando a saída; encerra o script se falhar. Usa o próprio npm que chamou este script (sem shell). */
function npmRun(script, env) {
  const npmCli = process.env.npm_execpath;
  const r = npmCli?.endsWith(".js")
    ? spawnSync(process.execPath, [npmCli, "run", script], { cwd: root, env, stdio: "inherit" })
    : spawnSync("npm", ["run", script], { cwd: root, env, stdio: "inherit", shell: process.platform === "win32" }); // rodado direto com `node scripts/deploy.mjs`
  if (r.status !== 0) fail(`"npm run ${script}" falhou (código ${r.status}). Nada foi publicado.`);
}

/** Roda o git e devolve a saída (texto), ou null se o comando falhar (ex.: `git config` sem valor, repositório sem commits). */
function gitTry(args, cwd = root, { inherit = false } = {}) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", stdio: inherit ? ["ignore", "inherit", "inherit"] : "pipe" });
  return r.status === 0 ? (r.stdout ?? "").trim() : null;
}

/** Igual a gitTry, mas encerra o script se o comando falhar. */
function git(args, cwd = root, opts) {
  const out = gitTry(args, cwd, opts);
  if (out === null) fail(`o comando "git ${args.join(" ")}" falhou. Nada foi publicado.`);
  return out;
}

// ---- repositório de destino (o remoto "origin")
const remoteUrl = gitTry(["remote", "get-url", "origin"]);
if (!remoteUrl) fail('Este projeto não tem remoto "origin". Rode: git remote add origin https://github.com/USUARIO/REPOSITORIO.git');
const m = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/i);
if (!m) fail(`O remoto "origin" não parece ser do GitHub: ${remoteUrl}`);
const [, owner, repo] = m;

const siteUrl = PRODUCAO ? `https://${DOMINIO}/` : `https://${owner.toLowerCase()}.github.io/${repo}/`;
console.log(`Modo: ${PRODUCAO ? "PRODUÇÃO (indexação liberada, domínio " + DOMINIO + ")" : "REVISÃO (noindex, sem rastreamento)"}${SIMULAR ? "  [SIMULAÇÃO: nada será publicado]" : ""}`);
console.log(`Destino: ${remoteUrl} → branch ${BRANCH}`);
console.log(`Endereço do site: ${siteUrl}`);

const sujo = git(["status", "--porcelain"]);
if (sujo) console.log(`\n⚠ Há ${sujo.split("\n").length} arquivo(s) com alterações não commitadas. O deploy usa o que está no disco agora.`);

if (PRODUCAO && !SIMULAR && !SIM) {
  if (!process.stdin.isTTY) fail("No modo produção é preciso confirmar. Rode num terminal, ou acrescente --sim.");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const resp = await rl.question(`\nIsto publica o site em PRODUÇÃO, com indexação liberada e CNAME ${DOMINIO}.\nO DNS já aponta para o GitHub Pages? Digite SIM para continuar: `);
  rl.close();
  if (resp.trim().toUpperCase() !== "SIM") fail("Cancelado.");
}

// ---- 1) build, com as variáveis do modo escolhido
const env = { ...process.env, VITE_SITE_URL: process.env.VITE_SITE_URL ?? `https://${DOMINIO}` };
if (PRODUCAO) {
  env.VITE_ALLOW_INDEXING = "true";
  delete env.BASE_PATH;
} else {
  delete env.VITE_ALLOW_INDEXING;
  env.BASE_PATH = `/${repo}/`;
}
step("1/3  Gerando o site (npm run build)");
npmRun("build", env);
const out = join(root, "build", "client");
if (!existsSync(join(out, "index.html"))) fail("build/client/index.html não existe depois do build.");

// ---- 2) checagens
if (SEM_CHECAGENS) console.log("\n⚠ Checagens puladas (--sem-checagens).");
else {
  step("2/3  Conferindo URLs, redirecionamentos e SEO");
  npmRun("check:urls", env);
  npmRun("check:seo", env);
}

// ---- 3) publicar na branch gh-pages (commit novo e único, numa pasta temporária)
step(`3/3  ${SIMULAR ? "Simulando o envio" : "Enviando"} para a branch ${BRANCH}`);
const sha = gitTry(["rev-parse", "--short", "HEAD"]) || "sem-commit";
const quando = new Date().toISOString().replace("T", " ").slice(0, 16);
const mensagem = `Deploy ${PRODUCAO ? "produção" : "revisão"} · ${quando} UTC · origem ${sha}${sujo ? " (+ alterações locais)" : ""}`;
const autor = { name: gitTry(["config", "user.name"]) || "Deploy", email: gitTry(["config", "user.email"]) || "deploy@users.noreply.github.com" };

const tmp = mkdtempSync(join(tmpdir(), "prisma-ghpages-"));
try {
  cpSync(out, tmp, { recursive: true });
  writeFileSync(join(tmp, ".nojekyll"), ""); // o Pages não passa o site pelo Jekyll (que ignora pastas/arquivos com "_")
  if (PRODUCAO) writeFileSync(join(tmp, "CNAME"), `${DOMINIO}\n`);
  git(["init", "-q", "-b", BRANCH], tmp);
  git(["add", "-A"], tmp);
  git(["-c", `user.name=${autor.name}`, "-c", `user.email=${autor.email}`, "commit", "-q", "-m", mensagem], tmp);
  const arquivos = git(["ls-files"], tmp).split("\n").length;
  console.log(`Commit temporário com ${arquivos} arquivos: ${mensagem}`);
  git(["push", "--force", ...(SIMULAR ? ["--dry-run"] : []), remoteUrl, `HEAD:refs/heads/${BRANCH}`], tmp, { inherit: true });
} finally {
  try {
    rmSync(tmp, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    /* pasta temporária do sistema; se não apagar agora, o sistema limpa depois */
  }
}

if (SIMULAR) {
  console.log("\n✔ Simulação concluída: build e checagens passaram e o git aceitaria o envio. Nada foi publicado.");
} else {
  console.log(`\n✔ Publicado na branch ${BRANCH}.`);
  console.log(`  Primeira vez? Em https://github.com/${owner}/${repo}/settings/pages escolha:`);
  console.log(`  Source = "Deploy from a branch"  ·  Branch = ${BRANCH}  ·  pasta = / (root).`);
  console.log(`  O site aparece em ${siteUrl} em 1 a 2 minutos${PRODUCAO ? " (com o DNS apontado e o HTTPS ativado em Settings → Pages)" : ""}.`);
}
