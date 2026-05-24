const FIREBASE_URL = "https://akram-network-default-rtdb.firebaseio.com";

export interface DeviceEntry {
  _id?: string;
  cloud_id?: string;
  position: "تحت" | "فوق";
  region: string;
  name?: string;
  phone?: string;
  ip: string;
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
  above_pppoe_user?: string;
  above_pppoe_pass?: string;
}

export async function loadFromFirebase(): Promise<DeviceEntry[] | null> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return [];
    return Object.entries(data).map(([k, v]) => ({
      ...(v as DeviceEntry),
      cloud_id: k,
    }));
  } catch {
    return null;
  }
}

export async function saveToFirebase(entry: DeviceEntry): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateInFirebase(cloudId: string, entry: DeviceEntry): Promise<boolean> {
  try {
    const { _id, cloud_id, ...clean } = entry;
    const res = await fetch(`${FIREBASE_URL}/network_data/${cloudId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteFromFirebase(cloudId: string): Promise<void> {
  try {
    await fetch(`${FIREBASE_URL}/network_data/${cloudId}.json`, {
      method: "DELETE",
    });
  } catch {
    // silent
  }
}

const LOCAL_KEY = "akram_network_data";

export function loadFromLocal(): DeviceEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocal(data: DeviceEntry[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export function addToLocal(entry: DeviceEntry): void {
  const data = loadFromLocal();
  data.push(entry);
  saveToLocal(data);
}

export function deleteFromLocal(ip: string, name?: string): void {
  const data = loadFromLocal();
  const filtered = data.filter(
    (item) => !(item.ip === ip && item.name === name)
  );
  saveToLocal(filtered);
}
