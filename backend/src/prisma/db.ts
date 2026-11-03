import "dotenv/config";
import { supabase } from "@prisma/orm-extension-supabase/runtime";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

/**
 * Construye el cliente lazy — no se llama al importar el módulo porque
 * DATABASE_URL/SUPABASE_URL todavía no apuntan a un proyecto real (ver
 * AGENTS.md TODO). PrismaService solo invoca esto cuando algo pide usar la
 * base de verdad, así el resto de la app arranca sin credenciales.
 */
export function createDb(): ReturnType<typeof supabase<Contract>> {
  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!databaseUrl || !supabaseUrl) {
    throw new Error(
      "Prisma/Supabase no están configurados todavía — falta DATABASE_URL y/o SUPABASE_URL. Ver AGENTS.md.",
    );
  }
  const jwksUrl = process.env.SUPABASE_JWKS_URL ?? `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

  return supabase<Contract>({
    contractJson,
    url: databaseUrl,
    jwksUrl,
  });
}
