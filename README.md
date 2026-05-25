# Bohemian House — Eco-Friendly Interior Design

A React SPA for Bohemian House, an eco-friendly interior design studio based in Cairo.

**Live site:** [https://s7so.github.io/bohemian-house/](https://s7so.github.io/bohemian-house/)

## Tech Stack

- React 18 + Vite
- Tailwind CSS + Framer Motion
- Firebase (Auth + Firestore)
- GitHub Pages (auto-deploy via GitHub Actions)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/s7so/bohemian-house.git
cd bohemian-house
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create a project
2. Enable **Authentication** → Sign-in method → **Email/Password** → Enable
3. Enable **Firestore Database** (start in test mode, then deploy `firestore.rules`)
4. Go to Project Settings → General → Add a **Web app** → copy the config
5. Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

### 3. Seed initial data

```bash
node scripts/seed-firestore.js
```

### 4. Create an admin account

```bash
node scripts/create-admin.js admin@example.com YourSecurePassword
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Admin Dashboard

Go to `/admin` and sign in with your Firebase admin email/password.

Features:
- **Projects** — add, edit, delete, mark as featured
- **Messages** — view contact form submissions, mark as read
- **Testimonials** — manage client reviews

### Security

- Admin authentication via Firebase Auth (Email/Password)
- Firestore rules: public read, authenticated write only
- Image URLs instead of file upload (no paid Storage plan needed)
- Password reset via email

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`.

To set up deployment for a new fork:
1. Go to repo **Settings → Pages → Source → GitHub Actions**
2. Add Firebase secrets to **Settings → Secrets → Actions**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
