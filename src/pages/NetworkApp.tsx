import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  DeviceEntry, 
  loadFromFirebase, 
  loadFromLocal, 
  saveToLocal, 
  addToLocal, 
  saveToFirebase, 
  mergeData 
} from "@/lib/firebase";

// استيراد المكونات التي كانت في تطبيقك
import { DeviceForm } from "@/components/DeviceForm";
import { SearchBar } from "@/components/SearchBar";
import { NetworkTree } from "@/components/NetworkTree";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const local = loadFromLocal();
    // عرض المحلي فوراً لتجنب الشاشة السوداء
    setAllData(local.map((item, i) => ({ ...item, _id: `l-${i}` })));

    try {
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
      console.error("فشل الاتصال بالسحابة، نعمل محلياً");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = useCallback(async (entry: DeviceEntry) => {
    addToLocal(entry);
    setAllData(prev => [...prev, entry]);
    
    const success = await saveToFirebase(entry);
    if (success) {
      toast.success("تم الحفظ والمزامنة بنجاح");
      loadData();
    } else {
      toast.warning("تم الحفظ محلياً فقط");
    }
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">
      <div className="p-4 space-y-6">
        <SearchBar onSearch={(text) => console.log(text)} />
        <DeviceForm onSave={handleSave} />
        {loading ? (
          <div className="text-center p-4">جاري التحميل...</div>
        ) : (
          <NetworkTree data={allData} />
        )}
      </div>
    </div>
  );
}
