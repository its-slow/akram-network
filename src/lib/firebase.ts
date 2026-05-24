import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ref, get, push, set } from "firebase/database";

// 1. دي إعدادات مشروعك اللي بتاخدها من Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "akram-network.firebaseapp.com",
  databaseURL: "https://akram-network-default-rtdb.firebaseio.com/",
  projectId: "akram-network",
  storageBucket: "akram-network.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// 2. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 3. تصدير الخدمات عشان تستخدمها في باقي المشروع
export const auth = getAuth(app);
export const db = getDatabase(app);

// 4. دالة حفظ بيانات العميل (قاعدة عندك)
export async function saveDeviceToUser(uid: string, entry: any) {
  const userRef = ref(db, `users/${uid}/devices`);
  const newEntryRef = push(userRef);
  await set(newEntryRef, entry);
  return newEntryRef.key;
}

// 5. دالة جلب بيانات العميل (قاعدة عندك)
export async function getUserDevices(uid: string) {
  const userRef = ref(db, `users/${uid}/devices`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([k, v]) => ({ ...(v as any), cloud_id: k }));
  }
  return [];
}
