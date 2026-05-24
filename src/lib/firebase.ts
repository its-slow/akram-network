const FIREBASE_URL = "https://akram-network-default-rtdb.firebaseio.com";
const LOCAL_KEY = "akram_network_data";

export interface DeviceEntry {
  _id?: string;
  cloud_id?: string;
  ip: string;
  name?: string;
  position: "تحت" | "فوق";
  region: string;
  device?: string;
  service?: string;
  conn_type?: string;
  pppoe_user?: string;
  pppoe_pass?: string;
  switch_name?: string;
  mode?: string;
  link_type?: string;
  connected_to?: string;
  wifi_name?: string;
  wifi_pass?: string;
}

export async function loadFromFirebase(): Promise<DeviceEntry[] | null> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data.json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data ? Object.entries(data).map(([k, v]) => ({ ...(v as DeviceEntry), cloud_id: k })) : [];
  } catch { return null; }
}

export async function saveToFirebase(entry: DeviceEntry): Promise<string | null> {
  try {
    const { _id, cloud_id, ...dataToSave } = entry;
    const res = await fetch(`${FIREBASE_URL}/network_data.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });
    const result = await res.json();
    return result.name; // هذا هو الـ cloud_id الجديد
  } catch { return null; }
}

export async function updateInFirebase(cloud_id: string, entry: DeviceEntry): Promise<boolean> {
  try {
    const { _id, cloud_id: _, ...dataToUpdate } = entry;
    const res = await fetch(`${FIREBASE_URL}/network_data/${cloud_id}.json`, {
      method: "PUT",
      body: JSON.stringify(dataToUpdate),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteFromFirebase(cloud_id: string): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data/${cloud_id}.json`, { method: "DELETE" });
    return res.ok;
  } catch { return false; }
}

export function loadFromLocal(): DeviceEntry[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}

export function saveToLocal(data: DeviceEntry[]): void { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }
