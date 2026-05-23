import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import {
  CalendarDaysIcon,
  EditIcon,
  MapPinIcon,
  Music2Icon,
  PanelTopIcon,
  WalletIcon,
} from "lucide-react"

import { getFestivalById } from "@/app/festivais/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  calcularDiasFestival,
  formatBRL,
  formatDataCompleta,
  statusFestivalClassName,
  statusFestivalLabels,
  type StatusFestival,
} from "@/components/festival/festival-utils"

type FestivalDashboardPageProps = {
  params: Promise<{ id: string }>
}

export default async function FestivalDashboardPage({
  params,
}: FestivalDashboardPageProps) {
  const { id } = await params
  const festival = await getFestivalById(id)

  if (!festival) {
    notFound()
  }

  const dias = calcularDiasFestival(festival.dataInicio, festival.dataFim)
  const status = festival.status as StatusFestival

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6 rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={statusFestivalClassName(status)}
              >
                {statusFestivalLabels[status]}
              </Badge>
              <p className="flex items-center gap-1.5 text-sm text-secondary/70">
                <MapPinIcon className="size-4" />
                {festival.cidade}/{festival.estado}
              </p>
            </div>
            <h1 className="font-serif text-5xl font-medium leading-none text-secondary">
              {festival.nome}
            </h1>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-secondary/75">
              <CalendarDaysIcon className="size-4 text-primary" />
              {formatDataCompleta(festival.dataInicio)} ate{" "}
              {formatDataCompleta(festival.dataFim)}
            </p>
          </div>

          <Button variant="outline">
            <EditIcon />
            Editar
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className="h-auto w-full justify-start rounded-xl bg-card p-1">
          <TabsTrigger value="overview" className="px-3 py-2">
            Visao Geral
          </TabsTrigger>
          <TabsTrigger value="contratacoes" className="px-3 py-2">
            Contratacoes
          </TabsTrigger>
          <TabsTrigger value="programacao" className="px-3 py-2">
            Programacao
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<CalendarDaysIcon />}
              label="Dias do festival"
              value={`${dias}`}
            />
            <DashboardMetric
              icon={<PanelTopIcon />}
              label="Palcos"
              value={`${festival.totalPalcos}`}
            />
            <DashboardMetric
              icon={<Music2Icon />}
              label="Atracoes contratadas"
              value={`${festival.totalContratacoes}`}
            />
            <DashboardMetric
              icon={<WalletIcon />}
              label="Orcamento total"
              value={formatBRL(festival.orcamentoTotal)}
            />
          </section>
        </TabsContent>

        <TabsContent value="contratacoes">
          <Placeholder title="Contratacoes" />
        </TabsContent>

        <TabsContent value="programacao">
          <Placeholder title="Programacao" />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function DashboardMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-secondary/70">
          <span className="text-primary [&_svg]:size-4">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-secondary">{value}</p>
      </CardContent>
    </Card>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex min-h-56 items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold text-secondary">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Em breve.</p>
        </div>
      </CardContent>
    </Card>
  )
}
