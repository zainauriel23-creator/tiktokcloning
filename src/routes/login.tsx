import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AppShell } from "@/components/tiktok/app-shell";
import { loginUser } from "@/lib/login.functions";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in • TikTok Clone" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");

    try {
      const result = await loginUser({ data: { email, password } });

      if (!result.ok) {
        setError(result.error);
        setStatus("idle");
        return;
      }

      // Simpan info user ke sessionStorage agar halaman lain bisa membacanya
      sessionStorage.setItem("tiktok_user", JSON.stringify(result.user));
      setStatus("done");

      // Redirect ke feed setelah login berhasil
      void navigate({ to: "/" });
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
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

        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-white/60">Masuk ke akun TikTok Clone kamu.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <label className="block">
            <span className="text-sm font-medium text-white/80">Email</span>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/30">
              <Mail className="h-4 w-4 shrink-0 text-white/40" />
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="kamu@email.com"
                className="w-full bg-transparent py-2.5 text-white outline-none placeholder:text-white/30"
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-sm font-medium text-white/80">Kata sandi</span>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/30">
              <Lock className="h-4 w-4 shrink-0 text-white/40" />
              <input
                required
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent py-2.5 text-white outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                onClick={() => setShowPw((p) => !p)}
                className="shrink-0 text-white/40 hover:text-white/70"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {/* Error message */}
          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-rose-500 py-2.5 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {status === "loading" ? "Masuk..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/60">
          Belum punya akun?{" "}
          <Link to="/signup" className="font-semibold text-rose-400 hover:text-rose-300">
            Daftar
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
