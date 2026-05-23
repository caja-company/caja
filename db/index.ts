import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required")
}

// prepare: false é obrigatório para o pooler do Supabase em transaction mode (porta 6543).
const client = postgres(process.env.DATABASE_URL, { prepare: false })

export const db = drizzle(client)
