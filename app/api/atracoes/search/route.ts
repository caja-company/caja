import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bandas, estiloMusicalEnum } from "@/db/schema";
import { ilike, eq, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const estilo = searchParams.get("estilo") ?? "";
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
    100
  );

  const validEstilo =
    estilo && (estiloMusicalEnum.enumValues as string[]).includes(estilo)
      ? (estilo as (typeof estiloMusicalEnum.enumValues)[number])
      : null;

  try {
    const results = await db
      .select({
        id: bandas.id,
        nome: bandas.nome,
        slug: bandas.slug,
        estilo: bandas.estilo,
        cidadeOrigem: bandas.cidadeOrigem,
        estadoOrigem: bandas.estadoOrigem,
        fotoUrl: bandas.fotoUrl,
        cacheFaixa: bandas.cacheFaixa,
      })
      .from(bandas)
      .where(
        and(
          q.trim()
            ? or(ilike(bandas.nome, `%${q}%`), ilike(bandas.cidadeOrigem, `%${q}%`), ilike(bandas.estadoOrigem, `%${q}%`))
            : undefined,
          validEstilo ? eq(bandas.estilo, validEstilo) : undefined
        )
      )
      .orderBy(bandas.nome)
      .limit(limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("[/api/atracoes/search]", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar atrações." },
      { status: 500 }
    );
  }
}
