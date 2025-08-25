
import admin from 'firebase-admin';
export function getAdminApp() {
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try { const creds = JSON.parse(raw); return admin.initializeApp({ credential: admin.credential.cert(creds) }); }
  catch (e) { console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON'); return null; }
}
export function getAdminDb() {
  const app = getAdminApp();
  if (!app) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
  return admin.firestore();
}
