/**
 * Backfill dos campos culturais (CLAUDE.md §8) para as 10 bandas do seed inicial.
 *
 * AVISO: dados verossímeis baseados em biografia pública dos artistas. A "Pessoa 3"
 * do time deve revisar / aprofundar antes do pitch (CLAUDE.md §8).
 *
 * Uso: npx tsx db/backfill-cultural.ts
 */
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { loadEnvConfig } from "@next/env"
import { eq } from "drizzle-orm"
import * as schema from "./schema"

loadEnvConfig(process.cwd())

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle(client, { schema })

type Cultural = {
  slug: string
  tradicaoMusical: string
  regiaoCultural: string
  influenciasMestres: string[]
  repertorioBase: { titulo: string; autor: string }[]
}

const culturais: Cultural[] = [
  {
    slug: "alcymar-monteiro",
    tradicaoMusical: "Pé-de-serra sergipano com matriz nordestina",
    regiaoCultural: "Baixo São Francisco — Sergipe",
    influenciasMestres: ["Luiz Gonzaga", "Jackson do Pandeiro", "Trio Nordestino"],
    repertorioBase: [
      { titulo: "Forró pé-de-serra", autor: "Alcymar Monteiro" },
      { titulo: "Asa Branca", autor: "Luiz Gonzaga / Humberto Teixeira" },
      { titulo: "Sebastiana", autor: "Rosil Cavalcanti" },
    ],
  },
  {
    slug: "flavio-jose",
    tradicaoMusical: "Xote romântico pernambucano",
    regiaoCultural: "Zona da Mata pernambucana",
    influenciasMestres: ["Luiz Gonzaga", "Dominguinhos", "Trio Nordestino"],
    repertorioBase: [
      { titulo: "Vida de Viajante", autor: "Luiz Gonzaga / Hervê Cordovil" },
      { titulo: "Olha pro Céu", autor: "Luiz Gonzaga / José Fernandes" },
      { titulo: "Pagode Russo", autor: "Luiz Gonzaga / Zé Dantas" },
    ],
  },
  {
    slug: "mestrinho",
    tradicaoMusical: "Baião instrumental e forró pé-de-serra contemporâneo",
    regiaoCultural: "Sertão cearense",
    influenciasMestres: ["Dominguinhos", "Sivuca", "Hermeto Pascoal", "Luiz Gonzaga"],
    repertorioBase: [
      { titulo: "Asa Branca", autor: "Luiz Gonzaga / Humberto Teixeira" },
      { titulo: "Frevo Mulher", autor: "Zé Ramalho" },
      { titulo: "Lamento Sertanejo", autor: "Dominguinhos / Gilberto Gil" },
    ],
  },
  {
    slug: "wesley-safadao",
    tradicaoMusical: "Forró eletrônico cearense pós-2010",
    regiaoCultural: "Região metropolitana de Fortaleza",
    influenciasMestres: ["Frank Aguiar", "Aviões do Forró", "Solange Almeida"],
    repertorioBase: [
      { titulo: "Camarote", autor: "Wesley Safadão" },
      { titulo: "Ar Condicionado no 15", autor: "Wesley Safadão" },
      { titulo: "Coração Machucado", autor: "Wesley Safadão" },
    ],
  },
  {
    slug: "solange-almeida",
    tradicaoMusical: "Forró eletrônico cearense",
    regiaoCultural: "Região metropolitana de Fortaleza",
    influenciasMestres: ["Aviões do Forró", "Mastruz com Leite", "Frank Aguiar"],
    repertorioBase: [
      { titulo: "Metade de Mim Quer Te Esquecer", autor: "Solange Almeida" },
      { titulo: "Tô Solto na Night", autor: "Solange Almeida" },
      { titulo: "Tantinho", autor: "Solange Almeida" },
    ],
  },
  {
    slug: "mastruz-com-leite",
    tradicaoMusical: "Forró eletrônico — escola cearense dos anos 90",
    regiaoCultural: "Região metropolitana de Fortaleza",
    influenciasMestres: ["Luiz Gonzaga", "Dominguinhos", "Trio Nordestino"],
    repertorioBase: [
      { titulo: "Pra Que Mentir", autor: "Emanuel Gomes" },
      { titulo: "Magia do Amor", autor: "Emanuel Gomes" },
      { titulo: "A Carta", autor: "Mastruz com Leite" },
    ],
  },
  {
    slug: "calcinha-preta",
    tradicaoMusical: "Forró eletrônico sergipano — vertente romântica",
    regiaoCultural: "Baixo São Francisco — Aracaju",
    influenciasMestres: ["Mastruz com Leite", "Aviões do Forró"],
    repertorioBase: [
      { titulo: "Cobertor", autor: "Calcinha Preta" },
      { titulo: "Você Não Vale Nada", autor: "Calcinha Preta" },
      { titulo: "Amor Sem Compromisso", autor: "Calcinha Preta" },
    ],
  },
  {
    slug: "avioes-do-forro",
    tradicaoMusical: "Forró universitário — eletrônico pop dos anos 2000",
    regiaoCultural: "Região metropolitana de Fortaleza",
    influenciasMestres: ["Mastruz com Leite", "Frank Aguiar", "Calcinha Preta"],
    repertorioBase: [
      { titulo: "Bumbum Granada", autor: "Aviões do Forró" },
      { titulo: "Atrasadinha", autor: "Aviões do Forró" },
      { titulo: "Coração Machucado", autor: "Aviões do Forró" },
    ],
  },
  {
    slug: "cavaleiros-do-forro",
    tradicaoMusical: "Forró estilizado sergipano",
    regiaoCultural: "Baixo São Francisco — Aracaju",
    influenciasMestres: ["Mastruz com Leite", "Calcinha Preta", "Limão com Mel"],
    repertorioBase: [
      { titulo: "Mancha de Batom", autor: "Cavaleiros do Forró" },
      { titulo: "Esquema Preferido", autor: "Cavaleiros do Forró" },
      { titulo: "Refém", autor: "Cavaleiros do Forró" },
    ],
  },
  {
    slug: "mestre-anizio",
    tradicaoMusical: "Forró pé-de-serra tradicional e arrasta-pé paraibano",
    regiaoCultural: "Agreste paraibano — Borborema",
    influenciasMestres: [
      "Luiz Gonzaga",
      "Jackson do Pandeiro",
      "Dominguinhos",
      "Sivuca",
    ],
    repertorioBase: [
      { titulo: "Asa Branca", autor: "Luiz Gonzaga / Humberto Teixeira" },
      { titulo: "Baião", autor: "Luiz Gonzaga / Humberto Teixeira" },
      { titulo: "Forró de Mané Vito", autor: "Luiz Gonzaga / Zé Dantas" },
    ],
  },
]

async function main() {
  console.log(`🎼 Backfill cultural — ${culturais.length} bandas`)
  let updated = 0
  for (const c of culturais) {
    const r = await db
      .update(schema.bandas)
      .set({
        tradicaoMusical: c.tradicaoMusical,
        regiaoCultural: c.regiaoCultural,
        influenciasMestres: c.influenciasMestres,
        repertorioBase: c.repertorioBase,
      })
      .where(eq(schema.bandas.slug, c.slug))
      .returning({ id: schema.bandas.id })
    if (r.length > 0) {
      updated++
      console.log(`  ✓ ${c.slug}`)
    } else {
      console.log(`  ✗ ${c.slug} — não encontrada no DB`)
    }
  }
  console.log(`\n✅ ${updated}/${culturais.length} bandas atualizadas`)
  await client.end()
}

main().catch((err) => {
  console.error("❌ Erro:", err)
  process.exit(1)
})
