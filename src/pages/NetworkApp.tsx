import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser, deleteDeviceFromUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";
import { DeviceForm } from "../components/DeviceForm";
import { NetworkTree } from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadDevices(currentUser.uid);
    });
  }, []);

  const loadDevices = async (uid: string) => {
    const data = await getUserDevices(uid);
    setDevices(data);
  };

  const handleSave = async (entry: any) => {
    if (user) {
      // ندمج الـ cloud_id في البيانات ليتم التعديل بدلاً من الإضافة
      const dataToSave = selectedItem ? { ...entry, cloud_id: selectedItem.cloud_id } : entry;
      await saveDeviceToUser(user.uid, dataToSave);
      setSelectedItem(null);
      loadDevices(user.uid);
    }
  };

  const handleDelete = async () => {
    if (user && selectedItem && confirm("هل أنت متأكد من مسح الجهاز؟")) {
      await deleteDeviceFromUser(user.uid, selectedItem.cloud_id); // مسح باستخدام الـ ID
      setSelectedItem(null);
      loadDevices(user.uid);
    }
  };

  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* 
            استخدام الـ key هنا هو "الخدعة" التي ستجبر الفورم على التحديث 
            بدون تعديل كود الـ DeviceForm نفسه
          */}
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
          />
          
          {selectedItem && (
            <div className="mt-4 space-y-2">
              <button 
                onClick={() => setSelectedItem(null)} 
                className="w-full bg-gray-600 p-2 rounded"
              >
                إلغاء التحديد
              </button>
              <button 
                onClick={handleDelete} 
                className="w-full bg-red-600 p-2 rounded"
              >
                مسح الجهاز المختار
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <NetworkTree 
            data={devices} 
            onSelect={(item) => setSelectedItem(item)} 
          />
        </div>
      </div>
    </div>
  );
}
