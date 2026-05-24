import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromLocal, syncData } from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { SearchBar } from "@/components/SearchBar";
import { NetworkTree } from "@/components/NetworkTree";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const startSync = useCallback(async () => {
    setLoading(true);
    try {
      // هذه الدالة الآن تقوم بالرفع والتطابق تلقائياً
      const syncedData = await syncData();
      setAllData(syncedData);
    } catch (e) {
      // في حال فشل الاتصال، نظهر البيانات المحلية كما هي
      setAllData(loadFromLocal());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // تشغيل المزامنة عند فتح الموقع أو استعادة الاتصال
    startSync();
    window.addEventListener('online', startSync);
    return () => window.removeEventListener('online', startSync);
  }, [startSync]);

  const handleSave = async (entry: DeviceEntry) => {
    const local = loadFromLocal();
    const updated = [...local, entry];
    saveToLocal(updated);
    setAllData(updated);
    toast.success("تم الحفظ محلياً، سيتم المزامنة عند الاتصال");
    startSync(); // محاولة مزامنة فورية
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">
      <SearchBar onSearch={(t) => console.log(t)} />
      <DeviceForm onSave={handleSave} />
      {loading ? <div className="p-4 text-center">جاري المزامنة...</div> : <NetworkTree data={allData} />}
    </div>
  );
}
