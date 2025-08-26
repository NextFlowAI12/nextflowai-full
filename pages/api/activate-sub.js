// pages/api/activate-sub.js
// Uso via URL (só para testes): 
// /api/activate-sub?token=SEU_ADMIN_DEBUG_TOKEN&uid=USER_UID&plan=pro&active=true
export default async function handler(req, res){
  try{
    const token = req.query.token || req.headers['x-admin-token'];
    if (!process.env.ADMIN_DEBUG_TOKEN || token !== process.env.ADMIN_DEBUG_TOKEN) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const uid = req.query.uid;
    const plan = (req.query.plan || 'starter').toLowerCase();
    const active = String(req.query.active || 'true') === 'true';

    if (!uid) return res.status(400).json({ error: 'missing_uid' });

    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();
    await db.ref(`subscriptions/${uid}`).update({
      active, plan, updatedAt: Date.now(), current_period_end: null
    });
    res.status(200).json({ ok:true, uid, plan, active });
  }catch(e){
    res.status(500).json({ error:'server_error', message: e?.message || String(e) });
  }
}
