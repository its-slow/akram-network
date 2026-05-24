import { useState, useEffect, useCallback, useRef } from "react";

import { toast } from "sonner";

import {

  DeviceEntry,

  loadFromFirebase,

  loadFromLocal,

  saveToLocal,

  addToLocal,

  deleteFromLocal,

  saveToFirebase,

  deleteFromFirebase,

  updateInFirebase,

  mergeData, // تم استيراد دالة الدمج الجديدة

} from "@/lib/firebase";

import { DeviceForm } from "@/components/DeviceForm";

import { SearchBar } from "@/components/SearchBar";

import { NetworkTree } from "@/components/NetworkTree";



export default function NetworkApp() {

  const [allData, setAllData] = useState<DeviceEntry[]>([]);

  const [filteredData, setFilteredData] = useState<DeviceEntry[]>([]);

  const [searchText, setSearchText] = useState("");

  const [selectedItem, setSelectedItem] = useState<DeviceEntry | null>(null);

  const [editingDevice, setEditingDevice] = useState<DeviceEntry | null>(null);

  const [loading, setLoading] = useState(true);

  const formRef = useRef<HTMLDivElement>(null);



  const loadData = useCallback(async () => {

    setLoading(true);

    try {

      const cloud = await loadFromFirebase();

      const local = loadFromLocal();



      if (cloud !== null) {

        // نستخدم دالة الدمج الجديدة بدلاً من المسح والتحميل

        const combined = mergeData(cloud, local);

        const tagged = combined.map((item, i) => ({ 

          ...item, 

          _id: item.cloud_id ? `c-${i}-${item.cloud_id}` : `l-${i}` 

        }));

        

        setAllData(tagged);

        saveToLocal(tagged); // تحديث النسخة المحلية بالبيانات المدمجة

      } else {

        // في حال عدم وجود اتصال بالسحابة، نعتمد على المحلي

        setAllData(local.map((item, i) => ({ ...item, _id: `l-${i}` })));

      }

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => { loadData(); }, [loadData]);



  // ... (بقية الدالة useEffect الخاصة بالبحث و handleSave و handleUpdate كما هي في كودك)



  // تأكد من دالة handleSave تقوم بـ loadData بعد الحفظ للتحديث

  const handleSave = useCallback(async (entry: DeviceEntry) => {

    addToLocal(entry);

    const cloudSaved = await saveToFirebase(entry);

    await loadData(); // سيقوم الآن بالدمج والحفظ الصحيح

    if (cloudSaved) {

      toast.success("تم حفظ الجهاز ومزامنته سحابياً بنجاح!");

    } else {

      toast.warning("تم الحفظ محلياً فقط — سيتم المزامنة عند توفر الإنترنت.");

    }

  }, [loadData]);



  // ... (باقي الدوال handleDelete و handleUpdate و return كما هي)



  return (

    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">

        {/* الكود الخاص بالعرض كما هو في ملفك الأصلي */}

    </div>

  );

} 

