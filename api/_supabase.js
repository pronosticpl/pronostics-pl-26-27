const supabaseUrl = cleanUrl(process.env.SUPABASE_URL);
const supabaseServiceKey = readSecretKey();

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

function supabaseRequest(pathname, options = {}) {
  const headers = {
    apikey: supabaseServiceKey,
    "content-type": "application/json",
    ...(options.headers || {}),
  };
  if (!supabaseServiceKey.startsWith("sb_secret_") && !supabaseServiceKey.startsWith("sb_publishable_")) {
    headers.authorization = `Bearer ${supabaseServiceKey}`;
  }
  return fetch(`${supabaseUrl}${pathname}`, { ...options, headers });
}

function supabaseConfigInfo() {
  let host = "";
  try {
    host = new URL(supabaseUrl).host;
  } catch {
    host = "URL invalide";
  }
  return {
    host,
    keyType: keyType(supabaseServiceKey),
    keyLength: supabaseServiceKey.length,
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
    hasSecretKeysJson: Boolean(process.env.SUPABASE_SECRET_KEYS),
  };
}

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function cleanValue(value = "") {
  return String(value).trim().replace(/^["']|["']$/g, "");
}

function cleanUrl(value = "") {
  return cleanValue(value).replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function readSecretKey() {
  const direct = cleanValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY
  );
  if (direct) return direct;

  try {
    const keys = JSON.parse(process.env.SUPABASE_SECRET_KEYS || "{}");
    return cleanValue(keys.default || Object.values(keys)[0] || "");
  } catch {
    return "";
  }
}

function keyType(value) {
  if (value.startsWith("sb_secret_")) return "sb_secret";
  if (value.startsWith("sb_publishable_")) return "sb_publishable";
  if (value.split(".").length === 3) return "JWT";
  if (!value) return "absente";
  return "inconnue";
}

module.exports = {
  hasSupabaseConfig,
  sendJson,
  supabaseConfigInfo,
  supabaseRequest,
};
