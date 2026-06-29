import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use firebase-admin via dynamic import (ESM-compatible)
const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");

// Initialize using GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_TOKEN via ADC
if (!getApps().length) {
  initializeApp({
    projectId: "lemon-es-tu-dios",
  });
}

const db = getFirestore();

const dataPath = join(__dirname, "data", "austinRestaurants200.json");
const restaurants = JSON.parse(readFileSync(dataPath, "utf-8"));

console.log(`Seeding ${restaurants.length} restaurants into Firestore...`);

const BATCH_SIZE = 400;

for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
  const batch = db.batch();
  const chunk = restaurants.slice(i, i + BATCH_SIZE);

  for (const restaurant of chunk) {
    const ref = db.collection("restaurants").doc(restaurant.id);
    batch.set(ref, restaurant);
  }

  await batch.commit();
  const end = Math.min(i + BATCH_SIZE, restaurants.length);
  console.log(`  Wrote ${i + 1}–${end} of ${restaurants.length}`);
}

console.log("Done. All restaurants seeded.");
