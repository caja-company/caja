# Cajá — Plataforma de gestão de festivais culturais

## Contexto do produto

Estamos construindo um MVP de SaaS B2B vertical para gestão de operação de festivais culturais brasileiros, com foco inicial em festivais juninos do Nordeste (Forró Caju, São João de Campina Grande, Bonfim Folia, Mossoró Cidade Junina).

O problema que resolvemos: festivais de R$ 5-30M de orçamento são operados em Excel + WhatsApp + e-mail. Contratação de 50-200 atrações, riders técnicos, programação de palcos, logística — tudo manual. Nossa plataforma substitui isso com workflow estruturado e IA generativa pra automatizar curadoria e programação.

Estamos em hackathon de 12h. Time de 3 pessoas. O objetivo é um MVP funcional pra demonstrar pra investidores presentes no evento.

## Stack técnica

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + Lucide icons
- **Banco**: PostgreSQL via Supabase (use o pooler, porta 6543)
- **ORM**: Drizzle ORM
- **IA**: Anthropic SDK oficial (`@anthropic-ai/sdk`), modelo Claude Sonnet (confirmar nome exato do modelo em docs.claude.com antes de codar)
- **Deploy**: Vercel
- **Forms**: react-hook-form + zod

## Princípios de código

1. TypeScript strict. Nada de `any` espalhado. Tipos explícitos em props e retornos.
2. Server Components por padrão. Client Components só quando precisar de interatividade.
3. Server Actions pra mutations simples. Route handlers pra integrações com IA.
4. Drizzle queries usando relational API quando possível.
5. shadcn/ui pra todos os componentes de UI. Não criar componente do zero se shadcn tem.
6. Erros tratados com try/catch + toast (sonner) no client.
7. Loading states em toda chamada async.
8. Mobile-first responsivo. Demo vai rolar em notebook mas vão querer ver no celular.

## Identidade visual

Paleta junina elegante (NÃO carnavalesca):
- Primary: laranja queimado `#C2410C`
- Accent: amarelo milho `#EAB308`
- Secundária: marrom terra `#78350F`
- Background: off-white quente `#FEF3C7` (suave, não saturado)
- Texto escuro: `#1C1917`

Tipografia: Inter pra UI, e considerar uma serif elegante (tipo Fraunces) só pra hero/títulos.

Visual deve ser "SaaS profissional com toque cultural", não "site de festa junina com balão e bandeirola". Pense Linear/Notion com paleta nordestina.

## Estrutura de pastas

```
app/
  (marketing)/page.tsx          # landing
  festivais/
    page.tsx                    # lista
    novo/page.tsx               # wizard
    [id]/
      page.tsx                  # dashboard do festival
      contratacoes/page.tsx
      programacao/page.tsx
  atracoes/
    page.tsx                    # banco de bandas
    [slug]/page.tsx             # detalhe
  artista/[slug]/page.tsx       # portal público do artista
  api/
    ia/
      gerar-programacao/route.ts
      gerar-contrato/route.ts
components/
  ui/                           # shadcn
  festival/
  atracao/
  programacao/
db/
  schema.ts
  index.ts                      # client Drizzle
lib/
  ai/
    gerar-programacao.ts
    gerar-contrato.ts
  utils.ts
```

## O que NÃO fazer

- Não implementar autenticação. Sem login. Usuário único hardcoded.
- Não implementar pagamento.
- Não escrever testes.
- Não criar i18n.
- Não usar drag-and-drop complexo na primeira versão (use botões mover ↑↓).
- Não usar streaming nas chamadas de IA (use response normal com loading).