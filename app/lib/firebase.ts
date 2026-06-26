// lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, push, set, onValue, query, orderByChild, limitToLast, serverTimestamp } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL9OdvnmzzP1iXmv6Uc0iiaAhTfG4IbUU",
  authDomain: "vriksha-gyan-hackathon.firebaseapp.com",
  databaseURL: "https://vriksha-gyan-hackathon-default-rtdb.firebaseio.com",
  projectId: "vriksha-gyan-hackathon",
  storageBucket: "vriksha-gyan-hackathon.firebasestorage.app",
  messagingSenderId: "903622465365",
  appId: "1:903622465365:web:bab069b7d60bcf2b7fc1dc",
  measurementId: "G-37G8HJ5WKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

console.log("Firebase initialized successfully with real-time database and auth");

export { db, auth, app };

// Realtime Database helper functions to match Firestore API
export const collection = (database: any, path: string) => ref(database, path);

export const doc = (database: any, collectionPath: string, docId: string) => 
  ref(database, `${collectionPath}/${docId}`);

export const setDoc = (docRef: any, data: any) => set(docRef, data);

export const onSnapshot = (queryRef: any, callback: any, errorCallback?: any) => {
  if (!db) {
    console.warn("Firebase database not initialized. Returning empty data.");
    callback({ forEach: (fn: any) => [] });
    return () => {}; // Return empty unsubscribe function
  }
  
  return onValue(queryRef, (snapshot) => {
    const data: any[] = [];
    if (snapshot.exists()) {
      const val = snapshot.val();
      Object.keys(val).forEach(key => {
        data.push({ id: key, ...val[key] });
      });
    }
    // Sort by timestamp descending (newest first)
    data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    callback({
      forEach: (fn: any) => data.forEach(fn)
    });
  }, (error) => {
    console.error("Firebase onSnapshot error:", error);
    if (errorCallback) errorCallback(error);
  });
};

export { ref, push, set, onValue, query, orderByChild, limitToLast, serverTimestamp };