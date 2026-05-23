import Link from "next/link"
import { CalendarDaysIcon, MapPinIcon, PlusIcon, TentTreeIcon } from "lucide-react"

import { listarFestivais } from "@/app/festivais/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  calcularDiasFestival,
  formatPeriodo,
  statusFestivalClassName,
  statusFestivalLabels,
  type StatusFestival,
} from "@/components/festival/festival-utils"

export default async function FestivaisPage() {
  const festivais = await listarFestivais()

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-medium text-secondary">
            Festivais
          </h1>
          <p className="mt-2 text-sm text-secondary/70">
            Planeje palcos, contratações e programação dos eventos culturais.
          </p>
        </div>

        <Button render={<Link href="/festivais/novo" />}>
          <PlusIcon />
          Novo Festival
        </Button>
      </header>

      {festivais.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {festivais.map((festival) => {
            const dias = calcularDiasFestival(
              festival.dataInicio,
              festival.dataFim
            )

            return (
              <Link
                key={festival.id}
                href={`/festivais/${festival.id}`}
                className="block h-full"
              >
                <Card className="h-full rounded-lg border-border/70 transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold leading-tight text-secondary">
                          {festival.nome}
                        </h2>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPinIcon className="size-4" />
                          {festival.cidade}/{festival.estado}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusFestivalClassName(
                          festival.status as StatusFestival
                        )}
                      >
                        {statusFestivalLabels[festival.status as StatusFestival]}
                      </Badge>
                    </div>

                    <p className="flex items-center gap-1.5 text-sm text-secondary/80">
                      <CalendarDaysIcon className="size-4 text-primary" />
                      {formatPeriodo(festival.dataInicio, festival.dataFim)}
                    </p>

                    <div className="mt-auto grid grid-cols-3 gap-2 text-center">
                      <Metric label="atrações" value={festival.totalContratacoes} />
                      <Metric label="palcos" value={festival.totalPalcos} />
                      <Metric label="dias" value={dias} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </section>
      ) : (
        <section className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/70 p-10 text-center">
          <div className="mb-4 rounded-full bg-accent/20 p-3 text-secondary">
            <TentTreeIcon className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-secondary">
            Nenhum festival cadastrado
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Crie o primeiro festival para começar a organizar palcos,
            contratações e programação.
          </p>
          <Button className="mt-5" render={<Link href="/festivais/novo" />}>
            <PlusIcon />
            Novo Festival
          </Button>
        </section>
      )}
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-3">
      <p className="text-lg font-semibold text-secondary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
