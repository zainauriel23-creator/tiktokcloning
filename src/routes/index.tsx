import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { registerUser } from "@/lib/register.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daftar Akun" },
      { name: "description", content: "Buat akun baru dalam hitungan detik." },
      { property: "og:title", content: "Daftar Akun" },
      { property: "og:description", content: "Buat akun baru dalam hitungan detik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

function Register() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    if (password !== String(f.get("confirm") ?? "")) return setError("Konfirmasi kata sandi tidak cocok.");
    if (password.length < 8) return setError("Kata sandi minimal 8 karakter.");
    setError("");
    setStatus("loading");
    try {
      const res = await registerUser({ data: { name, email, password } });
      if (res.ok) setStatus("done");
      else {
        setError(res.error);
        setStatus("idle");
      }
    } catch {
      setError("Periksa kembali data Anda.");
      setStatus("idle");
    }
  }

  return (
    <main className="register-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        {status === "done" ? (
          <div className="text-center">
            <h1 className="font-display text-3xl text-foreground">Berhasil!</h1>
            <p className="mt-2 text-muted-foreground">Akun Anda sudah terdaftar.</p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl text-foreground">Buat akun</h1>
            <p className="mt-1 text-sm text-muted-foreground">Isi data di bawah untuk mendaftar.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Nama lengkap" name="name" type="text" />
              <Field label="Email" name="email" type="email" />
              <Field label="Kata sandi" name="password" type="password" />
              <Field label="Konfirmasi kata sandi" name="confirm" type="password" />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Mendaftar..." : "Daftar"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        required
        name={name}
        type={type}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
