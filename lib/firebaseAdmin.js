// lib/firebaseAdmin.js
import admin from 'firebase-admin';

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON missing');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error('Cannot parse FIREBASE_SERVICE_ACCOUNT_JSON');
  }
}

export function getAdminApp() {
  if (!admin.apps.length) {
    const svc = getServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(svc),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
  return admin.app();
}

export function getAdminRTDB() {
  return getAdminApp().database();
}
