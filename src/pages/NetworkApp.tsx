import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";

// تأكد من استدعاء المكونات صح
import { DeviceForm } from "../components/DeviceForm";
import { NetworkTree } from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  // ✅ أضفت State عشان يتوافق مع البروبس اللي في صورة image_13b126.png
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
      loadDevices(user.uid);
    }
  };

  if (loading) return <div className="p-10 text-white">جاري التحميل...</div>;
  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="flex justify-between mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-xl font-bold text-blue-500">Akram-Network</h1>
        <button onClick={() => auth.signOut()} className="bg-red-600 px-3 py-1 rounded text-sm">خروج</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <DeviceForm onSave={handleSave} />
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* ✅ التعديل الجوهري: مطابقة البروبس مع image_13b126.png */}
          <NetworkTree 
            data={devices}
            selectedItem={selectedItem}
            onSelect={(item) => setSelectedItem(item)}
            onEdit={(item) => console.log("تعديل:", item)}
            isFiltered={false}
          />
        </div>
      </div>
    </div>
  );
}
