export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try{
    const { uid, name, email, phone, message } = req.body || {};
    if(!uid || !name || !email) return res.status(400).json({ error: 'missing_fields' });

    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const rtdb = getAdminRTDB();
    const id = Date.now().toString();
    const payload = { name, email, phone: phone||'', message: message||'', ts: Date.now() };
    await rtdb.ref(`leads/${uid}/${id}`).set(payload);

    const hook = process.env.LEAD_WEBHOOK_URL;
    const key = process.env.LEAD_WEBHOOK_SECRET;
    if(hook){
      try{
        await fetch(hook, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', ...(key ? {'X-Api-Key': key} : {}) },
          body: JSON.stringify({ event:'lead.created', uid, id, ...payload })
        });
      }catch(e){ console.error('lead_webhook_error', e); }
    }

    return res.status(200).json({ ok: true });
  }catch(e){
    console.error('lead_api_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}
