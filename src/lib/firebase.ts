const FIREBASE_URL = "https://akram-network-default-rtdb.firebaseio.com";

// ... (نفس تعريف واجهة DeviceEntry)

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

// دالة دمج البيانات: تحافظ على البيانات المحلية الجديدة وتضيفها للسحابة
export function mergeData(cloudData: DeviceEntry[], localData: DeviceEntry[]): DeviceEntry[] {
  const merged = [...cloudData];
  localData.forEach(localItem => {
    // نتحقق إذا لم يكن العنصر موجوداً في السحابة
    const exists = merged.find(c => c.ip === localItem.ip && c.name === localItem.name);
    if (!exists) {
      merged.push(localItem);
    }
  });
  return merged;
}

// دالة مزامنة البيانات الأوفلاين: ترفع أي عنصر لا يملك cloud_id
export async function syncOfflineData(): Promise<void> {
  const localData = loadFromLocal();
  const unsynced = localData.filter(item => !item.cloud_id);
  
  for (const item of unsynced) {
    const success = await saveToFirebase(item);
    if (success) {
      // بعد الرفع الناجح، يمكننا مسح القديم وإعادة تحميل البيانات الصحيحة
      // في التطبيق الفعلي، ستستدعي loadData بعد هذه الدالة
    }
  }
}

export async function saveToFirebase(entry: DeviceEntry): Promise<boolean> {
  try {
    // إزالة _id قبل الرفع للسحابة لتجنب الأخطاء
    const { _id, ...dataToSave } = entry;
    const res = await fetch(`${FIREBASE_URL}/network_data.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ... (احتفظ بدوال updateInFirebase و deleteFromFirebase و Local Storage كما هي)

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
