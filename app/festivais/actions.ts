"use server"

import { count, eq } from "drizzle-orm"

import { db } from "@/db"
import { contratacoes, festivais, palcos } from "@/db/schema"
import { festivalSchema, type FestivalFormInput } from "@/lib/schemas/festival"

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function gerarSlugUnico(nome: string) {
  const baseSlug = slugify(nome) || "festival"
  let candidate = baseSlug
  let suffix = 2

  while (true) {
    const [existing] = await db
      .select({ id: festivais.id })
      .from(festivais)
      .where(eq(festivais.slug, candidate))
      .limit(1)

    if (!existing) return candidate

    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

function parseCurrency(value: string | undefined) {
  if (!value) return null
  const cents = value.replace(/\D/g, "")
  if (!cents) return null
  return String(Number(cents) / 100)
}

function parseOptionalInteger(value: string | undefined) {
  return value ? Number(value) : null
}

export async function criarFestival(input: FestivalFormInput) {
  const data = festivalSchema.parse(input)
  const slug = await gerarSlugUnico(data.nome)

  const festivalCriado = await db.transaction(async (tx) => {
    const [festival] = await tx
      .insert(festivais)
      .values({
        nome: data.nome,
        slug,
        cidade: data.cidade,
        estado: data.estado,
        dataInicio: new Date(`${data.dataInicio}T12:00:00`),
        dataFim: new Date(`${data.dataFim}T12:00:00`),
        organizador: data.organizador || null,
        descricao: data.descricao || null,
        orcamentoTotal: parseCurrency(data.orcamentoTotal),
        numAtracoesEstimadas: parseOptionalInteger(data.numAtracoesEstimadas),
        status: "planejamento",
      })
      .returning({ id: festivais.id })

    await tx.insert(palcos).values(
      data.palcos.map((palco, index) => ({
        festivalId: festival.id,
        nome: palco.nome,
        capacidade: parseOptionalInteger(palco.capacidade),
        horarioInicio: palco.horarioInicio,
        horarioFim: palco.horarioFim,
        ordem: index + 1,
      }))
    )

    return festival
  })

  return { id: festivalCriado.id }
}

export async function listarFestivais() {
  const rows = await db.select().from(festivais)

  return Promise.all(
    rows.map(async (festival) => {
      const [[palcosCount], [contratacoesCount]] = await Promise.all([
        db
          .select({ total: count() })
          .from(palcos)
          .where(eq(palcos.festivalId, festival.id)),
        db
          .select({ total: count() })
          .from(contratacoes)
          .where(eq(contratacoes.festivalId, festival.id)),
      ])

      return {
        ...festival,
        totalPalcos: palcosCount.total,
        totalContratacoes: contratacoesCount.total,
      }
    })
  )
}

export async function getFestivalById(id: string) {
  const [festival] = await db
    .select()
    .from(festivais)
    .where(eq(festivais.id, id))
    .limit(1)

  if (!festival) return null

  const [[palcosCount], [contratacoesCount]] = await Promise.all([
    db
      .select({ total: count() })
      .from(palcos)
      .where(eq(palcos.festivalId, id)),
    db
      .select({ total: count() })
      .from(contratacoes)
      .where(eq(contratacoes.festivalId, id)),
  ])

  return {
    ...festival,
    totalPalcos: palcosCount.total,
    totalContratacoes: contratacoesCount.total,
  }
}
