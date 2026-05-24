import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";
import { DeviceForm } from "../components/DeviceForm";
import { NetworkTree } from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null); // هذا المسؤول عن بيانات التعديل

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadDevices(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadDevices = async (uid: string) => {
    try {
      const data = await getUserDevices(uid);
      setDevices(Array.isArray(data) ? data : []);
    } catch (e) {
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (entry: any) => {
    if (user) {
      await saveDeviceToUser(user.uid, entry);
      setSelectedItem(null); // مسح التحديد بعد الحفظ
      loadDevices(user.uid);
    }
  };

  if (loading) return <div className="p-10 text-white">جاري تحميل السيستم...</div>;
  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="flex justify-between mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-xl font-bold text-blue-500">Akram-Network</h1>
        <button onClick={() => auth.signOut()} className="bg-red-600 px-3 py-1 rounded text-sm">خروج</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* هنا مررنا الـ selectedItem للـ DeviceForm عشان يعرف إنه في وضع تعديل */}
          <DeviceForm 
            onSave={handleSave} 
            initialData={selectedItem} 
          />
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <NetworkTree 
            data={devices}
            selectedItem={selectedItem}
            onSelect={(item) => setSelectedItem(item)}
            onEdit={(item) => setSelectedItem(item)} // عند الضغط على تعديل، يتم تعيين العنصر كـ selectedItem
            isFiltered={false}
          />
        </div>
      </div>
    </div>
  );
}
