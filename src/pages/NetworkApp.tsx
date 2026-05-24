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

      if (cloud !== null) {

        const tagged = cloud.map((item, i) => ({ ...item, _id: `c-${i}-${item.cloud_id}` }));

        setAllData(tagged);

        saveToLocal(tagged);

      } else {

        const local = loadFromLocal();

        setAllData(local.map((item, i) => ({ ...item, _id: `l-${i}` })));

      }

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => { loadData(); }, [loadData]);



  useEffect(() => {

    if (!searchText.trim()) {

      setFilteredData(allData);

      return;

    }

    const q = searchText.toLowerCase();

    setFilteredData(

      allData.filter(

        (item) =>

          item.phone?.includes(q) ||

          item.name?.toLowerCase().includes(q) ||

          item.ip?.includes(q) ||

          item.region?.toLowerCase().includes(q) ||

          item.pppoe_user?.toLowerCase().includes(q) ||

          item.above_pppoe_user?.toLowerCase().includes(q) ||

          item.switch_name?.toLowerCase().includes(q) ||

          item.link_type?.toLowerCase().includes(q) ||

          item.connected_to?.toLowerCase().includes(q) ||

          item.wifi_name?.toLowerCase().includes(q)

      )

    );

  }, [searchText, allData]);



  const handleSave = useCallback(async (entry: DeviceEntry) => {

    addToLocal(entry);

    const cloudSaved = await saveToFirebase(entry);

    await loadData();

    if (cloudSaved) {

      toast.success("تم حفظ الجهاز ومزامنته سحابياً بنجاح!");

    } else {

      toast.warning("تم الحفظ محلياً فقط — لا يوجد اتصال سحابي.");

    }

  }, [loadData]);



  const handleEdit = useCallback((device: DeviceEntry) => {

    setEditingDevice(device);

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  }, []);



  const handleUpdate = useCallback(async (updatedEntry: DeviceEntry) => {

    const cloudId = updatedEntry.cloud_id;

    deleteFromLocal(

      editingDevice?.ip ?? updatedEntry.ip,

      editingDevice?.name ?? updatedEntry.name

    );

    addToLocal(updatedEntry);



    let cloudSaved = false;

    if (cloudId) {

      cloudSaved = await updateInFirebase(cloudId, updatedEntry);

    } else {

      cloudSaved = await saveToFirebase(updatedEntry);

    }



    setEditingDevice(null);

    await loadData();



    if (cloudSaved) {

      toast.success("تم تحديث بيانات الجهاز ومزامنتها سحابياً!");

    } else {

      toast.warning("تم التحديث محلياً فقط — لا يوجد اتصال سحابي.");

    }

  }, [editingDevice, loadData]);



  const handleCancelEdit = useCallback(() => {

    setEditingDevice(null);

  }, []);



  const handleDelete = useCallback(async () => {

    if (!selectedItem) {

      toast.error("اختر جهازاً من القائمة أولاً.");

      return;

    }

    deleteFromLocal(selectedItem.ip, selectedItem.name);

    if (selectedItem.cloud_id) {

      await deleteFromFirebase(selectedItem.cloud_id);

    }

    setSelectedItem(null);

    if (editingDevice?._id === selectedItem._id) setEditingDevice(null);

    await loadData();

    toast.success("تم حذف الجهاز بنجاح.");

  }, [selectedItem, editingDevice, loadData]);



  return (

    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        <div className="flex items-center justify-center">

          <h1 className="text-lg md:text-2xl font-black text-white tracking-wide">

            ⚡ نظام البشمهندس أكرم جميل لإدارة الشبكة السحابية الذكي ⚡

          </h1>

        </div>



        <div ref={formRef} className={`border rounded-2xl p-5 transition-colors ${editingDevice ? "bg-[#0c1f14] border-[#166534]" : "bg-[#121218] border-[#2d2d3a]"}`}>

          <DeviceForm

            key={editingDevice?._id ?? "new"}

            onSave={handleSave}

            onUpdate={handleUpdate}

            onCancelEdit={handleCancelEdit}

            initialData={editingDevice}

          />

        </div>



        <SearchBar value={searchText} onChange={setSearchText} />



        <div className="bg-[#121218] border border-[#2d2d3a] rounded-2xl p-5">

          <h2 className="text-[#38bdf8] font-bold text-base mb-4">أقسام الشبكة الرئيسية</h2>

          {loading ? (

            <div className="text-center text-[#555566] py-10 text-sm">جاري تحميل البيانات...</div>

          ) : (

            <NetworkTree

              data={filteredData}

              selectedItem={selectedItem}

              onSelect={setSelectedItem}

              onEdit={handleEdit}

              isFiltered={!!searchText.trim()}

            />

          )}

        </div>



        <div className="flex justify-start">

          <button

            onClick={handleDelete}

            className="bg-[#dc2626] hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"

          >

            🗑️ إزالة الجهاز المحدّد

          </button>

          {selectedItem && (

            <span className="mr-3 self-center text-[#aaaacc] text-sm">

              محدد: {selectedItem.name || selectedItem.ip}

            </span>

          )}

        </div>

      </div>

    </div>

  );

  }
