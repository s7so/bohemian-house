/**
 * Create an admin user for the Bohemian House dashboard.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your Firebase config
 *   2. Run: node scripts/create-admin.js admin@example.com YourPassword123
 *
 * Requirements:
 *   - Enable "Email/Password" sign-in in Firebase Console:
 *     Firebase Console → Authentication → Sign-in method → Email/Password → Enable
 *
 * The created account can then log in at /admin on the live site.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { config } from 'dotenv';

config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('\nUsage: node scripts/create-admin.js <email> <password>\n');
  console.error('Example: node scripts/create-admin.js admin@bohemianhouse.com MySecurePass123\n');
  process.exit(1);
}

if (password.length < 6) {
  console.error('\nError: Password must be at least 6 characters.\n');
  process.exit(1);
}

if (!firebaseConfig.projectId) {
  console.error('\nMissing Firebase config. Copy .env.example to .env and fill in your values.\n');
  process.exit(1);
}

console.log(`\nCreating admin user for project: ${firebaseConfig.projectId}`);
console.log(`Email: ${email}\n`);

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log('Admin user created successfully!');
  console.log(`  UID: ${userCredential.user.uid}`);
  console.log(`  Email: ${userCredential.user.email}`);
  console.log('\nYou can now log in at /admin on your site.');
  process.exit(0);
} catch (err) {
  if (err.code === 'auth/email-already-in-use') {
    console.error(`\nError: An account with email "${email}" already exists.`);
    console.error('You can reset the password from the admin login page.\n');
  } else if (err.code === 'auth/invalid-email') {
    console.error(`\nError: "${email}" is not a valid email address.\n`);
  } else if (err.code === 'auth/weak-password') {
    console.error('\nError: Password is too weak. Use at least 6 characters.\n');
  } else {
    console.error(`\nError: ${err.message}\n`);
    console.error('Make sure you have enabled Email/Password sign-in in Firebase Console:');
    console.error('Firebase Console → Authentication → Sign-in method → Email/Password → Enable\n');
  }
  process.exit(1);
}
