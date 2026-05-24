import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";

// تأكد إنك مستخدم الأقواس {} لأن المكونات عندك تصديرها من النوع Named Export
import { DeviceForm } from "../components/DeviceForm";
import { NetworkTree } from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]); // حماية: بدأنا بمصفوفة فاضية دائماً
  const [loading, setLoading] = useState(true);

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
      // حماية: نتأكد إن الـ data اللي جاية مصفوفة، لو مش مصفوفة (مثلاً null) خليها مصفوفة فاضية
      setDevices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading devices:", e);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0b0b0e] text-white">جاري التحميل...</div>;
  }

  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Akram-Network</h1>
        </div>
        <button 
          onClick={() => auth.signOut()} 
          className="bg-red-600 px-4 py-2 rounded text-sm font-bold"
        >
          خروج
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <DeviceForm onSave={handleSave} />
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* هنا بنبعت الـ devices المتأكدين إنها مصفوفة */}
          <NetworkTree devices={devices} />
        </div>
      </div>
    </div>
  );
}
