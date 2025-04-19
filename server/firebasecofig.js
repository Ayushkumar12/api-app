
import admin from 'firebase-admin';
// TODO: Add SDKs for Firebase products that you want to use
import { readFileSync } from 'fs';

// Load service account key JSON (downloaded from Firebase Console > Project Settings > Service Accounts)
const serviceAccount = JSON.parse(readFileSync('./server/key.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

export { db };