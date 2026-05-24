import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  DeviceEntry,
  loadFromFirebase,
  loadFromLocal,
  saveToLocal,
  addToLocal,
  deleteFromLocal,
  saveToFirebase,
  deleteFromFirebase,
  updateInFirebase,
  mergeData,
} from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { SearchBar } from "@/components/SearchBar";
import { NetworkTree } from "@/components/NetworkTree";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  // ... (باقي الـ states كما هي)

  const loadData = useCallback(async () => {
    // 1. تحميل المحلي أولاً وبشكل دائم لضمان ظهور البيانات فوراً
    const local = loadFromLocal();
    setAllData(local.map((item, i) => ({ ...item, _id: `l-${i}` })));
    setLoading(false); // إظهار البيانات فوراً دون انتظار الإنترنت

    try {
      const cloud = await loadFromFirebase();
      if (cloud !== null) {
        // 2. الدمج الذكي فقط إذا نجح الاتصال
        const combined = mergeData(cloud, local);
        const tagged = combined.map((item, i) => ({ 
          ...item, 
          _id: item.cloud_id ? `c-${i}-${item.cloud_id}` : `l-${i}` 
        }));
        
        setAllData(tagged);
        saveToLocal(tagged); // تحديث المحلي ببيانات السحابة + الجديدة
      }
    } catch (error) {
      console.error("Cloud sync failed, staying offline", error);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = useCallback(async (entry: DeviceEntry) => {
    // 1. حفظ محلي فوراً
    addToLocal(entry);
    
    // 2. تحديث الواجهة فوراً
    setAllData(prev => [...prev, entry]);

    // 3. محاولة الرفع
    const cloudSaved = await saveToFirebase(entry);
    if (cloudSaved) {
      toast.success("تم الحفظ والمزامنة سحابياً!");
      loadData(); // إعادة تحميل لجلب الـ cloud_id الجديد
    } else {
      toast.warning("تم الحفظ محلياً فقط — سيتم المزامنة لاحقاً.");
    }
  }, [loadData]);

  // ... (باقي الدوال كما هي)
}
