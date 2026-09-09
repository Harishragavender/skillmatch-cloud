import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ── Firebase project config (reads from .env / Vite env) ──
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// True only when real Firebase credentials are present in .env
export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
);

// ── Initialize Firebase services (safe to call once) ──
let app  = null;
let auth = null;
let db   = null;
let storage = null;

try {
  if (isLiveFirebaseConfigured) {
    app     = initializeApp(firebaseConfig);
    auth    = getAuth(app);
    db      = getFirestore(app);
    storage = getStorage(app);
    console.info('SkillMatch Cloud: Firebase live mode — Firestore + Auth connected.');
  } else {
    console.info('SkillMatch Cloud: No Firebase credentials — falling back to localStorage.');
  }
} catch (err) {
  console.warn('SkillMatch Cloud: Firebase init failed, using localStorage fallback.', err);
}

export { app, auth, db, storage };
