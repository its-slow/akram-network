import { useState, useEffect, useRef } from "react";
import { auth, getUserDevices, saveDeviceToUser, deleteDeviceFromUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";
import { DeviceForm } from "../components/DeviceForm";
import { NetworkTree } from "../components/NetworkTree";

export default function NetworkApp() {
  const [user, setUser] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // الخدعة: بنستخدم ref عشان نتحكم في الـ DOM بتاع الفورم مباشرة
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadDevices(currentUser.uid);
    });
  }, []);

  // لما تختار جهاز، نستنى الفورم يترسم، وبعدين نملاه بالبيانات
  useEffect(() => {
    if (selectedItem && formContainerRef.current) {
      setTimeout(() => {
        const inputs = formContainerRef.current?.querySelectorAll('input');
        inputs?.forEach((input) => {
          // بنخمن الحقل بناءً على الـ placeholder الموجود في الـ DeviceForm بتاعك
          if (input.placeholder.includes("الاسم")) input.value = selectedItem.name || "";
          if (input.placeholder.includes("آي بي")) input.value = selectedItem.ip || "";
          if (input.placeholder.includes("نوع")) input.value = selectedItem.type || "";
          if (input.placeholder.includes("سيرفس")) input.value = selectedItem.service || "";
        });
      }, 100);
    }
  }, [selectedItem]);

  const loadDevices = async (uid: string) => {
    const data = await getUserDevices(uid);
    setDevices(data);
  };

  const handleSave = async (entry: any) => {
    if (user) {
      // هنا بنسحب البيانات من الخانات بعد ما عدلتها عشان نضمن إن التعديل وصل
      const inputs = formContainerRef.current?.querySelectorAll('input');
      const updatedEntry = {
        ...entry,
        name: inputs?.[0]?.value || entry.name,
        ip: inputs?.[1]?.value || entry.ip,
        type: inputs?.[2]?.value || entry.type,
        cloud_id: selectedItem ? selectedItem.cloud_id : null
      };

      await saveDeviceToUser(user.uid, updatedEntry);
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

  if (!user) return <Auth onLoginSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800" ref={formContainerRef}>
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
          />
          
          {selectedItem && (
            <div className="mt-6 p-4 border-t border-gray-700 space-y-2">
              <p className="text-yellow-500 font-bold mb-2">جاري تعديل: {selectedItem.name}</p>
              <button onClick={() => setSelectedItem(null)} className="w-full bg-gray-600 p-2 rounded">إلغاء التعديل</button>
              <button onClick={handleDelete} className="w-full bg-red-600 p-2 rounded">مسح الجهاز نهائياً</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <NetworkTree data={devices} onSelect={(item) => setSelectedItem(item)} />
        </div>
      </div>
    </div>
  );
}
