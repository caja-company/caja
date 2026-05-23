import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import Anthropic from "@anthropic-ai/sdk"
import { db } from "@/db"

// CLAUDE.md §15: modelo padrão, snapshot fixo
const MODEL = "claude-sonnet-4-6-20260218"

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
  if (!process.env.ANTHROPIC_API_KEY) return false
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    await client.messages.create({
      model: MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "ok" }],
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
