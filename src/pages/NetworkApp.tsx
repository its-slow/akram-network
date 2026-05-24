import { useState, useEffect } from "react";
import { auth, getUserDevices, saveDeviceToUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";

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

  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="bg-[#0b0b0e] text-white p-4">
      <button onClick={() => auth.signOut()} className="text-red-500">تسجيل الخروج</button>
      {/* هنا ضع الـ DeviceForm و الـ NetworkTree الخاصة بك */}
      <h1>مرحباً بك في شبكتك الخاصة</h1>
    </div>
  );
}
