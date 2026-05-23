# Cajá — Plataforma de gestão de festivais culturais

> **Importante**: Este arquivo é o contexto canônico do projeto. Toda decisão de produto, stack ou estilo deve consultá-lo antes. Não duplicar contexto em outros arquivos.

---

## 1. Identidade da marca

**Nome do produto**: **Cajá** (com acento agudo no "a" final).
- Sempre escrito com inicial maiúscula em contextos de marca: "Cajá".
- Nunca em caixa alta ("CAJA"), nunca sem acento em contextos visuais ou textuais.

**Nome técnico**: `caja` (minúsculo, sem acento).
- Usado em: nome do repositório, pacote npm, slug do projeto Vercel, nome do projeto Supabase, subdomínio (`caja.com.br`).
- Motivo: URLs, terminal, npm e domínios não suportam acento de forma confiável.

**Tagline (uso em landing/pitch)**:
"A operação dos festivais culturais brasileiros, profissionalizada."

**Pitch de uma frase**:
"O Cajá é a primeira plataforma vertical de gestão para festivais culturais brasileiros, começando pelo nicho de festivais juninos do Nordeste."

---

## 2. Contexto do produto

Estamos construindo um MVP de SaaS B2B vertical para gestão de operação de festivais culturais brasileiros, com foco inicial em festivais juninos do Nordeste (Forró Caju, São João de Campina Grande, Bonfim Folia, Mossoró Cidade Junina).

**Problema que resolvemos**: festivais de R$ 5-30M de orçamento são operados em Excel + WhatsApp + e-mail. Contratação de 50-200 atrações, riders técnicos, programação de palcos, logística — tudo manual. Nossa plataforma substitui isso com workflow estruturado e IA generativa para automatizar curadoria e programação.

**Cliente-alvo**: produtores de festivais juninos médio-grandes e secretarias municipais de cultura.

**Reposicionamento para o Hackathon (Trilha 1 — Cultura, Memória e Preservação do Forró)**: o Cajá é também um **acervo digital cultural vivo** de artistas do forró nordestino. Cada artista cadastrado tem metadados culturais profundos (tradição musical, mestres/influências, região cultural, repertório-base). Cada festival gerenciado gera um registro histórico permanente de quem se apresentou, quando, em qual palco. Em 10 anos, será o maior acervo operacional-cultural da história do forró nordestino.

**Contexto do hackathon**: hackathon "País do Forró" no CajuHub, Aracaju/SE, 22-23 maio 2026. Time de 3 pessoas, 12 horas de desenvolvimento. Objetivo: MVP funcional para demonstrar a investidores presentes no evento.

---

## 3. Stack técnica

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + Lucide icons
- **Banco**: PostgreSQL via Supabase
  - Pooler: porta 6543 (uso em runtime — DATABASE_URL)
  - Direct: porta 5432 (uso em migrations — DATABASE_URL_DIRECT)
- **ORM**: Drizzle ORM
- **IA**: Anthropic SDK oficial (`@anthropic-ai/sdk`)
  - **Modelo padrão**: `claude-sonnet-4-6-20260218`
  - Não use alias `claude-sonnet-4-6` — fixe o snapshot para estabilidade no demo
- **Forms**: react-hook-form + Zod
- **Toasts**: sonner
- **Datas**: date-fns
- **Deploy**: Vercel

---

## 4. Princípios de código

1. **TypeScript strict**. Nada de `any` espalhado. Tipos explícitos em props e retornos.
2. **Server Components por padrão**. Client Components só quando precisar de interatividade real.
3. **Server Actions** para mutations simples. **Route handlers** para integrações com IA (timeouts maiores).
4. **Drizzle relational queries** quando possível. Evite raw SQL exceto em queries muito complexas.
5. **shadcn/ui para tudo de UI**. Não criar componente do zero se shadcn tem.
6. **Tratamento de erro**: try/catch + toast (sonner) no client; route handlers retornam JSON com `{ error }`.
7. **Loading states** em toda chamada async. Skeleton da shadcn, não spinner genérico.
8. **Mobile-first responsivo**. Demo pode incluir visualização no celular.
9. **Commits frequentes**. Commit a cada feature funcionando, com mensagem clara.
10. **Sem `any`, sem `// @ts-ignore`, sem `console.log` esquecido em produção**.

---

## 5. Identidade visual

**Paleta junina elegante (NÃO carnavalesca)**:
- Primary: laranja queimado `#C2410C`
- Accent: amarelo milho `#EAB308`
- Secundária: marrom terra `#78350F`
- Background quente: off-white `#FEF3C7`
- Texto escuro: `#1C1917`
- Cinzas neutros: usar escala `stone` do Tailwind

**Tipografia**:
- UI e corpo: Inter (via next/font/google)
- Títulos/hero (opcional): Fraunces ou outra serif elegante

**Direção visual**: "SaaS profissional com toque cultural sutil". Pense Linear, Notion, Stripe com paleta nordestina. **NÃO** site de festa junina com balão, bandeirola, milho desenhado, fogueira, ou clichês visuais juninos. A cultura aparece no conteúdo (nomes de palcos, dados das bandas, narrativa), não na decoração.

---

## 6. Estrutura de pastas

```
caja/
├── app/
│   ├── (marketing)/page.tsx          # landing
│   ├── festivais/
│   │   ├── page.tsx                  # lista
│   │   ├── novo/page.tsx             # wizard
│   │   └── [id]/
│   │       ├── page.tsx              # dashboard
│   │       ├── contratacoes/page.tsx
│   │       └── programacao/page.tsx
│   ├── atracoes/
│   │   ├── page.tsx                  # banco de bandas
│   │   └── [slug]/page.tsx           # detalhe
│   ├── artista/[slug]/page.tsx       # portal público do artista
│   └── api/
│       ├── atracoes/search/route.ts
│       └── ia/
│           ├── gerar-programacao/route.ts
│           └── gerar-contrato/route.ts
├── components/
│   ├── ui/                           # shadcn
│   ├── festival/
│   ├── atracao/
│   └── programacao/
├── db/
│   ├── index.ts                      # client Drizzle
│   ├── schema.ts
│   ├── seed.ts
│   └── migrations/
├── lib/
│   ├── ai/
│   │   ├── gerar-programacao.ts
│   │   └── gerar-contrato.ts
│   ├── schemas/                      # Zod schemas
│   └── utils.ts
├── public/
├── .env.local
├── CLAUDE.md
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
---

## 7. Schema do banco

Schema canônico em `db/schema.ts` com as seguintes tabelas e enums:

**Enums**:
- `estiloMusicalEnum` — `pe_de_serra`, `xote`, `baiao`, `forro_eletronico`, `forro_universitario`, `forro_estilizado`, `arrasta_pe`, `outro`
- `faixaCacheEnum` — `ate_5k`, `5k_15k`, `15k_50k`, `50k_150k`, `acima_150k`
- `statusContratacaoEnum` — `prospeccao`, `negociacao`, `contratado`, `rider_pendente`, `confirmado`, `cancelado`
- `statusFestivalEnum` — `planejamento`, `contratacao`, `programacao`, `execucao`, `encerrado`

**Tabelas**:
- `bandas` — catálogo de artistas com nome, slug, bio, estilo, cidade/estado de origem, foto, YouTube, Spotify, Instagram, faixa e valor de cachê, rider técnico (jsonb), contato do empresário, duração do show e notas internas
- `festivais` — festivais gerenciados com nome, slug, cidade, estado, datas, orçamento, número de atrações estimadas, status e organizador
- `palcos` — palcos de cada festival com nome, capacidade, ordem de exibição e horários de funcionamento
- `contratacoes` — relação festival ↔ banda com valor do contrato, status do workflow, texto do contrato gerado por IA e observações
- `slots` — grade de programação (palco × dia × horário) com suporte a slots vazios, flag de geração por IA e justificativa
- `geracoes_ia` — log de chamadas de IA com tipo (`programacao`, `contrato`, `matching`), prompt usado, resposta JSON, duração em ms e modelo utilizado

**Indexes**: `bandas_estilo_idx`, `bandas_estado_idx`, `palcos_festival_idx`, `contratacoes_festival_idx`, `contratacoes_banda_idx`, `slots_festival_idx`, `slots_palco_idx`

**Relations**: definidas via `relations()` do Drizzle — `bandas → contratacoes`, `festivais → palcos/contratacoes/slots`, `palcos → slots`, `contratacoes → slots`. Consulte `db/schema.ts`.

**Driver**: `postgres` (pacote `postgres`) com Drizzle ORM. Migrations via `drizzle-kit` usando `DATABASE_URL_DIRECT` (porta 5432). App usa `DATABASE_URL` via pooler (porta 6543).

---

## 8. Camada cultural (Trilha 1)

Para sustentar a narrativa de "acervo cultural", a tabela `bandas` deve ter campos culturais profundos além dos campos operacionais:

- `tradicaoMusical: text` — ex: "baião raiz", "forró eletrônico de Recife pós-2000", "pé-de-serra agreste"
- `influenciasMestres: jsonb` — array de nomes: `["Luiz Gonzaga", "Dominguinhos"]`
- `regiaoCultural: text` — não a cidade, mas a região cultural: "Agreste pernambucano", "Sertão sergipano"
- `repertorioBase: jsonb` — músicas mais tocadas com autoria: `[{ titulo, autor }]`
- `bio: text` — narrativa cultural (não release de marketing)

Esses campos viram a base do **acervo cultural pesquisável** que justifica a Trilha 1 no pitch. **Importante**: a Pessoa 3 do time deve preencher esses campos com pesquisa real, não inventar.

---

## 9. Variáveis de ambiente — `.env.local`

```env
DATABASE_URL="postgresql://postgres.[ref]:[senha]@aws-0-[região].pooler.supabase.com:6543/postgres?pgbouncer=true"
DATABASE_URL_DIRECT="postgresql://postgres.[ref]:[senha]@aws-0-[região].supabase.com:5432/postgres"
ANTHROPIC_API_KEY="sk-ant-..."
```

A `DATABASE_URL` (pooler) é usada em runtime serverless (Vercel). A `DATABASE_URL_DIRECT` é usada apenas para migrations via drizzle-kit.

---

## 10. Configuração do client Drizzle — `db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// prepare: false é obrigatório com o pooler do Supabase (pgbouncer transaction mode)
const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
```

---

## 11. Scripts do `package.json`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:seed": "tsx db/seed.ts",
  "db:studio": "drizzle-kit studio"
}
```

---

## 12. Ordem de setup do ambiente (CRÍTICA — não inverter)

1. Preencher `.env.local` com credenciais reais do Supabase e da Anthropic.
2. Confirmar `drizzle.config.ts` apontando para `DATABASE_URL_DIRECT`.
3. Configurar `db/index.ts` (client Drizzle) — **antes** de qualquer seed.
4. Gerar migration: `npm run db:generate`.
5. Aplicar migration: `npm run db:migrate`.
6. Popular seed: `npm run db:seed`.
7. Validar no Supabase Studio que dados estão lá.
8. Iniciar implementação de features.

**Por que essa ordem**: o seed depende de `db/index.ts`. Migrations dependem do schema. Tudo depende de `.env.local`. Inverter a ordem causa erros que consomem tempo precioso.

---

## 13. Features do MVP — priorização

### P0 (sem isso não há demo)
1. Landing page profissional
2. Banco de atrações navegável com filtros
3. Criação de festival (wizard 3 passos)
4. Workflow de contratações (com status por kanban ou tabela)
5. **Geração de programação com IA (wow moment)**
6. Visualização da grade gerada

### P1 (importante para o pitch)
7. Dashboard do festival com KPIs e gráficos
8. Portal público da banda (`/artista/[slug]`)
9. Geração de contrato com IA

### P2 (só se sobrar tempo — provavelmente não vai)
10. Matching inteligente de banda para brief
11. Análise pós-festival
12. Mapa cultural de origem dos artistas

---

## 14. O que NÃO fazer

- **Não implementar autenticação**. Sem login. Usuário único hardcoded.
- **Não implementar pagamento ou cobrança**.
- **Não escrever testes**.
- **Não criar i18n**.
- **Não usar drag-and-drop complexo** na primeira versão (use botões mover ↑↓ se precisar reorganizar).
- **Não usar streaming** nas chamadas de IA (use response normal com loading polido).
- **Não criar PWA, mobile nativo, ou app store**.
- **Não usar Docker** (Vercel cuida).
- **Não usar Prisma** (decidimos Drizzle).
- **Não inventar dados de bandas**. Use nomes reais do forró nordestino com dados verossímeis.

---

## 15. Integração com IA — diretrizes

**Modelo**: `claude-sonnet-4-6-20260218` para tarefas que exigem raciocínio (programação, contratos). Para tarefas leves (classificação, sugestão de tags) considerar `claude-haiku-4-5-20251001`.

**Saída estruturada**: use `tool_use` com `tool_choice` forçado quando precisar de JSON garantido. Não faça parsing de texto livre.

**System prompts**: escreva como se Claude fosse um especialista do domínio (produtor sênior de festival, advogado de contratos artísticos). Nunca peça a Claude para "inventar" — sempre forneça os dados estruturados como contexto.

**Logging**: toda chamada de IA salva em `geracoes_ia` para auditoria. Inclui modelo, prompt, resposta, duração.

**Timeouts**: route handlers que chamam IA devem ter `maxDuration` de 60s configurado no Next.

---

## 16. Estratégia de demo

**Plano A**: gerar tudo ao vivo (programação, contratos) durante o pitch.

**Plano B (fallback obrigatório)**: ter ao menos UM festival no seed com programação **já gerada e salva**, para o caso de a IA falhar ao vivo ou conectividade ruim. Pitch deve estar treinado para usar o Plano B sem hesitar.

**URL de demo**: subdomínio Vercel pré-aquecido. Antes do pitch, acessar todas as rotas críticas para evitar cold start.

---

## 17. Glossário do domínio

- **Atração / banda**: artista contratável (banda, trio, dupla, sanfoneiro solo).
- **Festival**: evento agregador com múltiplos dias e palcos.
- **Palco**: local físico de apresentação dentro de um festival.
- **Slot**: alocação de uma banda em palco × dia × horário.
- **Contratação**: relação comercial entre festival e banda (com status workflow).
- **Rider técnico**: lista de equipamentos que a banda exige para se apresentar.
- **Changeover**: intervalo de troca de equipamento entre uma banda e outra no mesmo palco.
- **Backline**: instrumentos compartilhados de palco (bateria, amplificadores).
- **Pé-de-serra**: estilo tradicional acústico (sanfona, zabumba, triângulo).
- **Forró eletrônico**: estilo moderno com guitarra, baixo, teclado.