import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromLocal, saveToLocal, mergeData, loadFromFirebase, saveToFirebase } from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { NetworkTree } from "@/components/NetworkTree";
import { SearchBar } from "@/components/SearchBar";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);

  const syncAll = useCallback(async () => {
    const local = loadFromLocal();
    const cloud = await loadFromFirebase();
    const combined = mergeData(cloud, local);
    setAllData(combined);
    saveToLocal(combined);
  }, []);

  useEffect(() => { syncAll(); }, [syncAll]);

  const handleSave = async (entry: DeviceEntry) => {
    const local = loadFromLocal();
    // إزالة النسخة القديمة من الجهاز بنفس الـ IP قبل إضافة الجديد
    const updated = [...local.filter(i => i.ip !== entry.ip), entry];
    saveToLocal(updated);
    setAllData(mergeData([], updated));
    
    toast.info("تم الحفظ محلياً");
    
    const newId = await saveToFirebase(entry);
    if (newId) {
      toast.success("تم التزامن مع السحابة");
      syncAll();
    }
  };

  return (
    <div className="bg-[#0b0b0e] text-white min-h-screen" dir="rtl">
      <SearchBar onSearch={() => {}} />
      <DeviceForm onSave={handleSave} />
      <NetworkTree data={allData} />
    </div>
  );
}
