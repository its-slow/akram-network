import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromLocal, saveToLocal, mergeData, loadFromFirebase, processPendingData } from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { NetworkTree } from "@/components/NetworkTree";
import { SearchBar } from "@/components/SearchBar";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);

  const fullSync = useCallback(async () => {
    // 1. رفع أي بيانات معلقة
    await processPendingData();
    // 2. تحديث القائمة من المصدرين
    const local = loadFromLocal();
    const cloud = await loadFromFirebase();
    const combined = mergeData(cloud, local);
    setAllData(combined);
    saveToLocal(combined);
  }, []);

  useEffect(() => {
    fullSync();
    // المزامنة التلقائية عند عودة الإنترنت
    window.addEventListener('online', fullSync);
    return () => window.removeEventListener('online', fullSync);
  }, [fullSync]);

  const handleSave = async (entry: DeviceEntry) => {
    const local = loadFromLocal();
    // الحفظ المحلي وتحديث الواجهة فوراً
    const updated = [...local.filter(i => i.ip !== entry.ip), entry];
    saveToLocal(updated);
    setAllData(mergeData([], updated));
    
    toast.info("تم الحفظ في جهازك...");
    // محاولة مزامنة فورية
    await processPendingData();
    fullSync();
  };

  return (
    <div className="bg-[#0b0b0e] text-white min-h-screen" dir="rtl">
      <SearchBar onSearch={() => {}} />
      <DeviceForm onSave={handleSave} />
      <NetworkTree data={allData} />
    </div>
  );
}
