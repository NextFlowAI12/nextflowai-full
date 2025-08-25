import admin from 'firebase-admin';

export function getAdminApp() {
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const creds = JSON.parse(raw);
    const dbURL = process.env.FIREBASE_DATABASE_URL; // ex.: https://<project>-default-rtdb.europe-west1.firebasedatabase.app
    return admin.initializeApp({ credential: admin.credential.cert(creds), databaseURL: dbURL });
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON');
    return null;
  }
}

export function getAdminRTDB() {
  const app = getAdminApp();
  if (!app) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON / FIREBASE_DATABASE_URL');
  return admin.database();
}
