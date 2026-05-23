import { differenceInCalendarDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"

export const statusFestivalLabels = {
  planejamento: "Planejamento",
  contratacao: "Contratacao",
  programacao: "Programacao",
  execucao: "Execucao",
  encerrado: "Encerrado",
} as const

export type StatusFestival = keyof typeof statusFestivalLabels

export function getStatusFestivalColor(status: StatusFestival) {
  switch (status) {
    case "planejamento":
      return "border-zinc-300 bg-zinc-100 text-zinc-700"
    case "contratacao":
      return "border-blue-300 bg-blue-100 text-blue-800"
    case "programacao":
      return "border-yellow-400 bg-yellow-100 text-yellow-900"
    case "execucao":
      return "border-green-300 bg-green-100 text-green-800"
    case "encerrado":
      return "border-stone-300 bg-stone-100 text-stone-700"
  }
}

export function statusFestivalClassName(status: StatusFestival) {
  return cn("rounded-md border", getStatusFestivalColor(status))
}

function asFestivalDate(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function formatPeriodo(dataInicio: Date, dataFim: Date) {
  const inicio = asFestivalDate(dataInicio)
  const fim = asFestivalDate(dataFim)

  return `${format(inicio, "dd 'de' MMM", { locale: ptBR })} - ${format(
    fim,
    "dd 'de' MMM 'de' yyyy",
    { locale: ptBR }
  )}`
}

export function formatDataCompleta(data: Date) {
  return format(asFestivalDate(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function calcularDiasFestival(dataInicio: Date, dataFim: Date) {
  return Math.max(
    1,
    differenceInCalendarDays(asFestivalDate(dataFim), asFestivalDate(dataInicio)) +
      1
  )
}

export function formatBRL(value: string | number | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value

  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "Nao informado"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}
