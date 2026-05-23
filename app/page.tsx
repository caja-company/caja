import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-base font-semibold tracking-tight text-secondary">
          Cajá
        </span>
        <nav className="hidden items-center gap-8 text-sm text-secondary/80 sm:flex">
          <Link href="#produto" className="hover:text-secondary">
            Produto
          </Link>
          <Link href="#precos" className="hover:text-secondary">
            Preços
          </Link>
          <Link href="#contato" className="hover:text-secondary">
            Contato
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-6 inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-secondary">
          Beta privado — primeira safra de festivais
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-secondary sm:text-5xl md:text-6xl">
          A operação dos festivais culturais brasileiros, profissionalizada.
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-secondary/70 sm:text-lg">
          Programação, equipes, fornecedores e prestação de contas em um só
          lugar. Menos planilha, menos WhatsApp, mais festival.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/demo" className={buttonVariants({ size: "lg" })}>
            Ver demo
          </Link>
          <Link
            href="#produto"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Saiba mais
          </Link>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-secondary/60">
        © {new Date().getFullYear()} Cajá. Feito no Brasil.
      </footer>
    </main>
  )
}
