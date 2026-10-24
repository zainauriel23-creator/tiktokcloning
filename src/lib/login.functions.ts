import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(128),
});

export type LoginResult =
  { ok: true; user: { id: number; name: string; email: string } } | { ok: false; error: string };

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }): Promise<LoginResult> => {
    const { neonExecute, verifyPassword } = await import("./neon.server");
    try {
      // Look up user by email
      const { rows } = await neonExecute(
        "SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1",
        [data.email],
      );

      if (rows.length === 0) {
        // Use a generic message so we don't leak whether the email exists
        return { ok: false, error: "Email atau kata sandi salah." };
      }

      const row = rows[0]!;
      const storedHash = row.password_hash as string;

      const valid = await verifyPassword(data.password, storedHash);
      if (!valid) {
        return { ok: false, error: "Email atau kata sandi salah." };
      }

      return {
        ok: true,
        user: {
          id: row.id as number,
          name: row.name as string,
          email: row.email as string,
        },
      };
    } catch (err) {
      console.error(err);
      return { ok: false, error: "Terjadi kesalahan. Coba lagi nanti." };
    }
  });
