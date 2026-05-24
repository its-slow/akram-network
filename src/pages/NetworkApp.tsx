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
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSave = async (formData: any) => {
    if (user) {
      // دمج بيانات الفورم مع الـ ID في حالة التعديل
      const dataToSave = selectedItem 
        ? { ...formData, cloud_id: selectedItem.cloud_id } 
        : formData;

      await saveDeviceToUser(user.uid, dataToSave);
      setSelectedItem(null); // العودة لوضع الإضافة بعد الحفظ
      loadDevices(user.uid);
    }
  };

  const handleDelete = async () => {
    if (user && selectedItem && confirm("هل أنت متأكد من مسح الجهاز نهائياً؟")) {
      await deleteDeviceFromUser(user.uid, selectedItem.cloud_id);
      setSelectedItem(null);
      loadDevices(user.uid);
    }
  };

  const filteredDevices = devices.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip?.includes(searchTerm)
  );

  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الفورم */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* 
            ملاحظة: تأكد أن DeviceForm يقوم بتمرير البيانات لدالة onSave 
            ويستقبل initialData لإظهار البيانات في الخانات
          */}
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
            onCancel={() => setSelectedItem(null)} 
            initialData={selectedItem} 
          />
          
          {selectedItem && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button 
                onClick={handleDelete} 
                className="w-full bg-red-600 p-2 rounded hover:bg-red-700"
              >
                مسح الجهاز نهائياً
              </button>
            </div>
          )}
        </div>

        {/* الشجرة والبحث */}
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h2 className="text-blue-400 font-bold mb-4">قائمة المشتركين</h2>
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو الـ IP..." 
            className="w-full p-2 mb-4 bg-gray-800 rounded border border-gray-700 text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <NetworkTree 
            data={filteredDevices} 
            onSelect={(item) => setSelectedItem(item)} 
          />
        </div>
      </div>
    </div>
  );
}
