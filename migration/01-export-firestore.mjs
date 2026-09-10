// Read-only Firestore export script — does NOT modify or delete any Firebase data.
// Uses the same public web config already embedded in the shipped client/admin apps.
import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: "AIzaSyD_FrYxMZO2ICN0aAswNxKXthmZO_yQd6c",
  authDomain: "veritaz-bbaf5.firebaseapp.com",
  projectId: "veritaz-bbaf5",
  storageBucket: "veritaz-bbaf5.firebasestorage.app",
  messagingSenderId: "556585946340",
  appId: "1:556585946340:web:d569fa757126263063f0f1",
  measurementId: "G-PV7C87QKNQ",
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

const COLLECTIONS = [
  "books (5)",
  "conferences (2)",
  "events (2)",
  "testimonials",
  "team_contacts",
  "inquiries",
];

const outDir = path.join(__dirname, "firebase-backup");
fs.mkdirSync(outDir, { recursive: true });

const summary = {};

for (const name of COLLECTIONS) {
  try {
    const snap = await getDocs(collection(db, name));
    const docs = [];
    snap.forEach((d) => {
      docs.push({ __docId: d.id, ...d.data() });
    });
    const safeName = name.replace(/[^a-z0-9]+/gi, "_");
    const filePath = path.join(outDir, `${safeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf-8");

    let arrayRowCount = 0;
    let hasDataArrayShape = false;
    for (const d of docs) {
      if (Array.isArray(d.data)) {
        hasDataArrayShape = true;
        arrayRowCount += d.data.length;
      }
    }

    summary[name] = {
      firestoreDocCount: docs.length,
      shape: hasDataArrayShape ? "array-in-doc" : "one-doc-per-record",
      totalLogicalRecords: hasDataArrayShape ? arrayRowCount : docs.length,
      file: `${safeName}.json`,
    };
    console.log(`OK  ${name}: ${docs.length} firestore doc(s), ${summary[name].totalLogicalRecords} logical record(s) -> ${safeName}.json`);
  } catch (err) {
    summary[name] = { error: String(err) };
    console.error(`FAIL ${name}:`, err.message || err);
  }
}

fs.writeFileSync(path.join(outDir, "_summary.json"), JSON.stringify(summary, null, 2), "utf-8");
console.log("\nSummary written to migration/firebase-backup/_summary.json");
process.exit(0);
