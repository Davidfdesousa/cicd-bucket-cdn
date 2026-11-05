# Template Vite Web Components

Starter com Vite, TypeScript, Web Components (Lit), tokens CSS, login Google (Firebase Auth) e semantic-release.

<!-- template:remove:start -->

> **Este repositório é um template.** Crie projetos a partir dele pelo `repo-setup` (issue form) ou pelo botão **Use this template** do GitHub. Este bloco é removido automaticamente quando o projeto é inicializado pelo `repo-setup`.
>
> O que o `repo-setup` ajusta na inicialização está declarado em [`.template/manifest.json`](.template/manifest.json): nome, título e descrição do projeto, versão zerada e remoção dos arquivos que só fazem sentido no template.

<!-- template:remove:end -->

## Stack

- **Build:** Vite 8
- **Linguagem:** TypeScript 6 em modo strict
- **UI:** Web Components com Lit 3 (Shadow DOM)
- **Estilo:** CSS puro com tokens em duas camadas (foundation → semantic) e tema claro/escuro via `light-dark()`
- **Autenticação:** Firebase Authentication com provedor Google
- **Testes:** Vitest + happy-dom
- **Qualidade:** ESLint (typescript-eslint, lit, wc) + Prettier
- **Versionamento:** Conventional Commits (commitlint + husky) + semantic-release
- **CI/CD:** GitHub Actions (CI em PR, release na `main`) + Dependabot

## Primeiros passos

1. Use o Node da versão do projeto: `nvm use` (Node 24)
2. Instale as dependências: `npm install`
3. Crie o arquivo de ambiente: `cp .env.example .env.local`
4. Preencha as variáveis do Firebase (veja abaixo)
5. Suba o projeto: `npm run dev` e abra `http://localhost:5173`

Sem as variáveis do Firebase o app não quebra: ele mostra uma tela listando exatamente o que falta configurar.

## Login com Google (Firebase)

1. No [Firebase Console](https://console.firebase.google.com), crie um projeto (ou use um existente).
2. Em **Project settings → General → Your apps**, adicione um app **Web** e copie o objeto de configuração.
3. Preencha o `.env.local`:
   - `VITE_FIREBASE_API_KEY` → `apiKey`
   - `VITE_FIREBASE_AUTH_DOMAIN` → `authDomain`
   - `VITE_FIREBASE_PROJECT_ID` → `projectId`
   - `VITE_FIREBASE_APP_ID` → `appId`
4. Em **Authentication → Sign-in method**, habilite o provedor **Google**.
5. Em **Authentication → Settings → Authorized domains**, adicione o domínio de produção (ex.: `meu-app.vercel.app`). `localhost` já vem autorizado.
6. No provedor de deploy (Vercel, Netlify, Firebase Hosting…), cadastre as mesmas variáveis `VITE_FIREBASE_*`.

Como funciona por dentro:

- O login abre um **popup**; se o navegador bloquear (comum no mobile e em webviews), cai automaticamente para **redirect**.
- A sessão persiste no navegador (padrão do Firebase) e é restaurada ao recarregar.
- Erros do Firebase viram mensagens amigáveis em `src/services/auth/auth-errors.ts`. Fechar o popup não gera erro.
- Os componentes não falam com o Firebase direto: tudo passa pelo contrato `AuthService` (`src/services/auth/auth.types.ts`). Trocar de provedor é trocar uma implementação.

> As chaves `VITE_FIREBASE_*` são públicas por natureza (vão no bundle do navegador). A proteção vem dos **Authorized domains** e das **Security Rules**, não do segredo das chaves.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção em `dist/`
- `npm run preview` — serve o build localmente
- `npm run typecheck` — checagem de tipos
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm test` / `npm run test:watch` / `npm run test:coverage` — Vitest
- `npm run verify` — tudo acima em sequência (o mesmo que o CI roda)

## Estrutura

```text
src/
├─ app/
│  └─ app-root.ts            # shell: dono do estado de auth, escolhe a página
├─ components/               # componentes reutilizáveis (um por pasta)
│  ├─ avatar/
│  ├─ button/                # button.ts · button.styles.ts · button.test.ts
│  ├─ card/
│  ├─ header/
│  ├─ icon/                  # icon.ts + icons.ts (set SVG inline)
│  └─ theme-toggle/
├─ config/
│  ├─ app.config.ts          # nome e título do app
│  └─ firebase.config.ts     # lê e valida as variáveis VITE_FIREBASE_*
├─ controllers/
│  └─ auth.controller.ts     # ReactiveController que conecta um elemento ao AuthService
├─ lib/
│  ├─ store.ts               # store observável mínima
│  └─ theme.ts               # tema claro/escuro + persistência
├─ pages/                    # páginas sem estado próprio (props descem, eventos sobem)
├─ services/auth/            # contrato AuthService + implementação Firebase
├─ styles/
│  ├─ tokens/
│  │  ├─ foundation.css      # valores crus: paleta, escala de tamanho, tipografia
│  │  └─ semantic.css        # tokens que os componentes consomem
│  ├─ global.css             # reset + estilos do documento
│  └─ shared.styles.ts       # estilos compartilhados entre shadow roots
├─ test/                     # setup e helpers de teste
└─ main.ts
```

## Tokens e temas

Os tokens vivem em CSS custom properties e atravessam o Shadow DOM naturalmente.

- **Foundation** (`foundation.css`): paleta em OKLCH (`--palette-neutral-*`, `--palette-brand-*`…), escala de tamanho (`--size-*`), fontes, raios e motion. Componentes **não** usam esta camada.
- **Semantic** (`semantic.css`): o que os componentes consomem, no formato `--{categoria}-{papel}-{variante}`:
  - Cor: `--color-bg-*`, `--color-content-*`, `--color-border-*`
  - Variantes: `default`, `subtle`, `muted`, `strong`, `intense`, `hover`, `pressed`
  - Espaçamento: `--spacing-stack-*` (vertical entre blocos), `--spacing-inline-*` (horizontal entre irmãos), `--spacing-inset-*` (padding interno)
  - Tipografia: `--typography-title-*`, `--typography-body-*`, `--typography-label-*`

Tema:

- Por padrão segue o sistema operacional (`prefers-color-scheme`).
- `data-theme="light" | "dark"` no `<html>` força um tema; também funciona em qualquer elemento para tematizar só aquele trecho.
- O `app-theme-toggle` salva a escolha em `localStorage` (`app:theme`) e um script inline no `index.html` restaura antes do primeiro paint, sem flash.
- Cada token de cor declara os dois valores uma única vez com `light-dark()`; o build gera fallback para navegadores antigos.

Exemplo dentro de um componente:

```ts
static override styles = css`
  :host {
    padding: var(--spacing-inset-md);
    background: var(--color-bg-default);
    color: var(--color-content-default);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-surface);
  }
`;
```

## Componentes

- `app-button` — variantes `primary`, `secondary`, `ghost`; tamanhos `md`, `sm`; `loading`, `disabled`, `full-width`, `icon-only` + `label`
- `app-icon` — ícones SVG inline; decorativo por padrão, `label` torna significativo
- `app-card` — superfície com padding `md`, `lg` ou `xl`
- `app-avatar` — foto do usuário com fallback para iniciais
- `app-header` — marca, usuário logado, sair e toggle de tema
- `app-theme-toggle` — alterna claro/escuro

Convenções:

- Prefixo `app-` em todas as tags; nomes de arquivos, classes e props em inglês.
- Uma pasta por componente, com `*.styles.ts` quando o CSS cresce e `*.test.ts` ao lado.
- Toda tag registrada em `HTMLElementTagNameMap` e todo evento em `HTMLElementEventMap` (tipagem nos templates e no `querySelector`).
- Páginas não guardam estado de domínio: recebem dados por propriedade e emitem eventos (`sign-in`, `sign-out`).

## Commits e versionamento

O projeto usa [Conventional Commits](https://www.conventionalcommits.org/pt-br/). O hook `commit-msg` valida cada commit localmente e o CI valida o título do PR.

Como cada tipo afeta a versão:

- `fix:` → patch (`1.0.0` → `1.0.1`)
- `feat:` → minor (`1.0.0` → `1.1.0`)
- `feat!:` ou rodapé `BREAKING CHANGE:` → major (`1.0.0` → `2.0.0`)
- `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `style:` → não geram release

Fluxo:

1. Abra o PR com título no padrão (ex.: `feat(auth): add sign-in with redirect fallback`).
2. Faça **squash merge** — o título do PR vira a mensagem do commit na `main`.
3. O workflow **Release** roda na `main` e o semantic-release:
   - calcula a próxima versão pelos commits desde a última tag;
   - cria a tag `vX.Y.Z` e a GitHub Release com as notas;
   - atualiza `CHANGELOG.md` e a versão do `package.json` num commit `chore(release)`.
4. Pushes na `develop` (opcional) geram pré-releases `X.Y.Z-beta.N`.

> Se a `main` tiver uma regra que bloqueia push direto, crie o secret `RELEASE_TOKEN` com um token (GitHub App ou PAT) autorizado a contornar a regra. Sem ele, o workflow usa o `GITHUB_TOKEN` padrão.

## CI/CD

- `.github/workflows/ci.yml` — em todo PR: título no padrão, lint, formatação, tipos, testes com cobertura e build
- `.github/workflows/release.yml` — em push na `main`/`develop`: verifica e publica a release
- `.github/dependabot.yml` — atualizações semanais de dependências agrupadas, com prefixo `chore` (não geram release)
