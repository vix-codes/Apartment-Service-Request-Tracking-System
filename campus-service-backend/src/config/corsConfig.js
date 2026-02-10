
const normalizeOrigin = (value) => {
  if (!value) return "";
  let v = String(value).trim().replace(/\/+$/, "");
  if (!v) return "";

  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;

  try {
    return new URL(v).origin;
  } catch {
    return "";
  }
};

const normalizeWildcardSuffix = (value) => {
  if (!value) return "";
  const v = String(value).trim().toLowerCase();
  if (!v) return "";

  // Support: "*.vercel.app" or ".vercel.app" meaning any subdomain under it.
  if (v === "*") return "*";
  if (v.startsWith("*.")) return `.${v.slice(2)}`;
  if (v.startsWith(".")) return v;
  return "";
};

const defaultOrigins = [
  "https://csrts.vercel.app", // Production frontend (example)
  "http://localhost:5173", // Default local frontend
];

const rawParts = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => String(s || "").trim())
  .filter(Boolean);

let allowAllOrigins = false;
const exactOrigins = new Set(defaultOrigins.map(normalizeOrigin).filter(Boolean));
const allowedSuffixes = [];

for (const part of rawParts) {
  const suffix = normalizeWildcardSuffix(part);
  if (suffix === "*") {
    allowAllOrigins = true;
    continue;
  }
  if (suffix) {
    allowedSuffixes.push(suffix);
    continue;
  }
  const normalized = normalizeOrigin(part);
  if (normalized) exactOrigins.add(normalized);
}

const corsConfig = {
  origin: (origin, cb) => {
    // Non-browser clients may not send an Origin header.
    if (!origin) return cb(null, true);

    if (allowAllOrigins) return cb(null, true);

    const normalized = normalizeOrigin(origin);
    if (normalized && exactOrigins.has(normalized)) return cb(null, true);

    if (normalized && allowedSuffixes.length) {
      try {
        const host = new URL(normalized).hostname.toLowerCase();
        if (allowedSuffixes.some((suffix) => host.endsWith(suffix))) {
          return cb(null, true);
        }
      } catch {
        // ignore
      }
    }

    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsConfig;
