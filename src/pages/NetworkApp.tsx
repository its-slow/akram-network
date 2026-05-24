import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromFirebase, loadFromLocal, saveToLocal, saveToFirebase, mergeData } from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { SearchBar } from "@/components/SearchBar";
import { NetworkTree } from "@/components/NetworkTree";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const local = loadFromLocal();
    // 1. عرض البيانات المحلية فوراً
    setAllData(local);

    try {
      // 2. محاولة دمج بيانات السحابة
      const cloud = await loadFromFirebase();
      const combined = mergeData(cloud, local);
      setAllData(combined);
      saveToLocal(combined);
    } catch (e) {
      console.log("تعذر الاتصال، نستخدم المخزن المحلي");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (entry: DeviceEntry) => {
    // 1. حفظ محلي فوراً
    const local = loadFromLocal();
    const updated = [...local, entry];
    saveToLocal(updated);
    setAllData(updated);
    toast.success("تم الحفظ في جهازك");

    // 2. محاولة رفع للسحابة في الخلفية
    const newId = await saveToFirebase(entry);
    if (newId) {
      toast.success("تمت المزامنة للسحابة");
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">
      <SearchBar onSearch={(t) => console.log(t)} />
      <DeviceForm onSave={handleSave} />
      {loading ? (
        <div className="p-4 text-center">جاري التحميل...</div>
      ) : (
        <NetworkTree data={allData} />
      )}
    </div>
  );
}
