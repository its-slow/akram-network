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
      // دمج الـ cloud_id في البيانات ليتم التحديث في Firebase
      const dataToSave = selectedItem 
        ? { ...entry, cloud_id: selectedItem.cloud_id } 
        : entry;
        
      await saveDeviceToUser(user.uid, dataToSave);
      setSelectedItem(null); // إعادة تعيين التحديد بعد الحفظ
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
            استخدام الـ key و الـ props يجبر الفورم على تحديث نفسه عند اختيار جهاز 
            دون الحاجة لتعديل كود الـ DeviceForm
          */}
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
            {...(selectedItem || {})} 
          />
          
          {selectedItem && (
            <div className="mt-6 p-4 border-t border-gray-700 space-y-2">
              <p className="text-yellow-500 font-bold mb-2">جاري التعديل على: {selectedItem.name}</p>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="w-full bg-gray-600 p-2 rounded hover:bg-gray-500 transition-all"
              >
                إلغاء التعديل
              </button>
              <button 
                onClick={handleDelete} 
                className="w-full bg-red-600 p-2 rounded hover:bg-red-700 transition-all"
              >
                مسح الجهاز نهائياً
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
