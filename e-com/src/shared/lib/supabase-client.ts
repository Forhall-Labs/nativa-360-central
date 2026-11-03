import { createClient } from "@supabase/supabase-js";

// Sin proyecto Supabase real conectado todavía (ver AGENTS.md TODO) — las
// env vars pueden venir vacías en dev, createClient() no falla por eso, solo
// las llamadas reales al backend de Supabase fallarían.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);
