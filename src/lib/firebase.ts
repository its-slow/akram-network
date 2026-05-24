import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, set, update, remove } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);

export async function saveDeviceToUser(uid: string, entry: any) {
  if (entry.cloud_id) {
    const deviceRef = ref(db, `users/${uid}/devices/${entry.cloud_id}`);
    await update(deviceRef, entry);
  } else {
    const userRef = ref(db, `users/${uid}/devices`);
    const newEntryRef = push(userRef);
    await set(newEntryRef, entry);
  }
}

export async function getUserDevices(uid: string) {
  const userRef = ref(db, `users/${uid}/devices`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([k, v]) => ({ ...(v as any), cloud_id: k }));
  }
  return [];
}

export async function deleteDeviceFromUser(uid: string, cloud_id: string) {
  const deviceRef = ref(db, `users/${uid}/devices/${cloud_id}`);
  await remove(deviceRef);
}
