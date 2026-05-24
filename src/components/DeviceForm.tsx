import { useState, useEffect } from "react";
import { DeviceEntry } from "@/lib/firebase";

interface DeviceFormProps {
  onSave: (entry: DeviceEntry) => void;
  onUpdate?: (entry: DeviceEntry) => void;
  onCancelEdit?: () => void;
  initialData?: DeviceEntry | null;
}

const inputCls = "bg-[#181820] border border-[#3d3d4e] focus:border-[#38bdf8] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-[#555566] outline-none transition-colors w-full";
const selectCls = "bg-[#181820] border border-[#3d3d4e] focus:border-[#38bdf8] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors w-full";
const labelCls = "text-[#38bdf8] font-bold text-sm whitespace-nowrap";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export function DeviceForm({ onSave, onUpdate, onCancelEdit, initialData }: DeviceFormProps) {
  const isEditing = !!initialData;
  const [position, setPosition] = useState<"تحت" | "فوق">("تحت");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientIp, setClientIp] = useState("");
  const [clientDevice, setClientDevice] = useState("");
  const [serviceType, setServiceType] = useState("برود باند (Broadband)");
  const [connType, setConnType] = useState("📡 هوائي (Wireless)");
  const [pppoeUser, setPppoeUser] = useState("");
  const [pppoePass, setPppoePass] = useState("");
  const [switchName, setSwitchName] = useState("");

  const [region, setRegion] = useState("");
  const [aboveIp, setAboveIp] = useState("");
  const [aboveDevice, setAboveDevice] = useState("");
  const [workMode, setWorkMode] = useState("استقبال (Station)");
  const [linkType, setLinkType] = useState("📡 واي فاي / مايكرويف");
  const [abovePhone, setAbovePhone] = useState("");
  const [connectedTo, setConnectedTo] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [abovePppoeUser, setAbovePppoeUser] = useState("");
  const [abovePppoePass, setAbovePppoePass] = useState("");

  useEffect(() => {
    if (!initialData) {
      setPosition("تحت");
      setClientName(""); setClientPhone(""); setClientIp(""); setClientDevice("");
      setServiceType("برود باند (Broadband)"); setConnType("📡 هوائي (Wireless)");
      setPppoeUser(""); setPppoePass(""); setSwitchName("");
      setRegion(""); setAboveIp(""); setAboveDevice("");
      setWorkMode("استقبال (Station)"); setLinkType("📡 واي فاي / مايكرويف");
      setAbovePhone(""); setConnectedTo(""); setWifiName(""); setWifiPass("");
      setAbovePppoeUser(""); setAbovePppoePass("");
      return;
    }
    
    setPosition(initialData.position ?? "تحت");
    if (initialData.position === "تحت") {
      setClientName(initialData.name ?? ""); setClientPhone(initialData.phone ?? "");
      setClientIp(initialData.ip ?? ""); setClientDevice(initialData.device ?? "");
      setServiceType(initialData.service ?? "برود باند (Broadband)");
      setConnType(initialData.conn_type ?? "📡 هوائي (Wireless)");
      setPppoeUser(initialData.pppoe_user ?? ""); setPppoePass(initialData.pppoe_pass ?? "");
      setSwitchName(initialData.switch_name ?? "");
    } else {
      setRegion(initialData.region ?? ""); setAboveIp(initialData.ip ?? "");
      setAboveDevice(initialData.device ?? ""); setWorkMode(initialData.mode ?? "استقبال (Station)");
      setLinkType(initialData.link_type ?? "📡 واي فاي / مايكرويف");
      setAbovePhone(initialData.phone ?? ""); setConnectedTo(initialData.connected_to ?? "");
      setWifiName(initialData.wifi_name ?? ""); setWifiPass(initialData.wifi_pass ?? "");
      setAbovePppoeUser(initialData.above_pppoe_user ?? ""); setAbovePppoePass(initialData.above_pppoe_pass ?? "");
    }
  }, [initialData]);

  const isBroadband = serviceType.includes("برود باند");
  const isSwitch = connType.includes("سلك");
  const isStation = workMode.includes("Station") && !workMode.includes("Broadband");
  const isAP = workMode.includes("Access Point");
  const isBBStation = workMode.includes("Broadband Station");

  const buildEntry = (): DeviceEntry | null => {
    let entry: any;
    if (position === "تحت") {
      if (!clientName.trim() || !clientIp.trim()) { alert("برجاء ملء خانة الاسم والآي بي."); return null; }
      entry = { position: "تحت", region: "أجهزة المشتركين (تحت)", name: clientName.trim(), phone: clientPhone.trim(), ip: clientIp.trim(), device: clientDevice.trim(), service: serviceType, conn_type: connType };
      if (isBroadband) { entry.pppoe_user = pppoeUser.trim(); entry.pppoe_pass = pppoePass.trim(); }
      if (isSwitch) { entry.switch_name = switchName.trim(); }
    } else {
      if (!region.trim() || !aboveIp.trim()) { alert("برجاء ملء اسم البرج والآي بي."); return null; }
      entry = { position: "فوق", region: region.trim(), device: aboveDevice.trim(), ip: aboveIp.trim(), mode: workMode, link_type: linkType };
      if (isAP) { entry.wifi_name = wifiName.trim(); entry.wifi_pass = wifiPass.trim(); }
      else if (isStation || isBBStation) { entry.phone = abovePhone.trim(); entry.connected_to = connectedTo.trim(); if (isBBStation) { entry.above_pppoe_user = abovePppoeUser.trim(); entry.above_pppoe_pass = abovePppoePass.trim(); } }
    }
    
    // إضافة الـ ID إذا كنا في وضع التعديل
    if (initialData?.cloud_id) entry.cloud_id = initialData.cloud_id;
    if (initialData?._id) entry._id = initialData._id;
    
    return entry as DeviceEntry;
  };

  const handleUpdate = () => {
    const entry = buildEntry();
    if (entry && onUpdate) onUpdate(entry);
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex items-center justify-between bg-[#0c2a1a] border border-[#166534] rounded-xl px-4 py-2.5">
          <span className="text-[#4ade80] font-bold text-sm">✏️ وضع التعديل</span>
          <button onClick={onCancelEdit} className="text-[#f87171] text-xs font-bold px-3 py-1 rounded-lg border border-[#7f1d1d]">✕ إلغاء</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <label className={labelCls}>تحديد مستوى الجهاز:</label>
        <select value={position} onChange={(e) => setPosition(e.target.value as any)} className={selectCls} disabled={isEditing}>
          <option value="تحت">تحت (مشترك)</option>
          <option value="فوق">فوق (برج)</option>
        </select>
      </div>

      <div className="h-px bg-[#2d2d3a]" />

      {position === "تحت" ? (
        <div className="space-y-3">
          <Field label="👤 الاسم:"><input className={inputCls} value={clientName} onChange={e => setClientName(e.target.value)} /></Field>
          <Field label="🌐 IP:"><input className={inputCls} value={clientIp} onChange={e => setClientIp(e.target.value)} /></Field>
          {/* ... باقي الحقول ... */}
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="📍 البرج:"><input className={inputCls} value={region} onChange={e => setRegion(e.target.value)} /></Field>
          <Field label="🌐 IP:"><input className={inputCls} value={aboveIp} onChange={e => setAboveIp(e.target.value)} /></Field>
        </div>
      )}

      {isEditing ? (
        <button onClick={handleUpdate} className="w-full bg-[#166534] text-white font-bold py-3.5 rounded-xl">✏️ تحديث البيانات</button>
      ) : (
        <button onClick={() => onSave(buildEntry()!)} className="w-full bg-[#0284c7] text-white font-bold py-3.5 rounded-xl">☁️ حفظ البيانات</button>
      )}
    </div>
  );
}
