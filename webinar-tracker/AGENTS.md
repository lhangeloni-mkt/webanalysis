# 🧠 Sistema Completo — Webinar Tracker

## 📋 Sobre o Projeto

App de rastreamento de erros em webinars. Usuários registram entradas (webinars) com especialista, criador, planeta e quais erros ocorreram. Erros são categorizados por tipo (PRE/POST/MOD/WHATSAPP) e cor (RED/YELLOW). Inclui análise de dados com gráficos, performance por especialista/criador, e painel de configuração.

---

## 🏗 Stack Tecnológica

| Tecnologia | Versão | Observação |
|---|---|---|
| React | 19 | Hooks funcionais, sem classes |
| TypeScript | ~6.0 | Strict mode |
| Vite | 8 | Bundler com Rolldown |
| Supabase | JS v2 | Auth + DB + Realtime subscriptions |
| Chart.js + react-chartjs-2 | 4 + 5 | Gráficos na análise |
| lucide-react | 1.8 | Ícones |
| nanoid | 5 | IDs únicos |

---

## 📁 Estrutura de Arquivos

```
webinar-tracker/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # ~3266 linhas — TODOS os componentes (monolítico)
│   ├── types.ts              # Interfaces compartilhadas
│   ├── App.css / styles.css / index.css
│   └── utils/supabase/
│       └── client.ts         # Factory do Supabase client
├── AGENTS.md                 # ⬅️ Este documento
├── index.html
└── package.json
```

⚠️ **IMPORTANTE:** `App.tsx` é um arquivo **monolítico** de ~3266 linhas contendo TODOS os componentes, estados, lógica Supabase e roteamento manual (sem React Router). Tome cuidado extremo ao editá-lo — um `oldString` pode corresponder a mais de um lugar.

---

## 🧩 Tipos Compartilhados (`types.ts`)

```typescript
MistakeItem { label: string; type: 'post' | 'pre' | 'mod' | 'whatsapp'; color: 'red' | 'yellow' }
Entry        { id: string; date: string; planet: string; specialist: string; creator: string; mistakes: string[] }
Settings     { specialists: string[]; creators: string[]; mistakes: MistakeItem[]; planets: string[] }
SecurityRecord { id: string; date: string; target: 'analysis' | 'settings'; lastPassword: string; newPassword: string }
SecuritySettings { passwords: { analysis: string; settings: string }; history: SecurityRecord[] }
```

---

## 🧱 Componentes em App.tsx

### ToastContainer (linha ~187)
Notificações flutuantes (success/error/warning/info) que somem após 4s.

### EditRecordModal (linha ~204)
Modal de edição de entrada existente. Contém os mesmos campos do formulário de entrada.

### DeleteConfirmationModal (linha ~314)
Modal de confirmação de deleção.

### SuccessModal (linha ~344)
Modal pós-salvamento: "Add Another Entry" ou "View Analysis".

### SearchableSelect (linha ~374)
Dropdown genérico com busca para `string[]` (specialists, creators). Fecha ao clicar fora.

### **MistakeSelect** (linha ~484) ⭐ **Componente crítico**
Dropdown especializado para `MistakeItem[]` com abas de cor e filtro.

**Props:**
```typescript
label: string
options: MistakeItem[]
value: string
onChange: (val: string) => void
required?: boolean       // default false
noColor?: boolean        // default false — se true, ABAS e CORES são desativadas
```

**Lógica interna:**
- `hasMixedColors`: `!noColor && uniqueColors.length > 1` — controla se abas RED/YELLOW aparecem
- `filteredOptions`: filtra por `searchTerm` + `selectedColor` (se não for null)
- `getItemColor(opt)`: retorna a cor de exibição:
  - `opt.type === 'mod'` → `#3B82F6` (azul)
  - `opt.type === 'whatsapp'` → `#22C55E` (verde)
  - demais → `'#EF4444'` (red) ou `'#EAB308'` (yellow) baseado em `opt.color`
- **Placeholder search:**
  - `noColor === true` → `"Search errors..."`
  - senão → `"Search RED errors..."` (padrão) ou `"Search YELLOW errors..."` (quando aba yellow selecionada)
- **Lista só aparece** quando `selectedColor || noColor` for true

**Call sites:**

| Local | Filtro options | noColor |
|---|---|---|
| EditRecordModal | `settings.mistakes` (todos) | não (false) |
| DataInputPage (POST) | `type === 'post'` | não (false) |
| PreWebinarInputPage (PRE) | `type === 'pre'` | não (false) |
| ModerationInputPage (MOD) | `type === 'mod'` | **SIM** |
| WhatsappInputPage (WHATSAPP) | `type === 'whatsapp'` | **SIM** |

### PasswordGateway (linha ~689)
Proteção por senha para Analysis e Settings (Settings usa Supabase Auth, não este gateway).

### LoginModal (linha ~740)
Login Supabase (email/senha) para acesso ao Settings.

### SettingsSection (linha ~844)
Card reutilizável para gerenciar arrays de string (especialistas, creators, planets). Props: `title, items, value, onChange, onAdd, onDelete, onEdit`.

### DashboardPage (linha ~917)
Home: stats grid + atividade recente + top 10 erros mais comuns.

### DataInputPage (linha ~1055) — POST Webinar
Formulário: date, planet, specialist, creator, mistakes (filtrados `type === 'post'`).

### PreWebinarInputPage (linha ~1187) — PRE Webinar
Mesmo layout, mistakes filtrados `type === 'pre'`.

### ModerationInputPage (linha ~1319) — MOD Webinar
Mesmo layout, mistakes filtrados `type === 'mod'`, **noColor**.

### WhatsappInputPage (linha ~1401) — WHATSAPP
Mesmo layout, mistakes filtrados `type === 'whatsapp'`, **noColor**.

### DataAnalysisPage (linha ~1484)
4 abas: Charts (Bar/Pie/Line), Filtered Data, Performance Overview, Raw Data.

### SettingsPage (linha ~2087)
3 abas: Configuration (gerenciar registries + export/import JSON), Database (CRUD entries), Security (senhas + histórico).

### App (linha ~2619)
Componente raiz. Toda lógica de estado, Supabase, auth, roteamento, tema.

---

## 🎨 Sistema de Cores dos Mistakes

### Eixo 1 — Severidade (`color: 'red' | 'yellow'`)
- Usado apenas em PRE e POST
- RED = erro grave, YELLOW = erro leve
- Controla o filtro nas abas RED MISTAKE / YELLOW MISTAKE

### Eixo 2 — Tipo (`type: 'post' | 'pre' | 'mod' | 'whatsapp'`)
- MOD e WHATSAPP **não usam cores** — têm `noColor=true`, listam direto sem abas
- A cor de exibição visual (bolinha ● e borda esquerda) é determinada por `getItemColor()`:
  - MOD → azul `#3B82F6`
  - WHATSAPP → verde `#22C55E`
  - PRE/POST → vermelho `#EF4444` ou amarelo `#EAB308`

### Fluxo de abertura do modal MistakeSelect

```
Usuário clica no trigger
  ├── noColor=true? → pula lógica de cor, abre com lista direta
  └── noColor=false?
       ├── Já tem valor selecionado? → auto-select tab da cor do valor
       ├── Apenas 1 cor disponível? → auto-select essa cor
       └── Mistas (RED+YELLOW)? → selectedColor=null, mostra abas
```

---

## 🗄 Supabase

**Client:** `src/utils/supabase/client.ts` (env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

**Tabelas:**
- `webinar_entries` — entradas (INSERT/UPDATE/DELETE com realtime)
- `webinar_settings` — settings (UPDATE com realtime)
- `webinar_security` — senhas (UPDATE com realtime)

**Fluxo de dados:**
- Inicialização: fetch paralelo das 3 tabelas, cache localStorage (`cached_webinar_*`)
- Realtime: subscriptions `postgres_changes` para manter estado sincronizado
- Migração legacy: se existir `webinar_entries` no localStorage sem flag `supabase_migrated`, faz bulk insert

**⚠️ Regras de escrita:**
- `addEntry` → insert Supabase + SuccessModal
- `updateEntry` → update Supabase + toast erro se falhar
- `deleteEntry` → remove otimisticamente do estado local, depois deleta no Supabase
- `updateSettings` → atualiza local primeiro, depois Supabase. **Reverte local se DB falhar**
- `updatePasswords` → verifica sessão, cria SecurityRecord, atualiza DB. Só atualiza local se DB OK

---

## 🌐 Roteamento

Sem React Router. Usa estado `currentPage` com condicionais:

```
'dashboard'   → DashboardPage
'input'       → DataInputPage (Post)
'pre-webinar' → PreWebinarInputPage
'moderation'  → ModerationInputPage
'whatsapp'    → WhatsappInputPage
'analysis'    → PasswordGateway (se locked) | DataAnalysisPage
'settings'    → SettingsPage (requer auth Supabase)
```

---

## ⚠️ Armadilhas Conhecidas (Pitfalls)

### 1. ✂️ Edições no App.tsx — oldString pode ter múltiplos matches
O arquivo tem ~3266 linhas com padrões repetidos. Sempre usar contexto suficiente no `oldString` para evitar matches acidentais. **NUNCA usar apenas 1-2 linhas** de contexto.

### 2. 📦 Vite 8 / Rolldown — Problema com `)}` aninhado
O Rolldown (bundler do Vite 8) pode falhar ao parsear `)}` quando há múltiplos níveis de `{cond && (...)}` aninhados em JSX. SOLUÇÃO: extrair JSX condicional para variáveis fora do return ou usar `cond ? (...) : null`.

### 3. 🧩 Props não destruturadas = undefined silencioso
Sempre verificar se a prop foi adicionada **tanto no type annotation quanto na destruturação** do componente. Erro comum: declarar no tipo mas esquecer de extrair.

### 4. 🎨 Cores do `getItemColor` vs `color` do dado
`getItemColor()` retorna a cor VISUAL baseada no `type`, e NÃO no campo `color` do objeto. Para MOD retorna azul, WHATSAPP retorna verde, independente do `opt.color`.

### 5. 💾 Cache localStorage vs Supabase
Sempre verificar ambos ao depurar. Mudanças no Supabase podem não refletir imediatamente se o cache local estiver desatualizado.

### 6. 🔄 Reatividade do estado
O estado global (`entries`, `settings`, `security`) é sincronizado via subscriptions realtime. Mas operações de escrita usam `updateSettings` que faz otimistic update + reversão em caso de falha.

---

## 🧪 Protocolo de Testes (OBRIGATÓRIO)

### Antes do commit — 3 testes completos

1. **Teste 1:** Abrir cada uma das 4 páginas (PRE, POST, MOD, WHATSAPP) e verificar se o modal de mistakes abre corretamente com/n sem abas de cor
2. **Teste 2:** Selecionar um mistake em cada página e verificar se o valor aparece no trigger
3. **Teste 3:** Submeter uma entrada completa e verificar se aparece no Dashboard/Análise

**Checklist por tipo de página:**
- [ ] PRE: abas RED/YELLOW visíveis, placeholder "Search RED errors..."
- [ ] POST: abas RED/YELLOW visíveis, placeholder "Search RED errors..."
- [ ] MOD: sem abas, placeholder "Search errors...", itens em azul
- [ ] WHATSAPP: sem abas, placeholder "Search errors...", itens em verde

### Depois do push — 2 testes de confirmação

Repetir o fluxo completo de abertura, seleção e submissão em pelo menos 2 páginas diferentes.

### Dados de teste

Se testes criarem dados no banco, **excluir APÓS os testes**. Verificar que está deletando apenas dados de teste, não dados reais.

---

## 🚀 Deploy

- GitHub → Vercel (auto-deploy no push para `main`)
- URL: https://webanalysis-nine.vercel.app/
- Após push, Vercel pode levar 1-2 minutos para fazer deploy

---

## 🔄 Fluxo de Desenvolvimento Ideal

1. Ler AGENTS.md + `src/types.ts` para entender domínio
2. Identificar o local exato da edição em `App.tsx` (usar grep + contexto)
3. Para mudanças no MistakeSelect: verificar TODOS os 5 call sites
4. Fazer edições com contexto suficiente no oldString (mínimo 5-10 linhas)
5. Rodar `npx tsc --noEmit` e `npx vite build`
6. Testar 3x (protocolo acima)
7. `git add`, `git commit`, `git push`
8. Testar 2x pós-push
9. Confirmar com o usuário
