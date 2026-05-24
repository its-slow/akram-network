import { useState, useEffect } from "react";

export function DeviceForm({ onSave, initialData, onCancel }: any) {
  const [formData, setFormData] = useState({ name: "", ip: "", type: "", service: "", connection: "", username: "" });

  // تحديث الحقول تلقائياً عند اختيار جهاز للتعديل
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", ip: "", type: "", service: "", connection: "", username: "" });
    }
  }, [initialData]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <h2 className="text-blue-400 font-bold">{initialData ? "وضع التعديل" : "إضافة جهاز"}</h2>
      
      <input 
        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
        placeholder="الاسم"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <button type="submit" className="w-full bg-green-600 p-2 rounded font-bold hover:bg-green-700">
        {initialData ? "تحديث بيانات الجهاز" : "إضافة الجهاز"}
      </button>

      {initialData && (
        <button type="button" onClick={onCancel} className="w-full bg-red-600 p-2 rounded">
          إلغاء التعديل
        </button>
      )}
    </form>
  );
}
