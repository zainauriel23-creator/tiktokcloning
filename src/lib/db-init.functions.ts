import { createServerFn } from "@tanstack/react-start";

/**
 * Creates the `users` table if it doesn't exist yet.
 * Call this once from the browser console or a setup route:
 *   import { initDb } from "@/lib/db-init.functions";
 *   await initDb();
 */
export const initDb = createServerFn({ method: "POST" }).handler(async () => {
  const { neonExecute } = await import("./neon.server");
  await neonExecute(
    `CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT        NOT NULL,
      email         TEXT        NOT NULL UNIQUE,
      password_hash TEXT        NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    [],
  );
  return { ok: true };
});
