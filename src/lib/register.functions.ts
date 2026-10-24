import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(128),
});

export const registerUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { neonExecute, hashPassword } = await import("./neon.server");
    try {
      const hash = await hashPassword(data.password);
      await neonExecute("insert into users (name, email, password_hash) values ($1, $2, $3)", [
        data.name,
        data.email,
        hash,
      ]);
      return { ok: true as const };
    } catch (err: any) {
      console.error(err);
      if (err?.code === "23505") return { ok: false as const, error: "Email sudah terdaftar." };
      return { ok: false as const, error: "Pendaftaran gagal. Coba lagi nanti." };
    }
  });
