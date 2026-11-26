import {
  json,
  randomHex,
  hashPassword,
  timingSafeEqual,
  signSession,
  sessionCookieHeader,
  getSessionUser,
} from "./_crypto.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) {
    return json({ authenticated: false, error: "D1 database binding (DB) is not configured." }, 503);
  }
  const user = await getSessionUser(request, env);
  return json({ authenticated: Boolean(user), user: user || null });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ error: "قاعدة البيانات غير مربوطة بعد (D1 binding: DB)." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "بيانات غير صالحة." }, 400);
  }

  const action = String(body.action || "").trim();

  if (action === "logout") {
    return json(
      { ok: true },
      200,
      { "Set-Cookie": sessionCookieHeader("", request, true) }
    );
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !email.includes("@") || email.length > 160) {
    return json({ error: "يرجى إدخال بريد إلكتروني صحيح." }, 400);
  }
  if (password.length < 6) {
    return json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }, 400);
  }

  if (action === "register") {
    const name = String(body.name || "").trim() || email.split("@")[0];
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first();
    if (existing) {
      return json({ error: "هذا البريد مسجل بالفعل. يمكنك تسجيل الدخول مباشرة." }, 409);
    }

    const id = crypto.randomUUID();
    const salt = randomHex(16);
    const passwordHash = await hashPassword(password, salt);
    const now = new Date().toISOString();

    await env.DB.prepare(
      "INSERT INTO users (id, email, name, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, email, name, passwordHash, salt, now)
      .run();

    const user = { id, email, name };
    const token = await signSession(user, env.AUTH_SECRET);
    return json(
      { ok: true, user },
      201,
      { "Set-Cookie": sessionCookieHeader(token, request, false) }
    );
  }

  if (action === "login") {
    const row = await env.DB.prepare(
      "SELECT id, email, name, password_hash, salt FROM users WHERE email = ?"
    )
      .bind(email)
      .first();

    if (!row) {
      return json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, 401);
    }

    const candidateHash = await hashPassword(password, row.salt);
    if (!timingSafeEqual(candidateHash, row.password_hash)) {
      return json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, 401);
    }

    const user = { id: row.id, email: row.email, name: row.name };
    const token = await signSession(user, env.AUTH_SECRET);
    return json(
      { ok: true, user },
      200,
      { "Set-Cookie": sessionCookieHeader(token, request, false) }
    );
  }

  return json({ error: "عملية غير مدعومة." }, 400);
}
