import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";

// ✅ استدعاء مكونات البرنامج الأساسية الخاصة بك
import DeviceForm from "../components/DeviceForm";
import NetworkTree from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState([]);

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
      await saveDeviceToUser(user.uid, entry);
      loadDevices(user.uid);
    }
  };

  // 🔒 إذا لم يكن هناك تسجيل دخول، اعرض صفحة الدخول (تختفي تلقائياً عند الدخول)
  if (!user) return <Auth onLoginSuccess={() => {}} />;

  // 🌟 الواجهة الرئيسية للبرنامج بعد تسجيل الدخول
  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      
      {/* شريط التحكم العلوي */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Akram-Network Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">إدارة ومراقبة أجهزة الشبكة</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
          <button 
            onClick={() => auth.signOut()} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm font-bold"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* محتوى الشبكة: الفورم والشجرة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* قسم إضافة وتعديل الأجهزة */}
        <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-gray-200">التحكم في الأجهزة</h2>
          <DeviceForm onSave={handleSave} />
        </div>

        {/* قسم عرض شجرة الشبكة */}
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800 min-h-[500px]">
          <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-gray-200">هيكلة الشبكة (Network Tree)</h2>
          <NetworkTree devices={devices} />
        </div>
        
      </div>
    </div>
  );
}
