const supabaseUrl = cleanUrl(process.env.SUPABASE_URL);
const supabaseServiceKey = cleanValue(
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY
);

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

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function cleanValue(value = "") {
  return String(value).trim().replace(/^["']|["']$/g, "");
}

function cleanUrl(value = "") {
  return cleanValue(value).replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

module.exports = {
  hasSupabaseConfig,
  sendJson,
  supabaseRequest,
};
