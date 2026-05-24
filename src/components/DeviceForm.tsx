import { useState, useEffect } from "react";

import { DeviceEntry } from "@/lib/firebase";



interface DeviceFormProps {

  onSave: (entry: DeviceEntry) => void;

  onUpdate?: (entry: DeviceEntry) => void;

  onCancelEdit?: () => void;

  initialData?: DeviceEntry | null;

}



const inputCls =

  "bg-[#181820] border border-[#3d3d4e] focus:border-[#38bdf8] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-[#555566] outline-none transition-colors w-full";

const selectCls =

  "bg-[#181820] border border-[#3d3d4e] focus:border-[#38bdf8] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors w-full";

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



  // Below fields

  const [clientName, setClientName] = useState("");

  const [clientPhone, setClientPhone] = useState("");

  const [clientIp, setClientIp] = useState("");

  const [clientDevice, setClientDevice] = useState("");

  const [serviceType, setServiceType] = useState("برود باند (Broadband)");

  const [connType, setConnType] = useState("📡 هوائي (Wireless)");

  const [pppoeUser, setPppoeUser] = useState("");

  const [pppoePass, setPppoePass] = useState("");

  const [switchName, setSwitchName] = useState("");



  // Above fields

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



  // التعديل هنا: تصفير الحقول لو مفيش initialData

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

      setClientName(initialData.name ?? "");

      setClientPhone(initialData.phone ?? "");

      setClientIp(initialData.ip ?? "");

      setClientDevice(initialData.device ?? "");

      setServiceType(initialData.service ?? "برود باند (Broadband)");

      setConnType(initialData.conn_type ?? "📡 هوائي (Wireless)");

      setPppoeUser(initialData.pppoe_user ?? "");

      setPppoePass(initialData.pppoe_pass ?? "");

      setSwitchName(initialData.switch_name ?? "");

    } else {

      setRegion(initialData.region ?? "");

      setAboveIp(initialData.ip ?? "");

      setAboveDevice(initialData.device ?? "");

      setWorkMode(initialData.mode ?? "استقبال (Station)");

      setLinkType(initialData.link_type ?? "📡 واي فاي / مايكرويف");

      setAbovePhone(initialData.phone ?? "");

      setConnectedTo(initialData.connected_to ?? "");

      setWifiName(initialData.wifi_name ?? "");

      setWifiPass(initialData.wifi_pass ?? "");

      setAbovePppoeUser(initialData.above_pppoe_user ?? "");

      setAbovePppoePass(initialData.above_pppoe_pass ?? "");

    }

  }, [initialData]);



  const isBroadband = serviceType.includes("برود باند");

  const isSwitch = connType.includes("سلك");

  const isStation = workMode.includes("Station") && !workMode.includes("Broadband");

  const isAP = workMode.includes("Access Point");

  const isBBStation = workMode.includes("Broadband Station");



  const buildEntry = (): DeviceEntry | null => {

    if (position === "تحت") {

      if (!clientName.trim() || !clientIp.trim()) {

        alert("برجاء ملء خانة الاسم والآي بي.");

        return null;

      }

      const entry: DeviceEntry = {

        position: "تحت",

        region: "أجهزة المشتركين (تحت)",

        name: clientName.trim(),

        phone: clientPhone.trim(),

        ip: clientIp.trim(),

        device: clientDevice.trim(),

        service: serviceType,

        conn_type: connType,

      };

      if (isBroadband) {

        entry.pppoe_user = pppoeUser.trim();

        entry.pppoe_pass = pppoePass.trim();

      }

      if (isSwitch) {

        entry.switch_name = switchName.trim();

      }

      return entry;

    } else {

      if (!region.trim() || !aboveIp.trim()) {

        alert("برجاء ملء اسم البرج والآي بي.");

        return null;

      }

      const entry: DeviceEntry = {

        position: "فوق",

        region: region.trim(),

        device: aboveDevice.trim(),

        ip: aboveIp.trim(),

        mode: workMode,

        link_type: linkType,

      };

      if (isAP) {

        entry.wifi_name = wifiName.trim();

        entry.wifi_pass = wifiPass.trim();

      } else if (isStation || isBBStation) {

        entry.phone = abovePhone.trim();

        entry.connected_to = connectedTo.trim();

        if (isBBStation) {

          entry.above_pppoe_user = abovePppoeUser.trim();

          entry.above_pppoe_pass = abovePppoePass.trim();

        }

      }

      return entry;

    }

  };



  const clearBelow = () => {

    setClientName(""); setClientPhone(""); setClientIp(""); setClientDevice("");

    setPppoeUser(""); setPppoePass(""); setSwitchName("");

  };

  const clearAbove = () => {

    setRegion(""); setAboveIp(""); setAboveDevice("");

    setAbovePhone(""); setConnectedTo("");

    setWifiName(""); setWifiPass("");

    setAbovePppoeUser(""); setAbovePppoePass("");

  };



  const handleSave = () => {

    const entry = buildEntry();

    if (!entry) return;

    if (position === "تحت") clearBelow(); else clearAbove();

    onSave(entry);

  };



  const handleUpdate = () => {

    const entry = buildEntry();

    if (!entry) return;

if (initialData) {
      const entryWithIds = {
        ...entry,
        _id: initialData._id,
        cloud_id: initialData.cloud_id
      };
      onUpdate?.(entryWithIds);
    } else {
      onUpdate?.(entry);
    }

  };



  return (

    <div className="space-y-4">

      {isEditing && (

        <div className="flex items-center justify-between bg-[#0c2a1a] border border-[#166534] rounded-xl px-4 py-2.5">

          <span className="text-[#4ade80] font-bold text-sm">✏️ وضع التعديل — يمكنك تعديل بيانات الجهاز المحدد</span>

          <button

            onClick={onCancelEdit}

            className="text-[#f87171] hover:text-white text-xs font-bold px-3 py-1 rounded-lg border border-[#7f1d1d] hover:bg-[#7f1d1d] transition-colors"

          >

            ✕ إلغاء

          </button>

        </div>

      )}



      <div className="flex flex-wrap gap-3 items-center">

        <label className={labelCls}>تحديد مستوى الجهاز في الشبكة:</label>

        <select

          value={position}

          onChange={(e) => setPosition(e.target.value as "تحت" | "فوق")}

          className={selectCls + " max-w-xs"}

          disabled={isEditing}

        >

          <option value="تحت">جهاز تحت (المشتركين والخدمة)</option>

          <option value="فوق">جهاز فوق (الربط والبروج)</option>

        </select>

      </div>



      <div className="h-px bg-[#2d2d3a]" />



      {position === "تحت" ? (

        <div className="space-y-3">

          <div className="flex flex-wrap gap-3">

            <Field label="👤 الاسم:">

              <input className={inputCls} placeholder="اسم المشترك بالكامل..." value={clientName} onChange={e => setClientName(e.target.value)} />

            </Field>

            <Field label="📞 الهاتف:">

              <input className={inputCls} placeholder="رقم موبايل العميل..." value={clientPhone} onChange={e => setClientPhone(e.target.value)} />

            </Field>

          </div>

          <div className="flex flex-wrap gap-3">

            <Field label="🌐 آي بي التحت:">

              <input className={inputCls} placeholder="عنوان IP جهاز التحت..." value={clientIp} onChange={e => setClientIp(e.target.value)} />

            </Field>

            <Field label="🛠️ نوع الجهاز:">

              <input className={inputCls} placeholder="مثال: NanoStation / Router..." value={clientDevice} onChange={e => setClientDevice(e.target.value)} />

            </Field>

          </div>

          <div className="flex flex-wrap gap-3">

            <Field label="📡 نظام الخدمة:">

              <select className={selectCls} value={serviceType} onChange={e => setServiceType(e.target.value)}>

                <option>برود باند (Broadband)</option>

                <option>هوتسبوت (Hotspot)</option>

              </select>

            </Field>

            <Field label="🔌 طريقة التوصيل:">

              <select className={selectCls} value={connType} onChange={e => setConnType(e.target.value)}>

                <option>📡 هوائي (Wireless)</option>

                <option>🔌 سلك من السويتش</option>

              </select>

            </Field>

          </div>

          {isBroadband && (

            <div className="flex flex-wrap gap-3">

              <Field label="🆔 مستخدم الباند:">

                <input className={inputCls} placeholder="اسم مستخدم الباند..." value={pppoeUser} onChange={e => setPppoeUser(e.target.value)} />

              </Field>

              <Field label="🔑 باسورد الباند:">

                <input className={inputCls} placeholder="باسورد الباند..." value={pppoePass} onChange={e => setPppoePass(e.target.value)} />

              </Field>

            </div>

          )}

          {isSwitch && (

            <div className="flex flex-wrap gap-3">

              <Field label="🔌 اسم/رقم السويتش:">

                <input className={inputCls} placeholder="مثال: سويتش برج 1 / سويتش الشارع..." value={switchName} onChange={e => setSwitchName(e.target.value)} />

              </Field>

            </div>

          )}

        </div>

      ) : (

        <div className="space-y-3">

          <div className="flex flex-wrap gap-3">

            <Field label="📍 اسم البرج:">

              <input className={inputCls} placeholder="اسم البرج الرئيسي..." value={region} onChange={e => setRegion(e.target.value)} />

            </Field>

            <Field label="🌐 آي بي الفوق:">

              <input className={inputCls} placeholder="عنوان IP جهاز الفوق..." value={aboveIp} onChange={e => setAboveIp(e.target.value)} />

            </Field>

          </div>

          <div className="flex flex-wrap gap-3">

            <Field label="🛠️ نوع الجهاز:">

              <input className={inputCls} placeholder="نوع جهاز الفوق..." value={aboveDevice} onChange={e => setAboveDevice(e.target.value)} />

            </Field>

            <Field label="⚙️ وضع العمل:">

              <select className={selectCls} value={workMode} onChange={e => setWorkMode(e.target.value)}>

                <option>استقبال (Station)</option>

                <option>ارسال (Access Point)</option>

                <option>استقبال برود باند (Broadband Station)</option>

              </select>

            </Field>

            <Field label="⚡ نوع الربط:">

              <select className={selectCls} value={linkType} onChange={e => setLinkType(e.target.value)}>

                <option>📡 واي فاي / مايكرويف</option>

                <option>🔌 سلك (LAN)</option>

                <option>💎 أوبتكال / فايبر</option>

              </select>

            </Field>

          </div>

          {(isStation || isBBStation) && (

            <div className="flex flex-wrap gap-3">

              <Field label="📞 هاتف العميل:">

                <input className={inputCls} placeholder="رقم موبايل العميل الفوق..." value={abovePhone} onChange={e => setAbovePhone(e.target.value)} />

              </Field>

              <Field label="🔗 لاقط من جهاز/برج:">

                <input className={inputCls} placeholder="اسم جهاز الإرسال..." value={connectedTo} onChange={e => setConnectedTo(e.target.value)} />

              </Field>

            </div>

          )}

          {isAP && (

            <div className="flex flex-wrap gap-3">

              <Field label="📡 اسم الشبكة:">

                <input className={inputCls} placeholder="اسم الشبكة (SSID)..." value={wifiName} onChange={e => setWifiName(e.target.value)} />

              </Field>

              <Field label="🔑 باسورد البث:">

                <input className={inputCls} placeholder="باسورد البث..." value={wifiPass} onChange={e => setWifiPass(e.target.value)} />

              </Field>

            </div>

          )}

          {isBBStation && (

            <div className="flex flex-wrap gap-3">

              <Field label="🆔 يوزر الباند:">

                <input className={inputCls} placeholder="يوزر الباند..." value={abovePppoeUser} onChange={e => setAbovePppoeUser(e.target.value)} />

              </Field>

              <Field label="🔑 باسورد الباند:">

                <input className={inputCls} placeholder="باسورد الباند..." value={abovePppoePass} onChange={e => setAbovePppoePass(e.target.value)} />

              </Field>

            </div>

          )}

        </div>

      )}



      {isEditing ? (

        <div className="flex gap-3 mt-2">

          <button

            onClick={handleUpdate}

            className="flex-1 bg-[#166534] hover:bg-[#15803d] text-white font-bold py-3.5 rounded-xl text-base transition-colors"

          >

            ✏️ تحديث بيانات الجهاز

          </button>

          <button

            onClick={onCancelEdit}

            className="px-6 bg-[#1c1c24] hover:bg-[#272735] text-[#aaaacc] font-bold py-3.5 rounded-xl text-base transition-colors border border-[#2d2d3a]"

          >

            إلغاء

          </button>

        </div>

      ) : (

        <button

          onClick={handleSave}

          className="w-full bg-[#0284c7] hover:bg-[#0ea5e9] text-white font-bold py-3.5 rounded-xl text-base transition-colors mt-2"

        >

          ☁️ حفظ ومزامنة البيانات فوراً

        </button>

      )}

    </div>

  );

} 

