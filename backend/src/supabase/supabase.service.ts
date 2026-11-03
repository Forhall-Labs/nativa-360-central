import { Injectable } from "@nestjs/common";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase (Auth admin / Storage / Realtime — lo que no cubre
 * Prisma, ver src/prisma/). Se arma perezosamente: sin SUPABASE_URL /
 * SUPABASE_SERVICE_ROLE_KEY reales (ver AGENTS.md TODO), levantar la app no
 * debe fallar — solo falla si algo intenta usarlo de verdad.
 */
@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  getClient(): SupabaseClient {
    if (this.client) return this.client;

    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new Error(
        "Supabase no está configurado todavía — falta SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. Ver AGENTS.md.",
      );
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    return this.client;
  }
}
