// db/schema.ts
// Schema completo para o SaaS de gestão de festivais
// Usa Drizzle ORM + Postgres (Supabase)

import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
    numeric,
    jsonb,
    pgEnum,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const estiloMusicalEnum = pgEnum("estilo_musical", [
    "pe_de_serra",
    "xote",
    "baiao",
    "forro_eletronico",
    "forro_universitario",
    "forro_estilizado",
    "arrasta_pe",
    "outro",
]);

export const faixaCacheEnum = pgEnum("faixa_cache", [
    "ate_5k",
    "5k_15k",
    "15k_50k",
    "50k_150k",
    "acima_150k",
]);

export const statusContratacaoEnum = pgEnum("status_contratacao", [
    "prospeccao",
    "negociacao",
    "contratado",
    "rider_pendente",
    "confirmado",
    "cancelado",
]);

export const statusFestivalEnum = pgEnum("status_festival", [
    "planejamento",
    "contratacao",
    "programacao",
    "execucao",
    "encerrado",
]);

// ============================================================
// BANDAS / ARTISTAS
// ============================================================

export const bandas = pgTable(
    "bandas",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        nome: text("nome").notNull(),
        slug: text("slug").notNull().unique(),
        bio: text("bio"),
        estilo: estiloMusicalEnum("estilo").notNull(),
        cidadeOrigem: text("cidade_origem"),
        estadoOrigem: text("estado_origem"),
        fotoUrl: text("foto_url"),
        videoYoutubeUrl: text("video_youtube_url"),
        spotifyUrl: text("spotify_url"),
        instagramHandle: text("instagram_handle"),
        cacheFaixa: faixaCacheEnum("cache_faixa"),
        cacheEstimado: numeric("cache_estimado", { precision: 12, scale: 2 }),
        rider: jsonb("rider").$type<{
            microfones: number;
            monitores: number;
            mesa: string;
            backline: string[];
            observacoes?: string;
        }>(),
        contatoEmpresarioNome: text("contato_empresario_nome"),
        contatoEmpresarioTelefone: text("contato_empresario_telefone"),
        contatoEmpresarioEmail: text("contato_empresario_email"),
        duracaoShowMinutos: integer("duracao_show_minutos").default(60),
        requerBacklineCompartilhado: text("requer_backline_compartilhado"),
        notasInternas: text("notas_internas"),
        criadoEm: timestamp("criado_em").defaultNow().notNull(),
        atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
    },
    (table) => ({
        estiloIdx: index("bandas_estilo_idx").on(table.estilo),
        estadoIdx: index("bandas_estado_idx").on(table.estadoOrigem),
    })
);

// ============================================================
// FESTIVAIS
// ============================================================

export const festivais = pgTable("festivais", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: text("nome").notNull(),
    slug: text("slug").notNull().unique(),
    cidade: text("cidade").notNull(),
    estado: text("estado").notNull(),
    dataInicio: timestamp("data_inicio").notNull(),
    dataFim: timestamp("data_fim").notNull(),
    orcamentoTotal: numeric("orcamento_total", { precision: 14, scale: 2 }),
    numAtracoesEstimadas: integer("num_atracoes_estimadas"),
    status: statusFestivalEnum("status").default("planejamento").notNull(),
    descricao: text("descricao"),
    organizador: text("organizador"),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// ============================================================
// PALCOS (de cada festival)
// ============================================================

export const palcos = pgTable(
    "palcos",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        festivalId: uuid("festival_id")
            .notNull()
            .references(() => festivais.id, { onDelete: "cascade" }),
        nome: text("nome").notNull(),
        capacidade: integer("capacidade"),
        ordem: integer("ordem").default(0),
        horarioInicio: text("horario_inicio").default("19:00"),
        horarioFim: text("horario_fim").default("03:00"),
        criadoEm: timestamp("criado_em").defaultNow().notNull(),
    },
    (table) => ({
        festivalIdx: index("palcos_festival_idx").on(table.festivalId),
    })
);

// ============================================================
// CONTRATAÇÕES (relação festival <-> banda)
// ============================================================

export const contratacoes = pgTable(
    "contratacoes",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        festivalId: uuid("festival_id")
            .notNull()
            .references(() => festivais.id, { onDelete: "cascade" }),
        bandaId: uuid("banda_id")
            .notNull()
            .references(() => bandas.id),
        valorContrato: numeric("valor_contrato", { precision: 12, scale: 2 }),
        status: statusContratacaoEnum("status").default("prospeccao").notNull(),
        contratoTexto: text("contrato_texto"),
        observacoes: text("observacoes"),
        criadoEm: timestamp("criado_em").defaultNow().notNull(),
        atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
    },
    (table) => ({
        festivalIdx: index("contratacoes_festival_idx").on(table.festivalId),
        bandaIdx: index("contratacoes_banda_idx").on(table.bandaId),
    })
);

// ============================================================
// SLOTS DE PROGRAMAÇÃO (a grade do festival)
// ============================================================

export const slots = pgTable(
    "slots",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        festivalId: uuid("festival_id")
            .notNull()
            .references(() => festivais.id, { onDelete: "cascade" }),
        palcoId: uuid("palco_id")
            .notNull()
            .references(() => palcos.id, { onDelete: "cascade" }),
        contratacaoId: uuid("contratacao_id").references(() => contratacoes.id, {
            onDelete: "set null",
        }),
        diaShow: timestamp("dia_show").notNull(),
        horarioInicio: text("horario_inicio").notNull(),
        horarioFim: text("horario_fim").notNull(),
        geradoPorIa: text("gerado_por_ia"),
        justificativaIa: text("justificativa_ia"),
        criadoEm: timestamp("criado_em").defaultNow().notNull(),
    },
    (table) => ({
        festivalIdx: index("slots_festival_idx").on(table.festivalId),
        palcoIdx: index("slots_palco_idx").on(table.palcoId),
    })
);

// ============================================================
// GERAÇÕES DE IA (log pra auditoria e pra mostrar no pitch)
// ============================================================

export const geracoesIa = pgTable("geracoes_ia", {
    id: uuid("id").primaryKey().defaultRandom(),
    festivalId: uuid("festival_id").references(() => festivais.id, {
        onDelete: "cascade",
    }),
    tipo: text("tipo").notNull(),
    promptUsado: text("prompt_usado"),
    respostaJson: jsonb("resposta_json"),
    justificativaGeral: text("justificativa_geral"),
    duracaoMs: integer("duracao_ms"),
    modelo: text("modelo"),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const bandasRelations = relations(bandas, ({ many }) => ({
    contratacoes: many(contratacoes),
}));

export const festivaisRelations = relations(festivais, ({ many }) => ({
    palcos: many(palcos),
    contratacoes: many(contratacoes),
    slots: many(slots),
}));

export const palcosRelations = relations(palcos, ({ one, many }) => ({
    festival: one(festivais, {
        fields: [palcos.festivalId],
        references: [festivais.id],
    }),
    slots: many(slots),
}));

export const contratacoesRelations = relations(contratacoes, ({ one, many }) => ({
    festival: one(festivais, {
        fields: [contratacoes.festivalId],
        references: [festivais.id],
    }),
    banda: one(bandas, {
        fields: [contratacoes.bandaId],
        references: [bandas.id],
    }),
    slots: many(slots),
}));

export const slotsRelations = relations(slots, ({ one }) => ({
    festival: one(festivais, {
        fields: [slots.festivalId],
        references: [festivais.id],
    }),
    palco: one(palcos, {
        fields: [slots.palcoId],
        references: [palcos.id],
    }),
    contratacao: one(contratacoes, {
        fields: [slots.contratacaoId],
        references: [contratacoes.id],
    }),
}));