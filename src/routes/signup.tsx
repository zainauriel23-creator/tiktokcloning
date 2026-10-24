import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { registerUser } from "@/lib/register.functions";
import { AppShell } from "@/components/tiktok/app-shell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up • TikTok Clone" },
      { name: "description", content: "Create a new account." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    if (password !== String(f.get("confirm") ?? ""))
      return setError("Konfirmasi kata sandi tidak cocok.");
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
    <AppShell>
      <div className="px-4 pt-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {status === "done" ? (
          <div className="mt-24 text-center">
            <h1 className="text-3xl font-bold">YAUDAH SIII</h1>
            <p className="mt-2 text-white/60">awokawokawokawokawok.</p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-rose-500 px-6 py-2.5 font-medium text-white"
            >
              Back to feed
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="mt-1 text-sm text-white/60">Sign up to start watching and posting.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Nama lengkap" name="name" type="text" />
              <Field label="Email" name="email" type="email" />
              <Field label="Kata sandi" name="password" type="password" />
              <Field label="Konfirmasi kata sandi" name="confirm" type="password" />
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-rose-500 py-2.5 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
              >
                {status === "loading" ? "Mendaftar..." : "Sign up"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-rose-400">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <input
        required
        name={name}
        type={type}
        className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/40"
      />
    </label>
  );
}
