import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { loadEnvConfig } from "@next/env"
import * as schema from "./schema"

loadEnvConfig(process.cwd())

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

async function main() {
    console.log("🌱 Iniciando seed...")

    // ============================================================
    // BANDAS
    // ============================================================
    console.log("🎸 Inserindo bandas...")

    const bandasData = await db
        .insert(schema.bandas)
        .values([
            {
                nome: "Alcymar Monteiro",
                slug: "alcymar-monteiro",
                bio: "Cantor e compositor sergipano, um dos maiores nomes do forró pé de serra.",
                estilo: "pe_de_serra",
                cidadeOrigem: "Aracaju",
                estadoOrigem: "SE",
                cacheFaixa: "15k_50k",
                cacheEstimado: "30000",
                duracaoShowMinutos: 75,
                instagramHandle: "alcymarmonteiro",
                contatoEmpresarioNome: "Roberto Silva",
                contatoEmpresarioTelefone: "(79) 99999-1001",
                contatoEmpresarioEmail: "roberto@alcymarmonteiro.com.br",
                rider: {
                    microfones: 8,
                    monitores: 4,
                    mesa: "32 canais",
                    backline: ["bateria completa", "baixo 4x10", "guitarra 4x12", "sanfona no retorno"],
                    observacoes: "Exige retorno dedicado para sanfona",
                },
            },
            {
                nome: "Flávio José",
                slug: "flavio-jose",
                bio: "O Rouxinol do Forró, cantor pernambucano dono de clássicos inesquecíveis.",
                estilo: "xote",
                cidadeOrigem: "Recife",
                estadoOrigem: "PE",
                cacheFaixa: "15k_50k",
                cacheEstimado: "40000",
                duracaoShowMinutos: 80,
                instagramHandle: "flaviojoseoficial",
                contatoEmpresarioNome: "Carlos Mendes",
                contatoEmpresarioTelefone: "(81) 99999-2002",
                contatoEmpresarioEmail: "carlos@flaviojose.com.br",
                rider: {
                    microfones: 10,
                    monitores: 5,
                    mesa: "48 canais",
                    backline: ["bateria completa", "baixo 4x10", "guitarra 4x12", "teclado 88 teclas"],
                },
            },
            {
                nome: "Mestrinho",
                slug: "mestrinho",
                bio: "Virtuoso da sanfona, referência mundial no forró pé de serra e baião.",
                estilo: "baiao",
                cidadeOrigem: "Fortaleza",
                estadoOrigem: "CE",
                cacheFaixa: "15k_50k",
                cacheEstimado: "25000",
                duracaoShowMinutos: 70,
                instagramHandle: "mestrinhooficial",
                contatoEmpresarioNome: "Ana Lima",
                contatoEmpresarioTelefone: "(85) 99999-3003",
                contatoEmpresarioEmail: "ana@mestrinho.com.br",
                rider: {
                    microfones: 6,
                    monitores: 3,
                    mesa: "24 canais",
                    backline: ["zabumba", "triângulo", "sanfona no retorno"],
                    observacoes: "Trio pé de serra — setup minimalista",
                },
            },
            {
                nome: "Wesley Safadão",
                slug: "wesley-safadao",
                bio: "Fenômeno do forró eletrônico, um dos artistas mais populares do Brasil.",
                estilo: "forro_eletronico",
                cidadeOrigem: "Fortaleza",
                estadoOrigem: "CE",
                cacheFaixa: "acima_150k",
                cacheEstimado: "500000",
                duracaoShowMinutos: 90,
                instagramHandle: "wesleysafadao",
                contatoEmpresarioNome: "Grupo WS",
                contatoEmpresarioTelefone: "(85) 99999-4004",
                contatoEmpresarioEmail: "booking@wesleysafadao.com.br",
                rider: {
                    microfones: 24,
                    monitores: 12,
                    mesa: "96 canais digital",
                    backline: ["bateria eletrônica", "baixo 8x10", "guitarra 4x12", "teclado 88 teclas", "percussão completa"],
                    observacoes: "Exige gerador próprio 200KVA. Estrutura de palco mínima 20x15m",
                },
            },
            {
                nome: "Solange Almeida",
                slug: "solange-almeida",
                bio: "A Rainha do Forró, ex-vocalista do Aviões, hoje carreira solo de sucesso.",
                estilo: "forro_eletronico",
                cidadeOrigem: "Fortaleza",
                estadoOrigem: "CE",
                cacheFaixa: "50k_150k",
                cacheEstimado: "120000",
                duracaoShowMinutos: 90,
                instagramHandle: "solangealmeidaoficial",
                contatoEmpresarioNome: "Márcio Costa",
                contatoEmpresarioTelefone: "(85) 99999-5005",
                contatoEmpresarioEmail: "marcio@solangealmeida.com.br",
                rider: {
                    microfones: 20,
                    monitores: 10,
                    mesa: "64 canais digital",
                    backline: ["bateria completa", "baixo 6x10", "guitarra 4x12", "teclado 88 teclas"],
                    observacoes: "Necessita camarim climatizado para 15 pessoas",
                },
            },
            {
                nome: "Mastruz com Leite",
                slug: "mastruz-com-leite",
                bio: "Uma das bandas mais importantes do forró eletrônico, surgida em Fortaleza nos anos 90.",
                estilo: "forro_eletronico",
                cidadeOrigem: "Fortaleza",
                estadoOrigem: "CE",
                cacheFaixa: "15k_50k",
                cacheEstimado: "45000",
                duracaoShowMinutos: 80,
                instagramHandle: "mastruzcomleiteoficial",
                contatoEmpresarioNome: "Edilson Nunes",
                contatoEmpresarioTelefone: "(85) 99999-6006",
                contatoEmpresarioEmail: "edilson@mastruzcomleite.com.br",
                rider: {
                    microfones: 16,
                    monitores: 8,
                    mesa: "48 canais",
                    backline: ["bateria completa", "baixo 4x10", "guitarra 4x12", "teclado"],
                },
            },
            {
                nome: "Calcinha Preta",
                slug: "calcinha-preta",
                bio: "Banda sergipana que revolucionou o forró eletrônico no Nordeste.",
                estilo: "forro_eletronico",
                cidadeOrigem: "Aracaju",
                estadoOrigem: "SE",
                cacheFaixa: "15k_50k",
                cacheEstimado: "50000",
                duracaoShowMinutos: 90,
                instagramHandle: "calcinhapretaoficial",
                contatoEmpresarioNome: "Duda Mendonça",
                contatoEmpresarioTelefone: "(79) 99999-7007",
                contatoEmpresarioEmail: "duda@calcinhapreta.com.br",
                rider: {
                    microfones: 18,
                    monitores: 9,
                    mesa: "64 canais digital",
                    backline: ["bateria completa", "baixo 6x10", "guitarra 4x12", "teclado 88 teclas"],
                    observacoes: "Banda de Aracaju — preferência por shows em SE",
                },
            },
            {
                nome: "Aviões do Forró",
                slug: "avioes-do-forro",
                bio: "Gigante do forró universitário, com hits que dominaram o Nordeste nos anos 2000.",
                estilo: "forro_universitario",
                cidadeOrigem: "Fortaleza",
                estadoOrigem: "CE",
                cacheFaixa: "50k_150k",
                cacheEstimado: "100000",
                duracaoShowMinutos: 90,
                instagramHandle: "avioesdoforro",
                contatoEmpresarioNome: "Grupo Aviões",
                contatoEmpresarioTelefone: "(85) 99999-8008",
                contatoEmpresarioEmail: "booking@avioesdoforro.com.br",
                rider: {
                    microfones: 22,
                    monitores: 11,
                    mesa: "96 canais digital",
                    backline: ["bateria completa", "baixo 8x10", "guitarra 4x12", "teclado 88 teclas", "percussão"],
                    observacoes: "Exige palco mínimo 16x12m",
                },
            },
            {
                nome: "Cavaleiros do Forró",
                slug: "cavaleiros-do-forro",
                bio: "Banda sergipana de forró estilizado com grande apelo popular no Nordeste.",
                estilo: "forro_estilizado",
                cidadeOrigem: "Aracaju",
                estadoOrigem: "SE",
                cacheFaixa: "5k_15k",
                cacheEstimado: "12000",
                duracaoShowMinutos: 75,
                instagramHandle: "cavaleiresdoforro",
                contatoEmpresarioNome: "Fábio Santos",
                contatoEmpresarioTelefone: "(79) 99999-9009",
                contatoEmpresarioEmail: "fabio@cavaleiresdoforro.com.br",
                rider: {
                    microfones: 12,
                    monitores: 6,
                    mesa: "32 canais",
                    backline: ["bateria completa", "baixo 4x10", "guitarra 4x12"],
                },
            },
            {
                nome: "Mestre Anízio",
                slug: "mestre-anizio",
                bio: "Mestre do forró pé de serra e da zabumba, guardião da tradição nordestina.",
                estilo: "arrasta_pe",
                cidadeOrigem: "Campina Grande",
                estadoOrigem: "PB",
                cacheFaixa: "5k_15k",
                cacheEstimado: "8000",
                duracaoShowMinutos: 60,
                instagramHandle: "mestreanizio",
                contatoEmpresarioNome: "José Anízio Jr.",
                contatoEmpresarioTelefone: "(83) 99999-0010",
                contatoEmpresarioEmail: "jose@mestreanizio.com.br",
                rider: {
                    microfones: 4,
                    monitores: 2,
                    mesa: "16 canais",
                    backline: ["zabumba", "triângulo"],
                    observacoes: "Trio tradicional — setup simplificado",
                },
            },
        ])
        .returning()

    console.log(`✅ ${bandasData.length} bandas inseridas`)

    // ============================================================
    // FESTIVAIS
    // ============================================================
    console.log("🎪 Inserindo festivais...")

    const festivaisData = await db
        .insert(schema.festivais)
        .values([
            {
                nome: "Forró Caju 2026",
                slug: "forro-caju-2026",
                cidade: "Aracaju",
                estado: "SE",
                dataInicio: new Date("2026-06-20"),
                dataFim: new Date("2026-06-25"),
                orcamentoTotal: "800000",
                numAtracoesEstimadas: 20,
                status: "planejamento",
                descricao: "O maior festival de forró de Sergipe, celebrando o São João na capital.",
                organizador: "Prefeitura de Aracaju",
            },
            {
                nome: "São João de Campina Grande 2026",
                slug: "sao-joao-campina-grande-2026",
                cidade: "Campina Grande",
                estado: "PB",
                dataInicio: new Date("2026-06-01"),
                dataFim: new Date("2026-06-30"),
                orcamentoTotal: "5000000",
                numAtracoesEstimadas: 120,
                status: "planejamento",
                descricao: "O Maior São João do Mundo, 30 dias de festa na Rainha da Borborema.",
                organizador: "Prefeitura de Campina Grande",
            },
            {
                nome: "Mossoró Cidade Junina 2026",
                slug: "mossoro-cidade-junina-2026",
                cidade: "Mossoró",
                estado: "RN",
                dataInicio: new Date("2026-06-13"),
                dataFim: new Date("2026-06-23"),
                orcamentoTotal: "1200000",
                numAtracoesEstimadas: 40,
                status: "planejamento",
                descricao: "Festival junino da terra da liberdade, com 10 dias de forró e cultura nordestina.",
                organizador: "Prefeitura de Mossoró",
            },
            {
                nome: "Bonfim Folia 2026",
                slug: "bonfim-folia-2026",
                cidade: "Estância",
                estado: "SE",
                dataInicio: new Date("2026-01-08"),
                dataFim: new Date("2026-01-12"),
                orcamentoTotal: "300000",
                numAtracoesEstimadas: 15,
                status: "encerrado",
                descricao: "Festival de verão em Estância, celebrando o Senhor do Bonfim com muito forró.",
                organizador: "Prefeitura de Estância",
            },
            {
                nome: "Festival de Inverno de Garanhuns 2026",
                slug: "festival-inverno-garanhuns-2026",
                cidade: "Garanhuns",
                estado: "PE",
                dataInicio: new Date("2026-07-17"),
                dataFim: new Date("2026-07-27"),
                orcamentoTotal: "2000000",
                numAtracoesEstimadas: 50,
                status: "planejamento",
                descricao: "O maior festival de inverno do Nordeste, em uma das cidades mais frias da região.",
                organizador: "Prefeitura de Garanhuns",
            },
        ])
        .returning()

    console.log(`✅ ${festivaisData.length} festivais inseridos`)

    // ============================================================
    // PALCOS
    // ============================================================
    console.log("🎤 Inserindo palcos...")

    const [forroCaju, saaoJoao, mossoro, bonfim, garanhuns] = festivaisData

    const palcosData = await db
        .insert(schema.palcos)
        .values([
            // Forró Caju
            { festivalId: forroCaju.id, nome: "Palco Principal", capacidade: 30000, ordem: 1, horarioInicio: "18:00", horarioFim: "04:00" },
            { festivalId: forroCaju.id, nome: "Palco Asa Branca", capacidade: 10000, ordem: 2, horarioInicio: "19:00", horarioFim: "02:00" },
            { festivalId: forroCaju.id, nome: "Palco Sanfona de Ouro", capacidade: 3000, ordem: 3, horarioInicio: "20:00", horarioFim: "01:00" },

            // São João de Campina Grande
            { festivalId: saaoJoao.id, nome: "Palco Principal Luiz Gonzaga", capacidade: 80000, ordem: 1, horarioInicio: "17:00", horarioFim: "05:00" },
            { festivalId: saaoJoao.id, nome: "Palco Dominguinhos", capacidade: 20000, ordem: 2, horarioInicio: "18:00", horarioFim: "03:00" },
            { festivalId: saaoJoao.id, nome: "Palco Nordestino", capacidade: 8000, ordem: 3, horarioInicio: "19:00", horarioFim: "02:00" },
            { festivalId: saaoJoao.id, nome: "Palco Forró Raiz", capacidade: 2000, ordem: 4, horarioInicio: "16:00", horarioFim: "23:00" },

            // Mossoró
            { festivalId: mossoro.id, nome: "Palco Chuva de Prata", capacidade: 25000, ordem: 1, horarioInicio: "18:00", horarioFim: "04:00" },
            { festivalId: mossoro.id, nome: "Palco Mossoró", capacidade: 8000, ordem: 2, horarioInicio: "19:00", horarioFim: "02:00" },

            // Bonfim Folia
            { festivalId: bonfim.id, nome: "Palco Bonfim", capacidade: 8000, ordem: 1, horarioInicio: "19:00", horarioFim: "03:00" },
            { festivalId: bonfim.id, nome: "Palco Estância", capacidade: 2000, ordem: 2, horarioInicio: "20:00", horarioFim: "01:00" },

            // Garanhuns
            { festivalId: garanhuns.id, nome: "Palco Principal Caruaru", capacidade: 40000, ordem: 1, horarioInicio: "16:00", horarioFim: "04:00" },
            { festivalId: garanhuns.id, nome: "Palco Luiz Gonzaga", capacidade: 15000, ordem: 2, horarioInicio: "17:00", horarioFim: "02:00" },
            { festivalId: garanhuns.id, nome: "Palco Cultura", capacidade: 5000, ordem: 3, horarioInicio: "14:00", horarioFim: "22:00" },
        ])
        .returning()

    console.log(`✅ ${palcosData.length} palcos inseridos`)

    console.log("\n🎉 Seed concluído com sucesso!")
    console.log(`   Bandas:   ${bandasData.length}`)
    console.log(`   Festivais: ${festivaisData.length}`)
    console.log(`   Palcos:   ${palcosData.length}`)

    await client.end()
}

main().catch((err) => {
    console.error("❌ Erro no seed:", err)
    process.exit(1)
})