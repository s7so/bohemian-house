/**
 * Seed Firestore with initial data for Bohemian House.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your Firebase config
 *   2. Run: node scripts/seed-firestore.js
 *
 * This uses the Firebase Web SDK to populate collections.
 * Run it once after creating your Firebase project.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
const db = getFirestore(app);

const projects = [
  { title: 'Desert Bloom Villa', category: 'Residential', location: 'New Cairo', year: '2024', cover_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', description: 'A warm residential project blending earthy tones and natural materials.', featured: true },
  { title: 'Terra Café', category: 'Commercial', location: 'Zamalek', year: '2024', cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', description: 'A cozy bohemian café with reclaimed wood and lush greenery.', featured: true },
  { title: 'Oasis Apartment', category: 'Residential', location: 'Maadi', year: '2023', cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', description: 'An urban oasis with indoor plants and natural light design.', featured: true },
  { title: 'Bamboo Office', category: 'Office', location: 'Downtown Cairo', year: '2023', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', description: 'A biophilic office space promoting wellness and productivity.', featured: false },
  { title: 'Sahel Beach House', category: 'Residential', location: 'North Coast', year: '2024', cover_image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', description: 'A breezy coastal retreat with natural textures and organic shapes.', featured: false },
  { title: 'Clay Boutique Hotel', category: 'Hospitality', location: 'Siwa', year: '2023', cover_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', description: "An earthy boutique hotel inspired by Siwa's traditional architecture.", featured: false },
];

const services = [
  { title: 'Interior Design & Renovation', description: 'Comprehensive design and renovation solutions — from concept to completion — blending bohemian elegance with sustainable, eco-certified materials for spaces that truly inspire.', icon: '🪴', order: 1 },
  { title: 'Space Planning', description: 'Thoughtful space planning that maximizes flow, functionality, and natural harmony within your home or office.', icon: '📐', order: 2 },
  { title: 'Furniture Curation', description: 'Hand-selected pieces from local artisans and ethical brands that tell a story and stand the test of time.', icon: '🛋️', order: 3 },
  { title: 'Color Consultation', description: 'Earth-inspired palettes drawn from nature — terracotta, sage, sand, and clay — that breathe life into every space.', icon: '🎨', order: 4 },
  { title: 'Eco Certification', description: 'We guide you through sustainable material choices and help your space achieve the highest eco-design standards.', icon: '🌿', order: 5 },
  { title: 'Project Management', description: 'End-to-end project management from concept to completion, ensuring a smooth and stress-free experience.', icon: '✅', order: 6 },
];

const testimonials = [
  { client_name: 'Nour El Shamy', client_title: 'Homeowner, New Cairo', quote: 'Bohemian House transformed our apartment into a sanctuary. Every detail was thoughtfully chosen — we feel like we are living inside a forest.', rating: 5 },
  { client_name: 'Karim Mansour', client_title: 'Restaurant Owner, Zamalek', quote: 'The team understood our vision perfectly. Our café now has a warmth and soul that our customers absolutely love. Best investment we ever made.', rating: 5 },
  { client_name: 'Dina Fouad', client_title: 'Interior Enthusiast, Maadi', quote: 'Professional, creative, and deeply committed to sustainability. They sourced everything locally and the result is breathtaking.', rating: 5 },
];

async function seed(collectionName, items) {
  console.log(`Seeding ${collectionName}...`);
  for (const item of items) {
    await addDoc(collection(db, collectionName), {
      ...item,
      created_date: serverTimestamp(),
    });
  }
  console.log(`  Added ${items.length} documents to ${collectionName}`);
}

async function main() {
  if (!firebaseConfig.projectId) {
    console.error('Missing Firebase config. Copy .env.example to .env and fill in your values.');
    process.exit(1);
  }
  console.log(`Seeding Firestore for project: ${firebaseConfig.projectId}\n`);

  await seed('projects', projects);
  await seed('services', services);
  await seed('testimonials', testimonials);

  console.log('\nDone! Your Firestore database is populated.');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
