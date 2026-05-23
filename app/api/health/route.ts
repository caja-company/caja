import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { GoogleGenAI } from "@google/genai"
import { db } from "@/db"

// CLAUDE.md §3 + §15: modelo padrão para todas as chamadas
const MODEL = "gemini-2.5-flash"

// CLAUDE.md §15: route handlers de IA têm timeout generoso
export const maxDuration = 60
export const dynamic = "force-dynamic"

async function checkDb(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`)
    return true
  } catch (err) {
    console.error("[health] db check failed:", err)
    return false
  }
}

async function checkAi(): Promise<boolean> {
  if (!process.env.GEMINI_API_KEY) return false
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    await ai.models.generateContent({
      model: MODEL,
      contents: "ok",
      config: { maxOutputTokens: 1 },
    })
    return true
  } catch (err) {
    console.error("[health] ai check failed:", err)
    return false
  }
}

export async function GET() {
  const [dbOk, aiOk] = await Promise.all([checkDb(), checkAi()])
  return NextResponse.json({
    ok: dbOk && aiOk,
    db: dbOk,
    ai: aiOk,
  })
}
