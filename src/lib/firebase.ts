const FIREBASE_URL = "https://akram-network-default-rtdb.firebaseio.com";
const LOCAL_KEY = "akram_network_data";

export interface DeviceEntry {
  cloud_id?: string;
  ip: string;
  name?: string;
  position: "تحت" | "فوق";
  region: string;
  device?: string;
}

// جلب البيانات من السحابة
export async function loadFromFirebase(): Promise<DeviceEntry[]> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data.json`);
    const data = await res.json();
    return data ? Object.entries(data).map(([k, v]) => ({ ...(v as DeviceEntry), cloud_id: k })) : [];
  } catch { return []; }
}

// حفظ جديد للسحابة
export async function saveToFirebase(entry: DeviceEntry): Promise<string | null> {
  try {
    const { cloud_id, ...dataToSave } = entry;
    const res = await fetch(`${FIREBASE_URL}/network_data.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });
    const result = await res.json();
    return result.name;
  } catch { return null; }
}

// التعامل مع التخزين المحلي
export function loadFromLocal(): DeviceEntry[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}

export function saveToLocal(data: DeviceEntry[]): void { 
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); 
}

// دمج البيانات (المنطق السحري)
export function mergeData(cloud: DeviceEntry[], local: DeviceEntry[]): DeviceEntry[] {
  const merged = [...cloud];
  local.forEach(l => {
    if (!l.cloud_id && !merged.find(c => c.ip === l.ip)) {
      merged.push(l);
    }
  });
  return merged;
}
