import { z } from "zod"

export const ufsBrasileiras = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const

const dateInputSchema = z
  .string()
  .min(1, "Informe a data.")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use uma data valida.")

const timeInputSchema = z
  .string()
  .min(1, "Informe o horario.")
  .regex(/^\d{2}:\d{2}$/, "Use o formato HH:mm.")

export const palcoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do palco."),
  capacidade: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), {
      message: "Capacidade deve ser um numero inteiro.",
    })
    .refine((value) => !value || Number(value) > 0, {
      message: "Capacidade deve ser maior que zero.",
    }),
  horarioInicio: timeInputSchema.default("19:00"),
  horarioFim: timeInputSchema.default("03:00"),
})

const festivalBaseSchema = z.object({
    nome: z.string().trim().min(1, "Informe o nome do festival."),
    cidade: z.string().trim().min(1, "Informe a cidade."),
    estado: z.enum(ufsBrasileiras, {
      error: "Selecione uma UF brasileira.",
    }),
    dataInicio: dateInputSchema,
    dataFim: dateInputSchema,
    organizador: z.string().trim().optional(),
    descricao: z.string().trim().optional(),
    palcos: z
      .array(palcoSchema)
      .min(1, "Cadastre pelo menos 1 palco.")
      .max(6, "Cadastre no maximo 6 palcos."),
    orcamentoTotal: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || value.replace(/\D/g, "").length > 0, {
        message: "Informe um orcamento valido.",
      }),
    numAtracoesEstimadas: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || Number.isInteger(Number(value)), {
        message: "Numero de atracoes deve ser inteiro.",
      })
      .refine((value) => !value || Number(value) > 0, {
        message: "Numero de atracoes deve ser maior que zero.",
      }),
})

export const festivalSchema = festivalBaseSchema
  .refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
    message: "A data fim deve ser posterior a data inicio.",
    path: ["dataFim"],
  })

export const festivalStep1Schema = festivalBaseSchema
  .pick({
  nome: true,
  cidade: true,
  estado: true,
  dataInicio: true,
  dataFim: true,
  organizador: true,
  descricao: true,
})
  .refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
    message: "A data fim deve ser posterior a data inicio.",
    path: ["dataFim"],
  })

export const festivalStep2Schema = festivalBaseSchema.pick({
  palcos: true,
})

export const festivalStep3Schema = festivalBaseSchema.pick({
  orcamentoTotal: true,
  numAtracoesEstimadas: true,
})

export type FestivalFormInput = z.input<typeof festivalSchema>
export type FestivalFormData = z.output<typeof festivalSchema>
