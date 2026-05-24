import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DeviceEntry, loadFromFirebase, loadFromLocal, saveToLocal, saveToFirebase, updateInFirebase, deleteFromFirebase } from "@/lib/firebase";
import { DeviceForm } from "@/components/DeviceForm";
import { SearchBar } from "@/components/SearchBar";
import { NetworkTree } from "@/components/NetworkTree";

export default function NetworkApp() {
  const [allData, setAllData] = useState<DeviceEntry[]>([]);
  const [editingDevice, setEditingDevice] = useState<DeviceEntry | null>(null);

  const loadData = useCallback(async () => {
    const local = loadFromLocal();
    setAllData(local);
    const cloud = await loadFromFirebase();
    if (cloud) {
      setAllData(cloud);
      saveToLocal(cloud);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (entry: DeviceEntry) => {
    if (editingDevice && editingDevice.cloud_id) {
      const success = await updateInFirebase(editingDevice.cloud_id, entry);
      if (success) toast.success("تم التعديل");
    } else {
      const newId = await saveToFirebase(entry);
      if (newId) toast.success("تم الحفظ");
    }
    setEditingDevice(null);
    loadData();
  };

  const handleDelete = async (device: DeviceEntry) => {
    if (device.cloud_id) {
      const success = await deleteFromFirebase(device.cloud_id);
      if (success) {
        toast.error("تم الحذف");
        loadData();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white" dir="rtl">
      <SearchBar onSearch={(t) => console.log(t)} />
      <DeviceForm onSave={handleSave} initialData={editingDevice || undefined} />
      <NetworkTree 
        data={allData} 
        onEdit={(d) => setEditingDevice(d)} 
        onDelete={handleDelete} 
      />
    </div>
  );
}
