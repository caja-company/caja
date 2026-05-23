import { notFound } from "next/navigation";
import Link from "next/link";

// ─── Paleta ─────────────────────────────────────────────────────────────────

const C = {
  bg: "#FAF6EE",
  primary: "#6B2D0E",
  secondary: "#9B6B4A",
  border: "#D4B896",
  card: "#FDF9F2",
  badge: "#F0E0D0",
  muted: "#B08060",
};

// ─── Dados das cidades ───────────────────────────────────────────────────────

const cidades = {
  aracaju: {
    nome: "Aracaju",
    estado: "Sergipe",
    bio: "Capital de Sergipe e coração do forró nordestino. Fundada em 1855 às margens do Rio Sergipe, Aracaju é uma das primeiras cidades planejadas do Brasil. Conhecida pela qualidade de vida, praias urbanas e hospitalidade do seu povo, a cidade se transforma em junho no maior arraiá à beira-mar do Brasil — com o Forró Caju e o Arraiá do Povo reunindo milhares de pessoas na Orla da Atalaia. Terra de artistas, festivais e tradição junina, Aracaju é o epicentro cultural do forró sergipano.",
    fotoBg: "https://www.viajenaviagem.com/wp-content/uploads/2022/01/1-Largo-da-Gente-Sergipana-1920x1080-1.jpg.webp",
    mapUrl: "https://www.google.com/maps/search/Aracaju+Sergipe",
    pontos: [
      {
        nome: "Orla de Atalaia",
        bio: "Cartão-postal de Aracaju com 6 km de extensão à beira-mar. Reúne quiosques, feiras de artesanato, o Oceanário e os famosos Arcos iluminados — coração do Forró Caju e do Arraiá do Povo em junho.",
      },
      {
        nome: "Passarela do Caranguejo",
        bio: "Rua temática na Zona Sul com a icônica escultura do caranguejo gigante em fibra de vidro. Polo gastronômico com bares, restaurantes e música ao vivo todas as noites.",
      },
      {
        nome: "Museu da Gente Sergipana",
        bio: "Museu interativo e imersivo que conta a história e a cultura de Sergipe. Parada obrigatória para entender a alma do povo sergipano — da culinária ao forró.",
      },
    ],
  },
  estancia: {
    nome: "Estância",
    estado: "Sergipe",
    bio: "A Cidade Jardim do sul sergipano é terra do lendário Barco de Fogo, patrimônio imaterial de Sergipe criado por Chico Surdo no fim dos anos 1930. Com 30 dias de festa em junho, Estância é Capital Nacional do Barco de Fogo — o artefato pirotécnico que percorre fios de aço impulsionado por rojões, criando um espetáculo único no céu estanciano. Berço da imprensa sergipana, a cidade combina história, natureza e uma das festas juninas mais autênticas do Nordeste.",
    fotoBg: "https://www.gov.br/turismo/pt-br/assuntos/noticias/governo-federal-por-meio-do-mtur-viabiliza-construcao-de-praca-em-estancia-se/EstnciaSeturSergipe.png/@@images/5e3e1603-a3e6-4404-85b7-9198ec088fa7.png",
    mapUrl: "https://www.google.com/maps/search/Estância+Sergipe",
    pontos: [
      {
        nome: "Praia do Saco",
        bio: "Uma das praias mais belas do litoral Sul sergipano, com 5 km de areia branca, águas mornas e calmas, dunas e coqueiros. Paraíso natural a 70 km de Aracaju.",
      },
      {
        nome: "Memorial do Barco de Fogo",
        bio: "Complexo turístico Porto D'Areia com memorial a céu aberto contando a história do Barco de Fogo e do seu criador Chico Surdo — patrimônio imaterial de Sergipe.",
      },
      {
        nome: "Lagoa dos Tambaquis",
        bio: "Lagoa de águas cristalinas no litoral sul, ideal para banho e lazer em contato com a natureza. Um dos balneários mais charmosos e tranquilos do interior sergipano.",
      },
    ],
  },
  lagarto: {
    nome: "Lagarto",
    estado: "Sergipe",
    bio: "No centro-sul de Sergipe, Lagarto é a maior cidade do interior sergipano, com mais de 400 anos de história. Conhecida como Capital Nacional da Vaquejada, a cidade celebra junho com a tradicional Silibrina — guerra de buscapés e espadas de fogo — e o Festival da Mandioca, que abre os festejos ainda em maio. Entre natureza exuberante, patrimônio histórico e cultura viva, Lagarto é um destino que surpreende quem chega.",
    fotoBg: "https://www.skyscrapercity.com/attachments/1693760915507-png.5792704/",
    mapUrl: "https://www.google.com/maps/search/Lagarto+Sergipe",
    pontos: [
      {
        nome: "Cachoeira do Saboeiro",
        bio: "Trilha de 14 km entre mata nativa até uma exuberante queda d'água. Destino obrigatório para aventureiros e amantes do ecoturismo no centro-sul de Sergipe.",
      },
      {
        nome: "Barragem Dionísio de Araújo Machado",
        bio: "Construída nos anos 1980 para represar o Rio Piauí, tornou-se um dos principais balneários do interior sergipano — pesca, diversão aquática e bares à beira d'água.",
      },
      {
        nome: "Grupo Escolar Sílvio Romero",
        bio: "Patrimônio tombado pelo Estado, construído em 1923. Após restauração, funciona como centro cultural com salas de exposição, galeria de arte e café — símbolo da história lagartense.",
      },
    ],
  },
};

// ─── Página ──────────────────────────────────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

export default async function CidadePage({ params }: PageProps) {
  const { slug } = await params;
  const cidade = cidades[slug as keyof typeof cidades];

  if (!cidade) notFound();

  return (
    <>
      <style>{`
        .maps-btn:hover { background: ${C.primary} !important; color: #fff !important; }
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
          <div style={{ maxWidth: 900, margin: "0 auto", fontSize: "0.8rem", color: C.secondary }}>
            <Link href="/" style={{ color: C.secondary, textDecoration: "none" }}>
              Início
            </Link>
            <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>/</span>
            <span style={{ color: C.primary }}>{cidade.nome}</span>
          </div>
        </div>

        {/* Hero com foto */}
        <div
          style={{
            position: "relative",
            height: "420px",
            background: "#C4A882",
            backgroundImage: `url("${cidade.fotoBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          {/* Overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.50)" }} />

          {/* Texto do hero */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "0.75rem",
              }}
            >
              Acervo de Cidades • {cidade.estado}
            </p>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1,
                margin: 0,
              }}
            >
              {cidade.nome}
            </h1>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Bio */}
          <section style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: `1px solid ${C.border}` }}>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: C.primary,
                marginBottom: "1rem",
              }}
            >
              Sobre a cidade
            </h2>
            <p style={{ color: C.primary, lineHeight: 1.8, fontSize: "1rem" }}>
              {cidade.bio}
            </p>
          </section>

          {/* Pontos turísticos */}
          <section style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: `1px solid ${C.border}` }}>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: C.primary,
                marginBottom: "1.5rem",
              }}
            >
              Pontos turísticos
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {cidade.pontos.map((ponto) => (
                <article
                  key={ponto.nome}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    padding: "1.25rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: C.primary,
                      marginBottom: "0.5rem",
                      lineHeight: 1.25,
                    }}
                  >
                    {ponto.nome}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: C.secondary, lineHeight: 1.6, margin: 0 }}>
                    {ponto.bio}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Localização */}
          <section>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: C.primary,
                marginBottom: "1rem",
              }}
            >
              Localização
            </h2>
            <p style={{ color: C.secondary, fontSize: "0.95rem", marginBottom: "1rem" }}>
              {cidade.nome}, {cidade.estado}
            </p>
            <a
              href={cidade.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.4rem",
                border: `1.5px solid ${C.primary}`,
                borderRadius: "0.4rem",
                background: "transparent",
                color: C.primary,
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.18s, color 0.18s",
              }}
            >
              📍 Ver no Google Maps
            </a>
          </section>
        </div>

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
          Cajá • Acervo Digital do Forró
        </footer>
      </main>
    </>
  );
}
