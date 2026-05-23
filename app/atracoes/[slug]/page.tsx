import { db } from "@/db";
import { bandas, contratacoes, festivais } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

const C = {
  bg: "#FAF6EE",
  primary: "#6B2D0E",
  secondary: "#9B6B4A",
  border: "#D4B896",
  card: "#FDF9F2",
  badge: "#F0E0D0",
  muted: "#B08060",
  divider: "#E8D5C0",
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


const STATUS_LABELS: Record<string, string> = {
  prospeccao: "Prospecção",
  negociacao: "Negociação",
  contratado: "Contratado",
  rider_pendente: "Rider Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  prospeccao: { bg: "#E0ECF4", text: "#1E5A7C" },
  negociacao: { bg: "#FEF3C7", text: "#92400E" },
  contratado: { bg: "#D1FAE5", text: "#065F46" },
  rider_pendente: { bg: "#FED7AA", text: "#7C2D12" },
  confirmado: { bg: "#DCFCE7", text: "#14532D" },
  cancelado: { bg: "#FEE2E2", text: "#991B1B" },
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\n?#]+)/,
    /youtu\.be\/([^?&#\n]+)/,
    /youtube\.com\/embed\/([^?&#\n]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatCurrency(value: string | null): string {
  if (!value) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function AtracoesDetalhePage({ params }: PageProps) {
  const { slug } = await params;

  const banda = await db.query.bandas.findFirst({
    where: eq(bandas.slug, slug),
  });

  if (!banda) notFound();

  const historico = await db
    .select({
      festivalNome: festivais.nome,
      festivalSlug: festivais.slug,
      festivalCidade: festivais.cidade,
      festivalEstado: festivais.estado,
      festivalDataInicio: festivais.dataInicio,
      status: contratacoes.status,
      valorContrato: contratacoes.valorContrato,
    })
    .from(contratacoes)
    .innerJoin(festivais, eq(contratacoes.festivalId, festivais.id))
    .where(eq(contratacoes.bandaId, banda.id))
    .orderBy(festivais.dataInicio);

  const videoId = banda.videoYoutubeUrl
    ? extractYouTubeId(banda.videoYoutubeUrl)
    : null;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .detail-hero { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
          .detail-hero-foto { max-width: 100% !important; aspect-ratio: 16/9 !important; border-radius: 0.5rem !important; }
        }
      `}</style>
    <main style={{ background: C.bg, minHeight: "calc(100vh - 3.5rem)" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "0.75rem 1.5rem",
          background: C.card,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            fontSize: "0.8rem",
            color: C.secondary,
          }}
        >
          <Link
            href="/atracoes"
            style={{ color: C.secondary, textDecoration: "none" }}
          >
            Banco de Atrações
          </Link>
          <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>/</span>
          <span style={{ color: C.primary }}>{banda.nome}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Hero */}
        <section
          className="detail-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "2rem",
            marginBottom: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Foto */}
          <div
            className="detail-hero-foto"
            style={{
              aspectRatio: "4/3",
              borderRadius: "0.75rem",
              overflow: "hidden",
              background: `linear-gradient(135deg, #E8D5C0, #D4B896)`,
              border: `1px solid ${C.border}`,
            }}
          >
            {banda.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banda.fotoUrl}
                alt={banda.nome}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  fontSize: "4rem",
                  color: C.primary,
                  opacity: 0.6,
                }}
              >
                {banda.nome.charAt(0)}
              </div>
            )}
          </div>

          {/* Info principal */}
          <div>
            <span
              style={{
                display: "inline-block",
                background: C.badge,
                color: C.primary,
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "0.22rem 0.65rem",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "0.75rem",
              }}
            >
              {ESTILO_LABELS[banda.estilo] ?? banda.estilo}
            </span>

            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: C.primary,
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}
            >
              {banda.nome}
            </h1>

            {(banda.cidadeOrigem || banda.estadoOrigem) && (
              <p
                style={{
                  color: C.secondary,
                  fontSize: "0.95rem",
                  marginBottom: "1.25rem",
                }}
              >
                📍{" "}
                {[banda.cidadeOrigem, banda.estadoOrigem]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}

            {banda.regiaoCultural && (
              <p
                style={{
                  color: C.muted,
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                  fontStyle: "italic",
                }}
              >
                {banda.regiaoCultural}
              </p>
            )}

            {/* Links sociais */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {banda.instagramHandle && (
                <a
                  href={`https://instagram.com/${banda.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.4rem 0.9rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.4rem",
                    color: C.secondary,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                    background: C.card,
                  }}
                >
                  Instagram
                </a>
              )}
              {banda.spotifyUrl && (
                <a
                  href={banda.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.4rem 0.9rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.4rem",
                    color: C.secondary,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                    background: C.card,
                  }}
                >
                  Spotify
                </a>
              )}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Link
                href={`/artista/${banda.slug}`}
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1.1rem",
                  background: C.primary,
                  color: "#FEF9F2",
                  textDecoration: "none",
                  borderRadius: "0.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Ver portal público →
              </Link>
            </div>
          </div>
        </section>

        {/* Bio */}
        {banda.bio && (
          <Section title="Biografia">
            <p
              style={{
                color: C.primary,
                lineHeight: 1.75,
                fontSize: "0.95rem",
              }}
            >
              {banda.bio}
            </p>
          </Section>
        )}

        {/* Dados Culturais */}
        {(banda.tradicaoMusical ||
          banda.influenciasMestres?.length ||
          banda.repertorioBase?.length) && (
          <Section title="Acervo Cultural">
            {banda.tradicaoMusical && (
              <Field label="Tradição Musical" value={banda.tradicaoMusical} />
            )}
            {banda.regiaoCultural && (
              <Field label="Região Cultural" value={banda.regiaoCultural} />
            )}
            {banda.influenciasMestres && banda.influenciasMestres.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: C.muted,
                    marginBottom: "0.4rem",
                  }}
                >
                  Mestres e Influências
                </p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {banda.influenciasMestres.map((m) => (
                    <span
                      key={m}
                      style={{
                        background: C.badge,
                        color: C.primary,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.82rem",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {banda.repertorioBase && banda.repertorioBase.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: C.muted,
                    marginBottom: "0.5rem",
                  }}
                >
                  Repertório Base
                </p>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.88rem",
                  }}
                >
                  <tbody>
                    {banda.repertorioBase.map((r, i) => (
                      <tr
                        key={i}
                        style={{
                          borderTop: i === 0 ? "none" : `1px solid ${C.divider}`,
                        }}
                      >
                        <td style={{ padding: "0.4rem 0", color: C.primary }}>
                          {r.titulo}
                        </td>
                        <td
                          style={{
                            padding: "0.4rem 0",
                            color: C.muted,
                            textAlign: "right",
                          }}
                        >
                          {r.autor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {/* Notas Internas */}
        {banda.notasInternas && (
          <Section title="Notas Internas">
            <div
              style={{
                background: "#FEF3C7",
                border: `1px solid #F0D060`,
                borderRadius: "0.5rem",
                padding: "1rem 1.25rem",
                fontSize: "0.9rem",
                color: "#78350F",
                lineHeight: 1.65,
              }}
            >
              {banda.notasInternas}
            </div>
          </Section>
        )}

        {/* Histórico de Festivais */}
        <Section title="Histórico de Festivais">
          {historico.length === 0 ? (
            <p style={{ color: C.muted, fontSize: "0.9rem" }}>
              Nenhuma participação registrada ainda.
            </p>
          ) : (
            <div
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              {historico.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.875rem 1.25rem",
                    borderTop: i === 0 ? "none" : `1px solid ${C.divider}`,
                    background: i % 2 === 0 ? C.card : C.bg,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        color: C.primary,
                        fontSize: "0.9rem",
                        marginBottom: "0.1rem",
                      }}
                    >
                      {h.festivalNome}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: C.muted }}>
                      {h.festivalCidade}/{h.festivalEstado} •{" "}
                      {formatDate(h.festivalDataInicio)}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {h.valorContrato && (
                      <span
                        style={{ fontSize: "0.85rem", color: C.secondary }}
                      >
                        {formatCurrency(h.valorContrato)}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background:
                          STATUS_COLORS[h.status]?.bg ?? "#F5F5F5",
                        color:
                          STATUS_COLORS[h.status]?.text ?? "#333",
                      }}
                    >
                      {STATUS_LABELS[h.status] ?? h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Vídeo YouTube */}
        {videoId && (
          <Section title="Vídeo">
            <div
              style={{
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                aspectRatio: "16/9",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${banda.nome} — vídeo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </Section>
        )}
      </div>

      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: C.muted,
          fontSize: "0.8rem",
          marginTop: "1rem",
        }}
      >
        CAJA • Acervo Digital do Forró
      </footer>
    </main>
    </>
  );
}

// Sub-componentes de layout

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: "2.5rem",
        paddingBottom: "2.5rem",
        borderBottom: `1px solid #E8D5C0`,
      }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#6B2D0E",
          marginBottom: "1.25rem",
          paddingBottom: "0.5rem",
          borderBottom: `2px solid #D4B896`,
          display: "inline-block",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "0.875rem" }}>
      <p
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#B08060",
          marginBottom: "0.2rem",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: "0.92rem", color: "#6B2D0E" }}>{value}</p>
    </div>
  );
}

