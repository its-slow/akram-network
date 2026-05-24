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
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadDevices(currentUser.uid);
    });
  }, []);

  // كود ملء البيانات أوتوماتيك داخل الخانات عند اختيار عميل
  useEffect(() => {
    if (selectedItem && formContainerRef.current) {
      setTimeout(() => {
        const inputs = formContainerRef.current?.querySelectorAll('input');
        inputs?.forEach((input) => {
          if (input.placeholder === "اسم المشترك بالكامل...") input.value = selectedItem.name || "";
          if (input.placeholder === "رقم موبايل العميل...") input.value = selectedItem.phone || "";
          if (input.placeholder === "عنوان IP جهاز التحت...") input.value = selectedItem.ip || "";
          if (input.placeholder === "مثال: NanoStation / Router...") input.value = selectedItem.type || "";
          if (input.placeholder === "اسم مستخدم الباند...") input.value = selectedItem.username || "";
          if (input.placeholder === "باسورد الباند...") input.value = selectedItem.password || "";
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
      // سحب القيم الجديدة من الخانات عند الحفظ
      const inputs = formContainerRef.current?.querySelectorAll('input');
      const updatedEntry = {
        ...entry,
        name: inputs?.[0]?.value || entry.name,
        phone: inputs?.[1]?.value || entry.phone,
        ip: inputs?.[2]?.value || entry.ip,
        type: inputs?.[3]?.value || entry.type,
        username: inputs?.[4]?.value || entry.username,
        password: inputs?.[5]?.value || entry.password,
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
        {/* الفورم */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800" ref={formContainerRef}>
          <DeviceForm 
            key={selectedItem ? selectedItem.cloud_id : "new"} 
            onSave={handleSave} 
          />
          
          {selectedItem && (
            <div className="mt-6 p-4 border-t border-gray-700 space-y-2">
              <p className="text-yellow-500 font-bold mb-2">تعديل بيانات: {selectedItem.name}</p>
              <button onClick={() => setSelectedItem(null)} className="w-full bg-gray-600 p-2 rounded">إلغاء التعديل</button>
              <button onClick={handleDelete} className="w-full bg-red-600 p-2 rounded">مسح الجهاز نهائياً</button>
            </div>
          )}
        </div>

        {/* الشجرة والبحث */}
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h2 className="text-blue-400 font-bold mb-4">قائمة المشتركين</h2>
          <NetworkTree 
            data={devices} 
            onSelect={(item) => setSelectedItem(item)} 
          />
        </div>
      </div>
    </div>
  );
}
