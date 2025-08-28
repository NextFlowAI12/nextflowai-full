// pages/api/admin-activate.js
export default async function handler(req, res){
  const token = req.query.token || req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_DEBUG_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const uid = req.query.uid || null;
  const email = req.query.email || null;
  const active = (req.query.active || 'true') === 'true';
  const plan = req.query.plan || 'starter';

  try {
    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();
    const payload = { active, plan, updatedAt: Date.now() };

    const updates = {};
    if (uid) {
      updates[`subscriptions/${uid}`] = payload;
      updates[`subscriptionsByUid/${uid}`] = payload;
    }
    if (email) {
      const emailKey = email.replaceAll('.', ',');
      updates[`subscriptions/${emailKey}`] = payload;
      updates[`subscriptionsByEmail/${emailKey}`] = payload;
    }

    if (!uid && !email) {
      return res.status(400).json({ error: 'missing_uid_or_email' });
    }

    await (await db.ref()).update(updates);
    return res.status(200).json({ ok: true, payload });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', message: e?.message || String(e) });
  }
}
