import Joi from "joi";

// Todo opcional a propósito: hoy el repo es scaffolding sin proyecto
// Supabase/Redis real conectado (ver AGENTS.md TODO) — la app debe poder
// levantar sin estas variables.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().optional().allow(""),
  SUPABASE_URL: Joi.string().optional().allow(""),
  SUPABASE_ANON_KEY: Joi.string().optional().allow(""),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().optional().allow(""),
  SUPABASE_JWKS_URL: Joi.string().optional().allow(""),
  REDIS_URL: Joi.string().optional().allow(""),
  ALLOWED_ORIGINS: Joi.string().optional().allow(""),
});
