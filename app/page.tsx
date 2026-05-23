import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

// ─── Dados das cidades ───────────────────────────────────────────────────────

const CIDADES = [
  {
    nome: "Aracaju",
    slug: "aracaju",
    bio: "Capital de Sergipe e coração do forró nordestino. Terra do Forró Caju e do maior arraiá à beira-mar do Brasil, Aracaju pulsa forró durante todo o mês de junho na Orla da Atalaia.",
    nomeLeft: true,
    imageUrl: "https://www.viajenaviagem.com/wp-content/uploads/2022/01/1-Largo-da-Gente-Sergipana-1920x1080-1.jpg.webp",
  },
  {
    nome: "Estância",
    slug: "estancia",
    bio: "A Cidade Jardim do sul sergipano é terra do lendário Barco de Fogo, patrimônio imaterial de Sergipe criado por Chico Surdo no fim dos anos 1930. Trinta dias de festa, pólvora e forró todo mês de junho.",
    nomeLeft: false,
    imageUrl: "https://www.gov.br/turismo/pt-br/assuntos/noticias/governo-federal-por-meio-do-mtur-viabiliza-construcao-de-praca-em-estancia-se/EstnciaSeturSergipe.png/@@images/5e3e1603-a3e6-4404-85b7-9198ec088fa7.png",
  },
  {
    nome: "Lagarto",
    slug: "lagarto",
    bio: "No centro-sul de Sergipe, Lagarto celebra junho com a tradicional Silibrina — guerra de buscapés e espadas de fogo — e o Festival da Mandioca, que abre os festejos ainda em maio.",
    nomeLeft: true,
    imageUrl: "https://www.skyscrapercity.com/attachments/1693760915507-png.5792704/",
  },
]

// ─── Página ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <style>{`
        .cidades-btn:hover {
          background: #6B2D0E !important;
          color: white !important;
        }
      `}</style>

      {/* ── Hero (intocado) ────────────────────────────────────────────────── */}
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

      {/* ── Acervo de Cidades ─────────────────────────────────────────────── */}
      <section style={{ background: "#FAF6EE" }}>

        {/* Título */}
        <div style={{ textAlign: "center", padding: "3rem 1.5rem 2rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9B6B4A",
              marginBottom: "0.75rem",
            }}
          >
            Acervo de Cidades
          </p>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 600,
              color: "#6B2D0E",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Os palcos do forró sergipano
          </h2>
        </div>

        {/* Blocos */}
        {CIDADES.map((cidade) => {
          const nomePos: React.CSSProperties = cidade.nomeLeft
            ? { left: "clamp(1.5rem, 6vw, 5rem)" }
            : { right: "clamp(1.5rem, 6vw, 5rem)" }

          const cardPos: React.CSSProperties = cidade.nomeLeft
            ? { right: "clamp(1.5rem, 6vw, 5rem)" }
            : { left: "clamp(1.5rem, 6vw, 5rem)" }

          return (
            <div
              key={cidade.slug}
              style={{
                position: "relative",
                height: "500px",
                background: "#C4A882",
                backgroundImage: cidade.imageUrl ? `url("${cidade.imageUrl}")` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
            >
              {/* Overlay escuro */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                }}
              />

              {/* Nome da cidade */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  ...nomePos,
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(2.5rem, 7vw, 5rem)",
                    fontWeight: "bold",
                    color: "white",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {cidade.nome}
                </span>
              </div>

              {/* Card flutuante */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "320px",
                  maxWidth: "calc(100% - 3rem)",
                  background: "rgba(250, 246, 238, 0.95)",
                  borderRadius: "12px",
                  padding: "2rem",
                  zIndex: 1,
                  ...cardPos,
                }}
              >
                <p
                  style={{
                    color: "#3D1F0A",
                    fontSize: "0.92rem",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    marginTop: 0,
                  }}
                >
                  {cidade.bio}
                </p>
                <Link
                  href={`/acervo/cidades/${cidade.slug}`}
                  className="cidades-btn"
                  style={{
                    display: "inline-block",
                    padding: "0.55rem 1.4rem",
                    border: "1.5px solid #6B2D0E",
                    borderRadius: "0.4rem",
                    background: "transparent",
                    color: "#6B2D0E",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 0.18s, color 0.18s",
                    cursor: "pointer",
                  }}
                >
                  Veja +
                </Link>
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Footer (intocado) ─────────────────────────────────────────────── */}
      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-secondary/60">
        © {new Date().getFullYear()} Cajá. Feito no Nordeste.
      </footer>
    </main>
  )
}
