import { db } from "@/db";
import { bandas, contratacoes, festivais } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";

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

const CACHE_LABELS: Record<string, string> = {
  ate_5k: "Até R$ 5 mil",
  "5k_15k": "R$ 5–15 mil",
  "15k_50k": "R$ 15–50 mil",
  "50k_150k": "R$ 50–150 mil",
  acima_150k: "Acima de R$ 150 mil",
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

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function ArtistaPublicoPage({ params }: PageProps) {
  const { slug } = await params;

  const banda = await db.query.bandas.findFirst({
    where: eq(bandas.slug, slug),
  });

  if (!banda) notFound();

  // Apenas festivais não cancelados para o portal público
  const historico = await db
    .select({
      festivalNome: festivais.nome,
      festivalCidade: festivais.cidade,
      festivalEstado: festivais.estado,
      festivalDataInicio: festivais.dataInicio,
      status: contratacoes.status,
    })
    .from(contratacoes)
    .innerJoin(festivais, eq(contratacoes.festivalId, festivais.id))
    .where(
      and(
        eq(contratacoes.bandaId, banda.id),
        ne(contratacoes.status, "cancelado")
      )
    )
    .orderBy(festivais.dataInicio);

  const videoId = banda.videoYoutubeUrl
    ? extractYouTubeId(banda.videoYoutubeUrl)
    : null;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .artista-hero-grid { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
          .artista-hero-foto { width: 180px !important; margin: 0 auto; }
        }
      `}</style>

      <main
        style={{ background: C.bg, minHeight: "100vh", paddingBottom: "4rem" }}
      >
        {/* Hero com foto grande */}
        <header
          style={{
            borderBottom: `1px solid ${C.border}`,
            background: C.card,
            padding: "3rem 1.5rem",
          }}
        >
          <div
            className="artista-hero-grid"
            style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            {/* Foto */}
            <div
              className="artista-hero-foto"
              style={{
                aspectRatio: "1/1",
                borderRadius: "50%",
                overflow: "hidden",
                background: `linear-gradient(135deg, #E8D5C0, #D4B896)`,
                border: `3px solid ${C.border}`,
                boxShadow: "0 4px 24px rgba(107,45,14,0.12)",
              }}
            >
              {banda.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={banda.fotoUrl}
                  alt={banda.nome}
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
                    fontSize: "5rem",
                    color: C.primary,
                    opacity: 0.6,
                  }}
                >
                  {banda.nome.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: C.badge,
                  color: C.primary,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "0.22rem 0.7rem",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.75rem",
                }}
              >
                {ESTILO_LABELS[banda.estilo] ?? banda.estilo}
              </span>

              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: C.primary,
                  fontWeight: 600,
                  lineHeight: 1.05,
                  marginBottom: "0.5rem",
                }}
              >
                {banda.nome}
              </h1>

              {(banda.cidadeOrigem || banda.estadoOrigem) && (
                <p
                  style={{
                    color: C.secondary,
                    fontSize: "1rem",
                    marginBottom: banda.regiaoCultural ? "0.25rem" : "1.5rem",
                  }}
                >
                  {[banda.cidadeOrigem, banda.estadoOrigem]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {banda.regiaoCultural && (
                <p
                  style={{
                    color: C.muted,
                    fontSize: "0.88rem",
                    fontStyle: "italic",
                    marginBottom: "1.5rem",
                  }}
                >
                  {banda.regiaoCultural}
                </p>
              )}

              {/* Links sociais */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {banda.spotifyUrl && (
                  <a
                    href={banda.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 1.1rem",
                      background: "#1DB954",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    ♫ Ouça no Spotify
                  </a>
                )}
                {banda.instagramHandle && (
                  <a
                    href={`https://instagram.com/${banda.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 1.1rem",
                      border: `1.5px solid ${C.border}`,
                      background: C.bg,
                      color: C.secondary,
                      textDecoration: "none",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    @{banda.instagramHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}
        >
          {/* Bio */}
          {banda.bio && (
            <PublicSection title="Sobre o Artista">
              <p
                style={{
                  color: C.primary,
                  lineHeight: 1.8,
                  fontSize: "1rem",
                }}
              >
                {banda.bio}
              </p>
            </PublicSection>
          )}

          {/* Dados Culturais */}
          {(banda.tradicaoMusical ||
            banda.influenciasMestres?.length ||
            banda.repertorioBase?.length) && (
            <PublicSection title="Raízes Culturais">
              {banda.tradicaoMusical && (
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: C.muted,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Tradição Musical
                  </p>
                  <p style={{ fontSize: "0.95rem", color: C.primary }}>
                    {banda.tradicaoMusical}
                  </p>
                </div>
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
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {banda.influenciasMestres.map((m) => (
                      <span
                        key={m}
                        style={{
                          background: C.badge,
                          color: C.primary,
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.85rem",
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
                  <div
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                    }}
                  >
                    {banda.repertorioBase.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0.6rem 1rem",
                          borderTop:
                            i === 0 ? "none" : `1px solid ${C.divider}`,
                          background: i % 2 === 0 ? C.card : C.bg,
                          fontSize: "0.88rem",
                        }}
                      >
                        <span style={{ color: C.primary }}>{r.titulo}</span>
                        <span style={{ color: C.muted }}>{r.autor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PublicSection>
          )}

          {/* Histórico de Festivais */}
          {historico.length > 0 && (
            <PublicSection title="Histórico de Festivais">
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
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          color: C.primary,
                          fontSize: "0.92rem",
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
                    {h.status === "confirmado" && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          background: "#DCFCE7",
                          color: "#14532D",
                        }}
                      >
                        Confirmado
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </PublicSection>
          )}

          {/* Vídeo YouTube */}
          {videoId && (
            <PublicSection title="Assista">
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
            </PublicSection>
          )}
        </div>

        <footer
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "2rem 1.5rem",
            textAlign: "center",
            color: C.muted,
            fontSize: "0.8rem",
          }}
        >
          CAJA • Acervo Digital do Forró
        </footer>
      </main>
    </>
  );
}

function PublicSection({
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
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#6B2D0E",
          marginBottom: "1.25rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function PublicInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#FDF9F2",
        border: `1px solid #D4B896`,
        borderRadius: "0.5rem",
        padding: "0.875rem 1rem",
      }}
    >
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#B08060",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "#6B2D0E" }}>
        {value}
      </p>
    </div>
  );
}
