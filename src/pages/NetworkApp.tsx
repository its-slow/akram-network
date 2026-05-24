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

  // دالة الحفظ المباشرة (هتاخد الـ entry زي ما هو من الـ Form)
  const handleSave = async (entry: any) => {
    if (user) {
      // لو فيه selectedItem، بنضيف الـ cloud_id عشان الـ Firebase يعرف إنه تعديل
      const dataToSave = selectedItem 
        ? { ...entry, cloud_id: selectedItem.cloud_id } 
        : entry;

      await saveDeviceToUser(user.uid, dataToSave);
      setSelectedItem(null);
      loadDevices(user.uid);
    }
  };

  const handleDelete = async () => {
    if (user && selectedItem && confirm("هل أنت متأكد من مسح الجهاز؟")) {
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
          {/* بنبعت البيانات المختارة للـ DeviceForm كـ props */}
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
            initialData={selectedItem} 
          />
          
          {selectedItem && (
            <div className="mt-6 p-4 border-t border-gray-700 space-y-2">
              <p className="text-yellow-500 font-bold">تعديل: {selectedItem.name}</p>
              <button onClick={() => setSelectedItem(null)} className="w-full bg-gray-600 p-2 rounded">إلغاء</button>
              <button onClick={handleDelete} className="w-full bg-red-600 p-2 rounded">مسح</button>
            </div>
          )}
        </div>

        {/* البحث والشجرة */}
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
