import { neon } from "@neondatabase/serverless";

export type NeonError = Error & { status?: number; code?: string };

// Lazily build the Neon HTTP query client so the connection string is only read
// on the server (this module is dynamically imported from a server function).
let sqlClient: ReturnType<typeof neon> | undefined;

function getSql() {
  const DATABASE_URL = process.env["DATABASE_URL"];
  if (!DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }
  if (!sqlClient) {
    sqlClient = neon(DATABASE_URL);
  }
  return sqlClient;
}

/**
 * Run a parameterized SQL statement against the Neon database over HTTPS.
 * Throws a NeonDbError (with `.code` set to the Postgres SQLSTATE) on failure,
 * so callers can branch on e.g. unique-constraint violations (`23505`).
 */
export async function neonExecute(query: string, params: unknown[] = []) {
  const sql = getSql();
  const rows = await sql.query(query, params);
  return { rows: rows as Record<string, unknown>[] };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256,
  );
  const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `pbkdf2$100000$${hex(salt)}$${hex(new Uint8Array(bits))}`;
}

/**
 * Verify a plaintext password against a stored pbkdf2 hash.
 * Returns true if the password matches.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  // Expected format: pbkdf2$<iterations>$<salt_hex>$<hash_hex>
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = parseInt(parts[1]!, 10);
  const saltHex = parts[2]!;
  const storedHashHex = parts[3]!;

  // Decode hex salt back to Uint8Array
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256,
  );
  const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return hex(new Uint8Array(bits)) === storedHashHex;
}
