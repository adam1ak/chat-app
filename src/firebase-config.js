import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';

console.log("API Key: ", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("Auth Domain: ", process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log("Database URL: ", process.env.REACT_APP_FIREBASE_DATABASE_URL);
console.log("Project ID: ", process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log("Storage Bucket: ", process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);
console.log("Messaging Sender ID: ", process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID);
console.log("App ID: ", process.env.REACT_APP_FIREBASE_APP_ID);


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default app;
