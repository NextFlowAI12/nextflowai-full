// lib/firebaseAdmin.js
import admin from "firebase-admin";

let app;

// Evita reinicializar em dev/lambda
if (!admin.apps.length) {
  // Lê o JSON da conta de serviço (Netlify → FIREBASE_SERVICE_ACCOUNT_JSON)
  const service = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}");

  if (!service.project_id) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON ausente ou inválido.");
  }
  if (!process.env.FIREBASE_DATABASE_URL) {
    throw new Error("FIREBASE_DATABASE_URL não definido.");
  }

  app = admin.initializeApp({
    credential: admin.credential.cert(service),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else {
  app = admin.app();
}

// Exporta a instância do Realtime Database (Admin)
export function getAdminRTDB() {
  return admin.database(app);
}
