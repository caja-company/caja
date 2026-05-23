import { db } from "@/db";
import { festivais } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";

// ─── Paleta ────────────────────────────────────────────────────────────────

const C = {
  bg: "#FAF6EE",
  primary: "#6B2D0E",
  secondary: "#9B6B4A",
  border: "#D4B896",
  card: "#FDF9F2",
  badge: "#F0E0D0",
  muted: "#B08060",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const MESES_CURTOS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatPeriodoCard(inicio: Date, fim: Date): string {
  const mi = inicio.getUTCMonth();
  const mf = fim.getUTCMonth();
  const di = inicio.getUTCDate();
  const df = fim.getUTCDate();
  const ano = inicio.getUTCFullYear();

  if (mi === mf) {
    return `${di} a ${df} de ${MESES_LONGOS[mi]} • ${ano}`;
  }
  return `${MESES_CURTOS[mi]}–${MESES_CURTOS[mf]} • ${ano}`;
}

// ─── Gradientes por estado para diferenciar visualmente ─────────────────────

function getCardGradient(estado: string): string {
  if (estado === "SE") return "linear-gradient(150deg, #8B3A0C 0%, #4A1500 100%)";
  if (estado === "PB") return "linear-gradient(150deg, #1A5276 0%, #0D2D42 100%)";
  if (estado === "RN") return "linear-gradient(150deg, #1E8449 0%, #0B4A24 100%)";
  return "linear-gradient(150deg, #6B2D0E 0%, #3A1200 100%)";
}

// ─── Página ─────────────────────────────────────────────────────────────────

export default async function AcervoFestivaisPage() {
  const todos = await db
    .select({
      id: festivais.id,
      nome: festivais.nome,
      slug: festivais.slug,
      cidade: festivais.cidade,
      estado: festivais.estado,
      dataInicio: festivais.dataInicio,
      dataFim: festivais.dataFim,
    })
    .from(festivais)
    .orderBy(asc(festivais.dataInicio));

  return (
    <main style={{ background: C.bg, minHeight: "calc(100vh - 3.5rem)" }}>
      {/* Hero */}
      <section
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "3rem 1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <p
            style={{
              color: C.secondary,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Acervo Digital do Forró Nordestino
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: C.primary,
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Festivais
          </h1>
          <p style={{ color: C.secondary, fontSize: "0.95rem" }}>
            Os grandes palcos do forró sergipano
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          {todos.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: C.muted,
              }}
            >
              Nenhum festival cadastrado ainda.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {todos.map((f) => (
                <Link
                  key={f.id}
                  href={`/acervo/festivais/${f.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                    }}
                  >
                    {/* Topo 4:3 */}
                    <div
                      style={{
                        aspectRatio: "4/3",
                        background: getCardGradient(f.estado),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        padding: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "4rem",
                          color: "rgba(255,255,255,0.18)",
                          lineHeight: 1,
                          userSelect: "none",
                        }}
                      >
                        {f.nome.charAt(0)}
                      </span>
                      <span
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 600,
                          textAlign: "center",
                          lineHeight: 1.25,
                        }}
                      >
                        {f.nome}
                      </span>
                    </div>

                    {/* Corpo */}
                    <div style={{ padding: "0.875rem 1rem 1rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: C.badge,
                          color: C.primary,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.18rem 0.55rem",
                          borderRadius: "999px",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {f.estado === "SE" ? "Sergipe" : f.estado}
                      </span>

                      <h3
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: C.primary,
                          margin: "0 0 0.2rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {f.nome}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: C.secondary,
                          margin: "0 0 0.15rem",
                        }}
                      >
                        {f.cidade}, {f.estado}
                      </p>

                      <p style={{ fontSize: "0.75rem", color: C.muted, margin: 0 }}>
                        {formatPeriodoCard(f.dataInicio, f.dataFim)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: C.muted,
          fontSize: "0.8rem",
          marginTop: "2rem",
        }}
      >
        CAJA • Acervo Digital do Forró
      </footer>
    </main>
  );
}
