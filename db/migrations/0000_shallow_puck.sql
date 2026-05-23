CREATE TYPE "public"."estilo_musical" AS ENUM('pe_de_serra', 'xote', 'baiao', 'forro_eletronico', 'forro_universitario', 'forro_estilizado', 'arrasta_pe', 'outro');--> statement-breakpoint
CREATE TYPE "public"."faixa_cache" AS ENUM('ate_5k', '5k_15k', '15k_50k', '50k_150k', 'acima_150k');--> statement-breakpoint
CREATE TYPE "public"."status_contratacao" AS ENUM('prospeccao', 'negociacao', 'contratado', 'rider_pendente', 'confirmado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."status_festival" AS ENUM('planejamento', 'contratacao', 'programacao', 'execucao', 'encerrado');--> statement-breakpoint
CREATE TABLE "bandas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"estilo" "estilo_musical" NOT NULL,
	"cidade_origem" text,
	"estado_origem" text,
	"foto_url" text,
	"video_youtube_url" text,
	"spotify_url" text,
	"instagram_handle" text,
	"cache_faixa" "faixa_cache",
	"cache_estimado" numeric(12, 2),
	"rider" jsonb,
	"contato_empresario_nome" text,
	"contato_empresario_telefone" text,
	"contato_empresario_email" text,
	"duracao_show_minutos" integer DEFAULT 60,
	"requer_backline_compartilhado" text,
	"notas_internas" text,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bandas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contratacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"festival_id" uuid NOT NULL,
	"banda_id" uuid NOT NULL,
	"valor_contrato" numeric(12, 2),
	"status" "status_contratacao" DEFAULT 'prospeccao' NOT NULL,
	"contrato_texto" text,
	"observacoes" text,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "festivais" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"cidade" text NOT NULL,
	"estado" text NOT NULL,
	"data_inicio" timestamp NOT NULL,
	"data_fim" timestamp NOT NULL,
	"orcamento_total" numeric(14, 2),
	"num_atracoes_estimadas" integer,
	"status" "status_festival" DEFAULT 'planejamento' NOT NULL,
	"descricao" text,
	"organizador" text,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "festivais_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "geracoes_ia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"festival_id" uuid,
	"tipo" text NOT NULL,
	"prompt_usado" text,
	"resposta_json" jsonb,
	"justificativa_geral" text,
	"duracao_ms" integer,
	"modelo" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "palcos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"festival_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"capacidade" integer,
	"ordem" integer DEFAULT 0,
	"horario_inicio" text DEFAULT '19:00',
	"horario_fim" text DEFAULT '03:00',
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"festival_id" uuid NOT NULL,
	"palco_id" uuid NOT NULL,
	"contratacao_id" uuid,
	"dia_show" timestamp NOT NULL,
	"horario_inicio" text NOT NULL,
	"horario_fim" text NOT NULL,
	"gerado_por_ia" text,
	"justificativa_ia" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contratacoes" ADD CONSTRAINT "contratacoes_festival_id_festivais_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festivais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contratacoes" ADD CONSTRAINT "contratacoes_banda_id_bandas_id_fk" FOREIGN KEY ("banda_id") REFERENCES "public"."bandas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "geracoes_ia" ADD CONSTRAINT "geracoes_ia_festival_id_festivais_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festivais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "palcos" ADD CONSTRAINT "palcos_festival_id_festivais_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festivais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slots" ADD CONSTRAINT "slots_festival_id_festivais_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festivais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slots" ADD CONSTRAINT "slots_palco_id_palcos_id_fk" FOREIGN KEY ("palco_id") REFERENCES "public"."palcos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slots" ADD CONSTRAINT "slots_contratacao_id_contratacoes_id_fk" FOREIGN KEY ("contratacao_id") REFERENCES "public"."contratacoes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bandas_estilo_idx" ON "bandas" USING btree ("estilo");--> statement-breakpoint
CREATE INDEX "bandas_estado_idx" ON "bandas" USING btree ("estado_origem");--> statement-breakpoint
CREATE INDEX "contratacoes_festival_idx" ON "contratacoes" USING btree ("festival_id");--> statement-breakpoint
CREATE INDEX "contratacoes_banda_idx" ON "contratacoes" USING btree ("banda_id");--> statement-breakpoint
CREATE INDEX "palcos_festival_idx" ON "palcos" USING btree ("festival_id");--> statement-breakpoint
CREATE INDEX "slots_festival_idx" ON "slots" USING btree ("festival_id");--> statement-breakpoint
CREATE INDEX "slots_palco_idx" ON "slots" USING btree ("palco_id");