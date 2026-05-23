import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-6 inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-secondary">
          Acervo cultural vivo do forró nordestino
        </p>

        <h1 className="font-serif text-7xl font-medium leading-none tracking-tight text-secondary sm:text-8xl md:text-9xl">
          Cajá
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-secondary/80 sm:text-xl">
          A operação dos festivais culturais brasileiros, profissionalizada.
        </p>

        <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-secondary/60">
          Programação, contratações e curadoria com IA — em um só lugar.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/festivais" className={buttonVariants({ size: "lg" })}>
            Ver festivais
          </Link>
          <Link
            href="/atracoes"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Banco de atrações
          </Link>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-secondary/60">
        © {new Date().getFullYear()} Cajá. Feito no Nordeste.
      </footer>
    </main>
  )
}
