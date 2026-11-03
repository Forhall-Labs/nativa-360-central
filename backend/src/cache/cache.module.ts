import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-yet";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const url = process.env.REDIS_URL;
        // Sin REDIS_URL (ver AGENTS.md TODO) cae al store en memoria default
        // de cache-manager — la app no depende de tener Redis corriendo.
        if (!url) return {};
        const store = await redisStore({ url });
        return { store };
      },
    }),
  ],
})
export class AppCacheModule {}
