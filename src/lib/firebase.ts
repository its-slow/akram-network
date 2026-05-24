import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, set } from "firebase/database";

const firebaseConfig = {
  // حط هنا بيانات مشروعك من Firebase Console -> Project Settings
  apiKey: "AIzaSy...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// دالة حفظ بيانات العميل في "خزنته" الخاصة
export async function saveDeviceToUser(uid: string, entry: any) {
  const userRef = ref(db, `users/${uid}/devices`);
  const newEntryRef = push(userRef);
  await set(newEntryRef, entry);
  return newEntryRef.key;
}

// دالة جلب بيانات العميل فقط
export async function getUserDevices(uid: string) {
  const userRef = ref(db, `users/${uid}/devices`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([k, v]) => ({ ...(v as any), cloud_id: k }));
  }
  return [];
}
