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

export async function loadFromFirebase(): Promise<DeviceEntry[]> {
  try {
    const res = await fetch(`${FIREBASE_URL}/network_data.json`);
    const data = await res.json();
    return data ? Object.entries(data).map(([k, v]) => ({ ...(v as DeviceEntry), cloud_id: k })) : [];
  } catch { return []; }
}

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

export function loadFromLocal(): DeviceEntry[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}

export function saveToLocal(data: DeviceEntry[]): void { 
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); 
}

// دالة المزامنة الذكية التي كنت تطلبها
export async function syncData(): Promise<DeviceEntry[]> {
  const local = loadFromLocal();
  const cloud = await loadFromFirebase();

  // 1. رفع أي جهاز محلي ليس له cloud_id للسحابة
  for (const item of local) {
    if (!item.cloud_id) {
      const newId = await saveToFirebase(item);
      if (newId) item.cloud_id = newId;
    }
  }

  // 2. دمج السحابة مع المحلي (لضمان أن كل شيء متطابق)
  const combined = [...cloud];
  local.forEach(l => {
    if (!combined.find(c => c.ip === l.ip)) combined.push(l);
  });

  saveToLocal(combined);
  return combined;
}
