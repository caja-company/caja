import { db } from "@/db";
import { festivais, contratacoes, bandas } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
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
  divider: "#E8D5C0",
};

// ─── Conteúdo estático por slug ──────────────────────────────────────────────

const FESTIVAL_BIO: Record<string, string> = {
  "forro-caju":
    "O Forró Caju nasceu em 1993 na Praça Fausto Cardoso por iniciativa da Prefeitura de Aracaju. Em mais de três décadas, tornou-se o maior festejo junino de Sergipe, reunindo de 60 a 80 mil pessoas por noite nos palcos da Praça Hilton Lopes. Com mais de 67% das atrações formadas por artistas sergipanos, o evento é símbolo da valorização da cultura local e referência nacional do forró nordestino.",
  "arraia-do-povo":
    "Promovido pelo Governo do Estado de Sergipe, o Arraiá do Povo acontece na Orla da Atalaia e integra o Ciclo Junino — considerado o maior arraiá à beira-mar do Brasil. Com mais de 300 atrações entre shows, concursos de quadrilha, gastronomia típica e artesanato, o evento se estende de junho a julho, celebrando a pluralidade da cultura junina sergipana.",
  "sao-joao-estancia":
    "O São João de Estância é marcado pelo lendário Barco de Fogo, criado no final dos anos 1930 pelo fogueteiro Chico Surdo. Patrimônio Cultural Imaterial de Sergipe desde 2003, o artefato pirotécnico percorre fios de aço impulsionado por rojões, criando um espetáculo único no céu estanciano. A festa dura 30 dias, abre com a Salva Junina em 31 de maio e reúne forró, quadrilhas e a corrida de Barco de Fogo no Forródromo Rogério Cardoso.",
  "sao-joao-lagarto":
    "Em Lagarto, o São João começa ainda em maio com o Festival da Mandioca e a retirada do mastro. A cidade é famosa pela Silibrina — a tradicional guerra de buscapés e espadas de fogo que anuncia a chegada de junho. Uma das manifestações juninas mais autênticas do interior sergipano, o São João de Lagarto preserva as raízes do forró pé de serra com shows regionais, quadrilhas e a energia única do centro-sul sergipano.",
  "sao-joao-nossa-senhora-gloria":
    "Nossa Senhora da Glória, a Capital do Sertão sergipano, celebra o São João com a alma mais raiz do estado. Forrós pé de serra, concursos de quadrilha, sanfoneiros e zabumbeiros animam a cidade por todo o mês de junho. Longe do litoral, mas perto da essência, o São João gloriense é a expressão mais genuína da tradição junina do sertão de Sergipe.",
};

const FESTIVAL_HISTORIA: Record<string, { desde: string; anos: string }> = {
  "forro-caju":                    { desde: "1993",               anos: "33 anos de história"     },
  "arraia-do-povo":                { desde: "2000",               anos: "+25 anos"                },
  "sao-joao-estancia":             { desde: "início séc. XX",     anos: "+80 anos de tradição"    },
  "sao-joao-lagarto":              { desde: "tradição centenária", anos: "+100 anos"              },
  "sao-joao-nossa-senhora-gloria": { desde: "tradição sertaneja", anos: "décadas de história"     },
};

const FESTIVAL_LOCAL: Record<string, string> = {
  "forro-caju":                    "Praça Hilton Lopes, Aracaju",
  "arraia-do-povo":                "Orla da Atalaia, Aracaju",
  "sao-joao-estancia":             "Praça Barão do Rio Branco, Estância",
  "sao-joao-lagarto":              "Centro de Lagarto",
  "sao-joao-nossa-senhora-gloria": "Centro de Nossa Senhora da Glória",
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

const ESTILO_LABELS: Record<string, string> = {
  pe_de_serra:       "Pé-de-Serra",
  xote:              "Xote",
  baiao:             "Baião",
  forro_eletronico:  "Forró Eletrônico",
  forro_universitario: "Forró Universitário",
  forro_estilizado:  "Forró Estilizado",
  arrasta_pe:        "Arrasta-pé",
  outro:             "Outro",
};

function formatPeriodoCompleto(inicio: Date, fim: Date): string {
  const mi = inicio.getUTCMonth();
  const mf = fim.getUTCMonth();
  const di = inicio.getUTCDate();
  const df = fim.getUTCDate();

  if (mi === mf) {
    return `${di} a ${df} de ${MESES_LONGOS[mi]}`;
  }
  return `${di} de ${MESES_LONGOS[mi]} a ${df} de ${MESES_LONGOS[mf]}`;
}

function getMesHero(inicio: Date): string {
  return MESES_CURTOS[inicio.getUTCMonth()].toUpperCase();
}

function getMapsUrl(nome: string, local: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${local}, Sergipe`)}`;
}

// ─── Página ─────────────────────────────────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

export default async function AcervoFestivalPage({ params }: PageProps) {
  const { slug } = await params;

  const festival = await db.query.festivais.findFirst({
    where: eq(festivais.slug, slug),
  });

  if (!festival) notFound();

  // Atrações confirmadas
  const atracoes = await db
    .select({
      nome: bandas.nome,
      slug: bandas.slug,
      fotoUrl: bandas.fotoUrl,
      estilo: bandas.estilo,
    })
    .from(contratacoes)
    .innerJoin(bandas, eq(contratacoes.bandaId, bandas.id))
    .where(
      and(
        eq(contratacoes.festivalId, festival.id),
        eq(contratacoes.status, "confirmado")
      )
    )
    .orderBy(bandas.nome);

  const bio = FESTIVAL_BIO[slug];
  const historia = FESTIVAL_HISTORIA[slug];
  const localDesc = FESTIVAL_LOCAL[slug] ?? `${festival.cidade}, ${festival.estado}`;
  const mesHero = getMesHero(festival.dataInicio);
  const periodoCompleto = formatPeriodoCompleto(festival.dataInicio, festival.dataFim);
  const mapsUrl = getMapsUrl(festival.nome, localDesc);

  return (
    <>
      <style>{`
        .maps-btn:hover {
          background: #6B2D0E !important;
          color: #FEF9F2 !important;
        }
        @media (max-width: 640px) {
          .hero-meta { flex-direction: column !important; gap: 0.5rem !important; }
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
          <div style={{ maxWidth: 860, margin: "0 auto", fontSize: "0.8rem", color: C.secondary }}>
            <Link href="/acervo/festivais" style={{ color: C.secondary, textDecoration: "none" }}>
              Festivais
            </Link>
            <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>/</span>
            <span style={{ color: C.primary }}>{festival.nome}</span>
          </div>
        </div>

        {/* Hero */}
        <header
          style={{
            background: "linear-gradient(160deg, #8B3A0C 0%, #4A1500 100%)",
            padding: "3.5rem 1.5rem 3rem",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {/* Mês em destaque */}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              {mesHero}
            </p>

            {/* Nome */}
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 6vw, 3.75rem)",
                color: "#FEF3E8",
                fontWeight: 600,
                lineHeight: 1.05,
                marginBottom: "1.25rem",
              }}
            >
              {festival.nome}
            </h1>

            {/* Meta chips */}
            <div
              className="hero-meta"
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Cidade/Estado */}
              <span
                style={{
                  background: "rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                📍 {festival.cidade}, {festival.estado}
              </span>

              {/* Histórico */}
              {historia && (
                <span
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.8rem",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Desde {historia.desde} • {historia.anos}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Sobre o Festival */}
          {bio && (
            <PublicSection title="Sobre o Festival">
              <p style={{ color: C.primary, lineHeight: 1.8, fontSize: "1rem" }}>
                {bio}
              </p>
            </PublicSection>
          )}

          {/* Quando Acontece */}
          <PublicSection title="Quando Acontece">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    background: C.badge,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  📅
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: C.primary, fontSize: "0.95rem", marginBottom: "0.1rem" }}>
                    {periodoCompleto}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: C.muted }}>
                    {festival.dataInicio.getUTCFullYear()}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    background: C.badge,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  📍
                </span>
                <p style={{ fontWeight: 600, color: C.primary, fontSize: "0.95rem" }}>
                  {festival.cidade}, {festival.estado}
                </p>
              </div>
            </div>
          </PublicSection>

          {/* Localização + Google Maps */}
          <PublicSection title="Localização">
            <p style={{ color: C.secondary, fontSize: "0.95rem", marginBottom: "1.25rem" }}>
              {localDesc}, Sergipe
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                border: `1.5px solid ${C.primary}`,
                borderRadius: "0.5rem",
                color: C.primary,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                background: "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <span>🗺️</span>
              Ver no Google Maps
            </a>
          </PublicSection>

          {/* Atrações Confirmadas */}
          <PublicSection title="Atrações Confirmadas">
            {atracoes.length === 0 ? (
              <p style={{ color: C.muted, fontSize: "0.9rem", fontStyle: "italic" }}>
                Programação a confirmar.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "1rem",
                }}
              >
                {atracoes.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/artista/${a.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: "0.625rem",
                        overflow: "hidden",
                      }}
                    >
                      {/* Foto miniatura */}
                      <div
                        style={{
                          aspectRatio: "1/1",
                          background: "linear-gradient(135deg, #E8D5C0, #D4B896)",
                          overflow: "hidden",
                        }}
                      >
                        {a.fotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={a.fotoUrl}
                            alt={a.nome}
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
                              fontSize: "2rem",
                              color: C.primary,
                              opacity: 0.6,
                            }}
                          >
                            {a.nome.charAt(0)}
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ padding: "0.6rem 0.75rem" }}>
                        <p
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: C.primary,
                            margin: "0 0 0.15rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {a.nome}
                        </p>
                        <p style={{ fontSize: "0.7rem", color: C.muted, margin: 0 }}>
                          {ESTILO_LABELS[a.estilo] ?? a.estilo}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </PublicSection>

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

// ─── Sub-componente ──────────────────────────────────────────────────────────

function PublicSection({ title, children }: { title: string; children: React.ReactNode }) {
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
          fontSize: "1.2rem",
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
