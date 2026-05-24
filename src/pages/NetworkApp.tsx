import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromFirebase, loadFromLocal, saveToLocal, addToLocal, saveToFirebase, mergeData } from "@/lib/firebase";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    // 1. قراءة البيانات المحلية فوراً للعرض
    const local = loadFromLocal();
    setAllData(local.map((item, i) => ({ ...item, _id: `l-${i}` })));

    try {
      // 2. محاولة جلب بيانات السحابة والدمج
      const cloud = await loadFromFirebase();
      if (cloud) {
        const combined = mergeData(cloud, local);
        const tagged = combined.map((item, i) => ({ 
          ...item, 
          _id: item.cloud_id ? `c-${i}-${item.cloud_id}` : `l-${i}` 
        }));
        setAllData(tagged);
        saveToLocal(tagged);
      }
    } catch (e) {
      console.error("تعذر الاتصال بالسحابة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = useCallback(async (entry: DeviceEntry) => {
    // 1. الحفظ المحلي فوراً
    addToLocal(entry);
    setAllData(prev => [...prev, entry]);
    
    // 2. الرفع للسحابة
    const success = await saveToFirebase(entry);
    if (success) {
      toast.success("تم الحفظ والمزامنة");
      loadData();
    } else {
      toast.warning("تم الحفظ محلياً فقط");
    }
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">
      {/* ضع هنا كود العرض الخاص بك (SearchBar, NetworkTree, إلخ) */}
      {loading && <div>جاري التحميل...</div>}
    </div>
  );
}
