import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// إعدادات مشروعك اللي أنت جبتها
const firebaseConfig = {
  apiKey: "AIzaSyBFKXIAamCskr5Zva3AAzlr0xXupodUrbc",
  authDomain: "akram-network.firebaseapp.com",
  databaseURL: "https://akram-network-default-rtdb.firebaseio.com",
  projectId: "akram-network",
  storageBucket: "akram-network.firebasestorage.app",
  messagingSenderId: "315698997151",
  appId: "1:315698997151:web:5ea66b24653778eecaffaa",
  measurementId: "G-MF4T0NDXNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // شغال معاك

// تصدير الـ Auth والـ Database عشان تستخدمهم في مشروعك
export const auth = getAuth(app);
export const db = getDatabase(app);

// الدوال عشان الشغل يشتغل
export async function saveDeviceToUser(uid: string, entry: any) {
  const userRef = ref(db, `users/${uid}/devices`);
  const newEntryRef = push(userRef);
  await set(newEntryRef, entry);
  return newEntryRef.key;
}

export async function getUserDevices(uid: string) {
  const userRef = ref(db, `users/${uid}/devices`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([k, v]) => ({ ...(v as any), cloud_id: k }));
  }
  return [];
}
