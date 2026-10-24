# Prisma Escola — site

React 19 + React Router 8 (modo framework) com pré-renderização estática, para publicar no GitHub Pages.
O visual é o do template **Ascent** (portado do PHP para React); só textos, logo e favicon são da Prisma.
Plano completo (análise, decisões, DNS, pendências): `docs/plano-implementacao.md`, na pasta ao lado deste projeto. Ele, as ferramentas de leitura do backup (`tools/`) e os originais de fotos e PDFs (`referencias/`) ficam **fora deste repositório**; os caminhos `../docs`, `../tools` e `../referencias` neste README apontam para lá.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala dependências |
| `npm run dev` (ou `npm start`) | servidor de desenvolvimento com recarga automática (http://localhost:5173) |
| `npm run serve` | gera o build de produção e o serve **como o GitHub Pages serve** (http://localhost:4173), para ver o resultado final |
| `npm run build` | gera o site estático em `build/client/` (+ `404.html` e redirecionamentos). Antes, roda `npm run css` e `scripts/image-sizes.mjs` sozinho |
| `npm run css` | junta/limpa/minifica o CSS em `public/assets/css/site.min.css` (veja "Desempenho") |
| `npm run optimize:images` | converte PNG/JPG novos de `public/assets/img/` para WebP (`-- --remove` apaga os originais) |
| `npm run preview` | serve o `build/client/` que já existe, como o GitHub Pages serve (http://localhost:4173) |
| `npm run check:urls` | confere se todas as URLs do site antigo existem no build |
| `npm run check:seo` | revisão de SEO do build (veja "SEO") |
| `npm run verify` | `build` + `check:urls` + `check:seo` |
| `npm run typecheck` | gera tipos das rotas e roda o TypeScript |
| `npm run deploy` | **publica no GitHub Pages** (branch `gh-pages`), em modo revisão (veja "Publicar") |
| `npm run deploy:simular` | faz tudo do deploy menos o envio (build, checagens e `git push --dry-run`) |
| `npm run deploy:producao` | publica em produção (domínio próprio, indexação liberada) |

> No Windows, se o `build` falhar com `EBUSY`, pare o `npm run preview` e rode de novo.

## Onde mexer

- **Textos das páginas:** `src/routes/*.tsx` (cada página é um arquivo) e `src/content/` (menu, unidades, telefones, horários).
- **Telefones, endereços, horários, redes sociais:** `src/content/site.ts`.
- **WhatsApp de matrículas** (ícone flutuante + botões "Matrículas 2027" do cabeçalho e do menu lateral): o número é `WHATSAPP_MATRICULAS` em `src/content/site.ts`; o questionário e o texto da mensagem estão em `src/components/WhatsAppWidget.tsx`. Para outro botão abrir o questionário, chame `openWhatsAppForm()` no clique (o link continua levando à página sem JavaScript). Nada é gravado nem enviado pelo site: os dados só vão na mensagem que o visitante envia pelo WhatsApp.
- **Estrutura das páginas** (mesmas classes do Ascent): `src/components/` (Header, Footer, PageBanner, carrosséis, abas, acordeão…).
- **CSS do template:** `styles/` (não editar o CSS do template; acréscimos vão em `styles/prisma-overrides.css`).
- **Fotos reais da escola** (páginas Infraestrutura, das duas Unidades e a galeria da home; o mapa de qual foto vai onde está em `scripts/prep-infra-photos.mjs`, `src/routes/unidade.tsx`, `src/routes/infraestrutura.tsx` e `TABS` em `src/routes/home.tsx`): vieram do backup do site antigo. `scripts/prep-infra-photos.mjs` recorta cada uma na proporção do espaço do template e grava em `public/assets/img/infra/`; os originais ficam em `../referencias/fotos-infraestrutura-originais/` (nome = `<ID do anexo no WordPress>_<arquivo>`). Para trocar uma foto: ponha a nova na pasta, ajuste a linha dela em `PHOTOS` e rode `node scripts/prep-infra-photos.mjs ../referencias/fotos-infraestrutura-originais`. Mais fotos do backup: `../tools/wpress_extract_ids.py`.
- **Imagens do template:** `public/assets/img/` (em WebP). Use `<Img src="pasta/arquivo.webp" />` (`src/components/Img.tsx`), não `<img>`.

## Desempenho

O visual é o do template, mas o que o navegador baixa é bem menor (medido no Chrome, mobile, CPU 4× mais lenta, 4G):

- **CSS:** `scripts/build-css.mjs` junta as folhas do Ascent (`styles/`) e o Font Awesome, remove as regras de classes que nenhuma página usa (PurgeCSS, lendo `src/`) e minifica. Resultado: ~13 KB com gzip em **um** arquivo (`public/assets/css/site.min.css`, gerado, não versionado), contra ~470 KB em 6 arquivos. As fontes do Font Awesome são recortadas só com os ícones usados (~2 KB cada, em vez de ~115 KB).
  Se criar uma classe nova **por montagem de texto** (ex.: `` `col-${n}` ``), escreva-a por inteiro em algum lugar de `src/` (ou inclua em `safelist` no script), senão o PurgeCSS não a enxerga. `NO_PURGE=1 npm run build` desliga a limpeza para comparar.
- **Imagens:** WebP (`npm run optimize:images`). O `<Img>` põe `width`/`height` (a página não "pula" enquanto a imagem chega) e só carrega agora as da primeira tela (`priority` / `loading="eager"`); `src/content/image-sizes.json` é gerado.
- **Preloader:** o template anima largura/altura dos quadrados laranja, o que o Google conta como "mudança de layout" (CLS); aqui é a mesma animação por `transform` (`prisma-overrides.css`).
- **Fontes:** Jost/Nunito hospedadas aqui (sem Google Fonts), com `preload`.
- **PDFs** (`public/assets/docs/`): eram exportações do Word/Excel com ~500 KB de fontes embutidas cada. `../tools/optimize_pdfs.py` recorta as fontes só nos caracteres usados (5,45 MB → 0,9 MB, sem mudar o que aparece). Ao trocar ou adicionar PDFs: `python -X utf8 ../tools/optimize_pdfs.py public/assets/docs/proposta-pedagogica --apply` (precisa de `pip install pymupdf fonttools`); o script só troca o arquivo se texto e aparência forem idênticos. Os originais estão em `../referencias/pdf-originais/`.

## SEO

- **Títulos, descrições, canonical, Open Graph, Twitter:** `buildMeta` em `src/lib/seo.ts`, chamado pela função `meta` de cada rota. O título que aparece no Google pode ser diferente do da faixa de topo: ajuste em `src/content/seo-titles.ts` (até ~45 caracteres; o Google corta perto de 60 no total). Descrição: até ~155 caracteres, escrita em cada rota.
- **Dados estruturados (JSON-LD)** em `src/lib/jsonld.ts`: a escola, o site, as duas unidades (endereço, telefone, horário), o FAQ da home e a trilha de navegação. Saem das mesmas constantes de `src/content/site.ts`: ao mudar telefone, endereço ou horário lá, tudo se atualiza. Só entra o que está visível e é verdadeiro (não inventar avaliações). O CEP é opcional por unidade (`postalCode`).
- **Logo:** `node scripts/make-logo.mjs [arquivo.png]` gera `logo/logo.webp` (256 px, recortada em círculo e com fundo transparente) e o `apple-touch-icon.png` a partir do original (padrão: `../referencias/logo-prisma-original.png`, fora do repositório). Se a logo mudar, troque o original, rode este script e depois o `make-brand-images.mjs`.
- **Imagem de compartilhamento e favicons:** `node scripts/make-brand-images.mjs` (usa a foto original de `../referencias/` e a logo já gerada).
- **Revisão automática:** `npm run check:seo` (roda em `npm run verify` e no deploy do GitHub). Confere em todas as páginas: título e descrição únicos, canonical, um só `h1`, imagem `alt`, Open Graph, JSON-LD válido, links internos e arquivos referenciados, `noindex` coerente com o modo (revisão ou produção) e páginas órfãs.
- **Depois de publicar:** Search Console (enviar `sitemap.xml`), Teste de Resultados Eficazes do Google na home e numa unidade, e conferir se o Google Business Profile das duas unidades tem o mesmo endereço, telefone e horário do site.

## Formulários

O envio passa por **um único arquivo**, `src/lib/forms/submit.ts` (hoje Web3Forms). Para ativar:
1. Cadastre o e-mail de destino em web3forms.com e copie a *access key*.
2. Crie `.env` (veja `.env.example`) com `VITE_WEB3FORMS_KEY=...` e refaça o build (no GitHub: variável/secret do repositório).
3. Para trocar de provedor no futuro, altere somente `submitForm`.

Sem a chave, os formulários mostram "o envio ainda não está ativo" (em vez de falhar em silêncio).

## URLs (importante para o Google)

- O site antigo (WordPress) servia `/slug/`. Mantemos **exatamente os mesmos caminhos**; o GitHub Pages não faz redirect 301.
- Fonte única das páginas: `src/content/pages.json` (rotas e menu saem dela).
- A "régua" do teste é `scripts/legacy-urls.json` (gerada do backup do WordPress, **independente do código**): se alguém apagar ou renomear uma página, `npm run check:urls` falha.
- URLs de antes do WordPress (`quem_somos.html`…) redirecionam por `scripts/redirects.json` (página com `meta refresh` + `canonical`).
- URLs de lixo do tema antigo (posts lorem ipsum, `/shortcodes/`…) **não devem existir**.

## Indexação

Enquanto o site está em construção, **todas as páginas saem com `noindex, nofollow`**.
No lançamento, buildar com `VITE_ALLOW_INDEXING=true` e `VITE_SITE_URL=https://www.prismaescola.com.br`.

## Nunca commitar

`backup/`, `referencias/` (pacote do Ascent), `*.wpress`, `*.sql`, `.env*`. O repositório do GitHub Pages é público.

## Rastreamento (Google e Meta) e cookies

IDs **mantidos do site antigo** (levantados no backup do WordPress), em `src/content/tracking.ts`:

| Item | ID | Observação |
|---|---|---|
| Google Analytics 4 | `G-59CDZVGZXN` | do Site Kit |
| Google Ads | `AW-10993698813` | do tema Porto (o trecho antigo nunca foi concluído) |
| Google Ads | `AW-870398974` | pixel antigo do plugin "Google Remarketing Codes" |
| Meta Pixel | — | **o backup não tem Pixel do Facebook**: definir `VITE_META_PIXEL_ID` |
| Search Console | arquivo `public/google29541ef74a329696.html` | propriedade `https://www.prismaescola.com.br/` |

Não migrados: `UA-86101914-1` e `UA-242749899-1` (Universal Analytics, encerrado pelo Google em 2023).

- Nada de terceiros carrega **antes do aceite** no aviso de cookies (`CookieBanner`). Categorias: estatísticas (GA4) e marketing (Ads + Meta Pixel).
- Só liga no build de produção (`VITE_ALLOW_INDEXING=true`), para o ambiente de revisão não sujar os dados.
- Visualização de página é enviada a cada navegação; formulário enviado vira `generate_lead` (GA4) e `Lead` (Meta).
- O link "Preferências de cookies" no rodapé permite mudar ou retirar o consentimento (retirar limpa os cookies e recarrega a página).
- Para testar localmente: `VITE_ALLOW_INDEXING=true npm run verify && npm run preview`.

## Publicar no GitHub Pages

O site é publicado **do seu computador**, com um comando, pela branch `gh-pages` (`scripts/deploy.mjs`). O `git` usa o login do GitHub que já estiver configurado na máquina.

**Configuração única, no GitHub:** *Settings → Pages → Source: **Deploy from a branch** → Branch: `gh-pages` / pasta `/ (root)`* (a branch `gh-pages` aparece depois do primeiro deploy).

**1. Modo revisão (padrão, para a escola conferir antes de trocar o domínio)**
```
npm run deploy
```
Gera o site com o caminho do repositório, confere URLs e SEO (**para tudo se algo estiver errado**) e envia para a `gh-pages`. O site fica em `https://rafaaquino.github.io/Prisma-escola-site/`, com `noindex`, `robots.txt` bloqueando tudo e **sem** rastreamento. Antes de publicar, `npm run deploy:simular` faz o mesmo sem enviar nada.

**2. Corte para produção** (só depois de o DNS estar pronto: `../docs/plano-implementacao.md` §8, com o cuidado do `MX` da HostGator)
```
npm run deploy:producao
```
Pede confirmação (digite `SIM`), libera a indexação, usa `https://www.prismaescola.com.br` como endereço canônico e grava o arquivo `CNAME` na `gh-pages`. Depois, em *Settings → Pages → Custom domain* confirme `www.prismaescola.com.br` e marque *Enforce HTTPS*. Chaves e IDs (`VITE_WEB3FORMS_KEY`, `VITE_META_PIXEL_ID`) vêm do arquivo `.env` local (veja `.env.example`; ele **não** vai para o GitHub).
Search Console: a propriedade `https://www.prismaescola.com.br/` já está verificada pelo arquivo `google29541ef74a329696.html`; basta enviar `https://www.prismaescola.com.br/sitemap.xml`.

**Detalhes do script:** só a branch `gh-pages` é reescrita (um único commit novo a cada deploy, a `main` nunca é tocada). Opções: `-- --sem-checagens`, `-- --sim` (não pede confirmação em produção). Para publicar por outro domínio: variável `DEPLOY_DOMAIN`.

**Verificação automática no GitHub:** o workflow `.github/workflows/deploy.yml` roda a cada push na `main` e em pull requests: `typecheck`, `build`, `check:urls` e `check:seo`. Ele só **verifica**. Se um dia preferir publicar pelo próprio GitHub (sem usar o seu computador), crie a variável de repositório `DEPLOY_VIA_ACTIONS = true` e troque o Source de *Pages* para *GitHub Actions*; escolha **uma** das duas formas, nunca as duas.
