"use client"

import { useMemo, useState, useTransition, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { criarFestival } from "@/app/festivais/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  festivalSchema,
  festivalStep1Schema,
  festivalStep2Schema,
  type FestivalFormInput,
  ufsBrasileiras,
} from "@/lib/schemas/festival"
import { cn } from "@/lib/utils"

const defaultValues: FestivalFormInput = {
  nome: "",
  cidade: "",
  estado: "SE",
  dataInicio: "",
  dataFim: "",
  organizador: "",
  descricao: "",
  palcos: [
    {
      nome: "Palco Principal",
      capacidade: "",
      horarioInicio: "19:00",
      horarioFim: "03:00",
    },
  ],
  orcamentoTotal: "",
  numAtracoesEstimadas: "",
}

export default function NovoFestivalPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const form = useForm<FestivalFormInput>({
    resolver: zodResolver(festivalSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "palcos",
  })

  const values = form.watch()
  const step1Valid = useMemo(
    () =>
      festivalStep1Schema.safeParse({
        nome: values.nome,
        cidade: values.cidade,
        estado: values.estado,
        dataInicio: values.dataInicio,
        dataFim: values.dataFim,
        organizador: values.organizador,
        descricao: values.descricao,
      }).success,
    [values]
  )
  const step2Valid = useMemo(
    () => festivalStep2Schema.safeParse({ palcos: values.palcos }).success,
    [values.palcos]
  )
  const canGoNext = step === 1 ? step1Valid : step2Valid

  async function handleNext() {
    const fieldsToValidate =
      step === 1
        ? ([
            "nome",
            "cidade",
            "estado",
            "dataInicio",
            "dataFim",
            "organizador",
            "descricao",
          ] as const)
        : (["palcos"] as const)

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid && canGoNext) {
      setStep((current) => Math.min(3, current + 1))
    }
  }

  function onSubmit(data: FestivalFormInput) {
    startTransition(async () => {
      try {
        const result = await criarFestival(data)
        toast.success("Festival criado com sucesso.")
        router.push(`/festivais/${result.id}`)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Nao foi possivel criar o festival."
        )
      }
    })
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-4xl font-medium text-secondary">
          Novo Festival
        </h1>
        <p className="mt-2 text-sm text-secondary/70">
          Cadastre os dados operacionais para iniciar o planejamento.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition",
                  item <= step
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {item}
              </div>
              {item < 3 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition",
                    item < step ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-secondary">Passo {step}/3</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="animate-in fade-in duration-300">
          {step === 1 && <Step1 form={form} />}
          {step === 2 && (
            <Step2
              form={form}
              fields={fields}
              onAdd={() =>
                append({
                  nome: "",
                  capacidade: "",
                  horarioInicio: "19:00",
                  horarioFim: "03:00",
                })
              }
              onRemove={remove}
            />
          )}
          {step === 3 && <Step3 form={form} />}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1 || isPending}
          >
            <ArrowLeftIcon />
            Voltar
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext || isPending}
            >
              Proximo
              <ArrowRightIcon />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar festival"}
            </Button>
          )}
        </div>
      </form>
    </main>
  )
}

type FormApi = ReturnType<typeof useForm<FestivalFormInput>>

function Step1({ form }: { form: FormApi }) {
  const errors = form.formState.errors

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Dados basicos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do festival" error={errors.nome?.message}>
          <Input {...form.register("nome")} placeholder="Forro Caju 2026" />
        </Field>
        <Field label="Cidade" error={errors.cidade?.message}>
          <Input {...form.register("cidade")} placeholder="Aracaju" />
        </Field>
        <Field label="Estado" error={errors.estado?.message}>
          <select
            {...form.register("estado")}
            defaultValue="SE"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            {ufsBrasileiras.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Organizador" error={errors.organizador?.message}>
          <Input {...form.register("organizador")} placeholder="Prefeitura" />
        </Field>
        <Field label="Data inicio" error={errors.dataInicio?.message}>
          <Input type="date" {...form.register("dataInicio")} />
        </Field>
        <Field label="Data fim" error={errors.dataFim?.message}>
          <Input type="date" {...form.register("dataFim")} />
        </Field>
        <Field
          label="Descricao"
          error={errors.descricao?.message}
          className="md:col-span-2"
        >
          <Textarea
            {...form.register("descricao")}
            placeholder="Resumo do festival"
            className="min-h-24"
          />
        </Field>
      </CardContent>
    </Card>
  )
}

function Step2({
  form,
  fields,
  onAdd,
  onRemove,
}: {
  form: FormApi
  fields: { id: string }[]
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  const errors = form.formState.errors

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Palcos</CardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={onAdd}
            disabled={fields.length >= 6}
          >
            <PlusIcon />
            Adicionar palco
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-border/70 bg-background p-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]"
          >
            <Field
              label="Nome"
              error={errors.palcos?.[index]?.nome?.message}
            >
              <Input
                {...form.register(`palcos.${index}.nome`)}
                placeholder="Palco Principal"
              />
            </Field>
            <Field
              label="Capacidade"
              error={errors.palcos?.[index]?.capacidade?.message}
            >
              <Input
                type="number"
                min="1"
                {...form.register(`palcos.${index}.capacidade`)}
                placeholder="30000"
              />
            </Field>
            <Field
              label="Inicio"
              error={errors.palcos?.[index]?.horarioInicio?.message}
            >
              <Input type="time" {...form.register(`palcos.${index}.horarioInicio`)} />
            </Field>
            <Field
              label="Fim"
              error={errors.palcos?.[index]?.horarioFim?.message}
            >
              <Input type="time" {...form.register(`palcos.${index}.horarioFim`)} />
            </Field>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onRemove(index)}
                disabled={fields.length === 1}
                className="w-full"
              >
                <Trash2Icon />
                Remover
              </Button>
            </div>
          </div>
        ))}
        {typeof errors.palcos?.message === "string" && (
          <p className="text-sm text-destructive">{errors.palcos.message}</p>
        )}
      </CardContent>
    </Card>
  )
}

function Step3({ form }: { form: FormApi }) {
  const values = form.watch()
  const errors = form.formState.errors

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Orcamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Orcamento total" error={errors.orcamentoTotal?.message}>
            <Input
              value={values.orcamentoTotal ?? ""}
              onChange={(event) =>
                form.setValue(
                  "orcamentoTotal",
                  formatCurrencyInput(event.target.value),
                  { shouldValidate: true, shouldDirty: true }
                )
              }
              inputMode="numeric"
              placeholder="R$ 5.000.000,00"
            />
          </Field>
          <Field
            label="Numero estimado de atracoes"
            error={errors.numAtracoesEstimadas?.message}
          >
            <Input
              type="number"
              min="1"
              {...form.register("numAtracoesEstimadas")}
              placeholder="120"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Revisao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ReviewRow label="Festival" value={values.nome || "Nao informado"} />
          <ReviewRow
            label="Local"
            value={`${values.cidade || "Cidade"}/${values.estado || "UF"}`}
          />
          <ReviewRow
            label="Periodo"
            value={`${values.dataInicio || "--"} ate ${values.dataFim || "--"}`}
          />
          <ReviewRow
            label="Organizador"
            value={values.organizador || "Nao informado"}
          />
          <div>
            <p className="mb-2 text-xs uppercase text-muted-foreground">Palcos</p>
            <div className="space-y-2">
              {values.palcos.map((palco, index) => (
                <div
                  key={`${palco.nome}-${index}`}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <p className="font-medium text-secondary">
                    {palco.nome || `Palco ${index + 1}`}
                  </p>
                  <p className="text-muted-foreground">
                    {palco.capacidade || "Capacidade nao informada"} pessoas -
                    {" "}
                    {palco.horarioInicio} as {palco.horarioFim}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn("space-y-1.5 text-sm font-medium text-secondary", className)}>
      <span>{label}</span>
      {children}
      {error && <p className="text-xs font-normal text-destructive">{error}</p>}
    </label>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="font-medium text-secondary">{value}</p>
    </div>
  )
}

function formatCurrencyInput(value: string) {
  const cents = value.replace(/\D/g, "")
  const amount = Number(cents || "0") / 100

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}
