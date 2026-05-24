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
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadDevices(currentUser.uid);
      else setLoading(false);
    });
  }, []);

  const loadDevices = async (uid: string) => {
    const data = await getUserDevices(uid);
    setDevices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSave = async (entry: any) => {
    if (user) {
      await saveDeviceToUser(user.uid, entry);
      setSelectedItem(null); // مسح التحديد بعد الحفظ
      loadDevices(user.uid);
    }
  };

  if (loading) return <div className="p-10 text-white">جاري التحميل...</div>;
  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* هنا يتم تمرير العنصر المختار كـ initialData */}
          <DeviceForm 
            onSave={handleSave} 
            initialData={selectedItem} 
            onCancel={() => setSelectedItem(null)}
          />
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <NetworkTree 
            data={devices}
            selectedItem={selectedItem}
            onSelect={(item) => setSelectedItem(item)}
            onEdit={(item) => setSelectedItem(item)}
            isFiltered={false}
          />
        </div>
      </div>
    </div>
  );
}
