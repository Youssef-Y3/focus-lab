import { json, getSessionUser } from "./_crypto.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 database not configured." }, 503);
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: "Unauthorized" }, 401);

  const row = await env.DB.prepare(
    "SELECT state_json, updated_at FROM user_state WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!row) return json({ ok: true, state: null });

  try {
    return json({ ok: true, state: JSON.parse(row.state_json), updatedAt: row.updated_at });
  } catch {
    return json({ ok: true, state: null });
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "D1 database not configured." }, 503);
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: "Unauthorized" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const stateObj = body && body.state ? body.state : null;
  if (!stateObj || typeof stateObj !== "object") {
    return json({ error: "Missing state object" }, 400);
  }

  const now = new Date().toISOString();
  const serialized = JSON.stringify(stateObj);

  await env.DB.prepare(
    `INSERT INTO user_state (user_id, state_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at`
  )
    .bind(user.id, serialized, now)
    .run();

  return json({ ok: true, updatedAt: now });
}
