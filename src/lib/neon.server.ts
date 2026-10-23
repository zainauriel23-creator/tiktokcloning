const GATEWAY_URL = "https://connector-gateway.lovable.dev/neon";

function gatewayHeaders(): Record<string, string> {
  const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
  const NEON_API_KEY = process.env["NEON_API_KEY"];
  if (!LOVABLE_API_KEY || !NEON_API_KEY) {
    throw new Error("Missing LOVABLE_API_KEY or NEON_API_KEY");
  }
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": NEON_API_KEY,
    "Content-Type": "application/json",
  };
}

export type NeonError = Error & { status: number; code?: string };

export async function neonExecute(query: string, params: unknown[] = []) {
  const res = await fetch(`${GATEWAY_URL}/sql`, {
    method: "POST",
    headers: gatewayHeaders(),
    body: JSON.stringify({ query, params }),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw Object.assign(new Error(`Neon ${res.status}: ${json?.message ?? text.slice(0, 300)}`), {
      status: res.status,
      code: json?.code,
    }) as NeonError;
  }
  return json as { rows: Record<string, unknown>[] };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `pbkdf2$100000$${hex(salt)}$${hex(new Uint8Array(bits))}`;
}
