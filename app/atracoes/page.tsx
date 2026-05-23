import { db } from "@/db";
import { bandas, estiloMusicalEnum } from "@/db/schema";
import { count, ilike, eq, and, or } from "drizzle-orm";
import Link from "next/link";

const C = {
  bg: "#FAF6EE",
  primary: "#6B2D0E",
  secondary: "#9B6B4A",
  border: "#D4B896",
  card: "#FDF9F2",
  badge: "#F0E0D0",
  muted: "#B08060",
};

const ESTILO_LABELS: Record<string, string> = {
  pe_de_serra: "Pé-de-Serra",
  xote: "Xote",
  baiao: "Baião",
  forro_eletronico: "Forró Eletrônico",
  forro_universitario: "Forró Universitário",
  forro_estilizado: "Forró Estilizado",
  arrasta_pe: "Arrasta-pé",
  outro: "Outro",
};

type PageProps = { searchParams: Promise<{ q?: string; estilo?: string }> };

export default async function AtracoesPage({ searchParams }: PageProps) {
  const { q, estilo } = await searchParams;

  const validEstilo =
    estilo && (estiloMusicalEnum.enumValues as string[]).includes(estilo)
      ? (estilo as (typeof estiloMusicalEnum.enumValues)[number])
      : null;

  const [atracoes, [{ total }]] = await Promise.all([
    db
      .select({
        id: bandas.id,
        nome: bandas.nome,
        slug: bandas.slug,
        estilo: bandas.estilo,
        cidadeOrigem: bandas.cidadeOrigem,
        estadoOrigem: bandas.estadoOrigem,
        fotoUrl: bandas.fotoUrl,
      })
      .from(bandas)
      .where(
        and(
          q?.trim()
            ? or(
                ilike(bandas.nome, `%${q}%`),
                ilike(bandas.cidadeOrigem, `%${q}%`),
                ilike(bandas.estadoOrigem, `%${q}%`)
              )
            : undefined,
          validEstilo ? eq(bandas.estilo, validEstilo) : undefined
        )
      )
      .orderBy(bandas.nome),
    db.select({ total: count() }).from(bandas),
  ]);

  const hasFilter = Boolean(q || estilo);

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
            Banco de Atrações
          </h1>
          <p style={{ color: C.secondary, fontSize: "0.95rem" }}>
            <strong style={{ color: C.primary }}>{total}</strong> artistas
            cadastrados no acervo
            {hasFilter && (
              <span style={{ color: C.muted }}>
                {" "}
                — mostrando {atracoes.length} resultado
                {atracoes.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Busca */}
      <section
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: `1px solid ${C.border}`,
          background: C.card,
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <form
            method="GET"
            action="/atracoes"
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              name="q"
              type="text"
              defaultValue={q ?? ""}
              placeholder="Buscar por nome, cidade ou estado…"
              style={{
                flex: "1 1 220px",
                padding: "0.6rem 1rem",
                border: `1px solid ${C.border}`,
                borderRadius: "0.5rem",
                background: C.bg,
                color: C.primary,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <select
              name="estilo"
              defaultValue={estilo ?? ""}
              style={{
                flex: "1 1 190px",
                padding: "0.6rem 1rem",
                border: `1px solid ${C.border}`,
                borderRadius: "0.5rem",
                background: C.bg,
                color: C.primary,
                fontSize: "0.9rem",
                minWidth: "190px",
              }}
            >
              <option value="">Todos os estilos</option>
              {estiloMusicalEnum.enumValues.map((v) => (
                <option key={v} value={v}>
                  {ESTILO_LABELS[v]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                padding: "0.6rem 1.5rem",
                background: C.primary,
                color: "#FEF9F2",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Buscar
            </button>
            {hasFilter && (
              <Link
                href="/atracoes"
                style={{
                  color: C.secondary,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Limpar filtros
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          {atracoes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: C.secondary,
              }}
            >
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                Nenhuma atração encontrada.
              </p>
              <Link
                href="/atracoes"
                style={{ color: C.primary, fontWeight: 600, fontSize: "0.9rem" }}
              >
                Limpar filtros
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {atracoes.map((a) => (
                <Link
                  key={a.id}
                  href={`/atracoes/${a.slug}`}
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
                    {/* Foto 4:3 */}
                    <div
                      style={{
                        aspectRatio: "4/3",
                        background: `linear-gradient(135deg, #E8D5C0 0%, #D4B896 100%)`,
                        overflow: "hidden",
                      }}
                    >
                      {a.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.fotoUrl}
                          alt={a.nome}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "Georgia, serif",
                            fontSize: "3.5rem",
                            color: C.primary,
                            opacity: 0.6,
                          }}
                        >
                          {a.nome.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Corpo do card */}
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
                        {ESTILO_LABELS[a.estilo] ?? a.estilo}
                      </span>
                      <h3
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: C.primary,
                          margin: "0 0 0.2rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {a.nome}
                      </h3>
                      {(a.cidadeOrigem || a.estadoOrigem) && (
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: C.secondary,
                            margin: 0,
                          }}
                        >
                          {[a.cidadeOrigem, a.estadoOrigem]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
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
