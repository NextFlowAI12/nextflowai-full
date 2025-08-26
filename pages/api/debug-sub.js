// pages/api/debug-sub.js
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const token = req.headers['x-admin-token'];
  if (!process.env.ADMIN_DEBUG_TOKEN || token !== process.env.ADMIN_DEBUG_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const { uid, plan = 'starter', active = true } = req.body || {};
    if (!uid) return res.status(400).json({ error: 'missing_uid' });
    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();
    await db.ref(`subscriptions/${uid}`).update({ active: !!active, plan, updatedAt: Date.now(), current_period_end: null });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
}
