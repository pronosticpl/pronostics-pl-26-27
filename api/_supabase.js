const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

function supabaseRequest(pathname, options = {}) {
  const headers = {
    apikey: supabaseServiceKey,
    authorization: `Bearer ${supabaseServiceKey}`,
    "content-type": "application/json",
    ...(options.headers || {}),
  };
  return fetch(`${supabaseUrl}${pathname}`, { ...options, headers });
}

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

module.exports = {
  hasSupabaseConfig,
  sendJson,
  supabaseRequest,
};
