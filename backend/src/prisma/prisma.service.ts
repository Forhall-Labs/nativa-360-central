import { Injectable, Logger } from "@nestjs/common";
import type {
  RoleBoundDb,
  ServiceRoleDb,
  SupabaseDb,
} from "@prisma/orm-extension-supabase/runtime";
import { createDb } from "./db.js";
import type { Contract } from "./contract.d.ts";

/**
 * No conecta en `onModuleInit` a propósito: sin un proyecto Supabase real
 * (ver AGENTS.md TODO), intentarlo tumbaría el arranque de toda la app. El
 * cliente se arma perezosamente en el primer uso real.
 */
@Injectable()
export class PrismaService {
  private readonly logger = new Logger(PrismaService.name);
  private clientPromise: ReturnType<typeof createDb> | null = null;

  private getClient(): Promise<SupabaseDb<Contract>> {
    this.clientPromise ??= createDb();
    return this.clientPromise;
  }

  /** Role-bound como el usuario dueño del JWT — Postgres aplica las políticas RLS. */
  async forUser(jwt: string): Promise<RoleBoundDb<Contract>> {
    const client = await this.getClient();
    return client.asUser(jwt);
  }

  /** Bypassa RLS. Reservado para jobs de background sin JWT de un request. */
  async forServiceRole(): Promise<ServiceRoleDb<Contract>> {
    const client = await this.getClient();
    return client.asServiceRole();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.clientPromise) return;
    try {
      const client = await this.clientPromise;
      await client.close();
    } catch {
      this.logger.warn("No se pudo cerrar la conexión de Prisma limpiamente.");
    }
  }
}
