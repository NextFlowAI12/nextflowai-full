// lib/firebaseAdmin.js
import admin from 'firebase-admin';

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON missing');

  // Try plain JSON
  try { return JSON.parse(raw); } catch (_) {}

  // Try base64 -> JSON
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (_) {}

  // Try replacing escaped \n by real newlines
  try { return JSON.parse(raw.replace(/\\n/g, '\n')); } catch (_) {}

  throw new Error('Cannot parse FIREBASE_SERVICE_ACCOUNT_JSON');
}

let app;
export function getAdminApp() {
  if (app) return app;
  const creds = parseServiceAccount();
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!databaseURL) throw new Error('FIREBASE_DATABASE_URL missing');

  if (admin.apps && admin.apps.length) {
    app = admin.apps[0];
  } else {
    app = admin.initializeApp({
      credential: admin.credential.cert(creds),
      databaseURL,
    });
  }
  return app;
}

export function getAdminRTDB() {
  return getAdminApp().database();
}
