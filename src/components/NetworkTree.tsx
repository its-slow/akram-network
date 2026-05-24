import { useState } from "react";
import { DeviceEntry } from "@/lib/firebase";
import { ChevronDown, ChevronLeft, Pencil, ExternalLink } from "lucide-react";

interface NetworkTreeProps {
  data: DeviceEntry[];
  selectedItem: DeviceEntry | null;
  onSelect: (item: DeviceEntry) => void;
  onEdit: (item: DeviceEntry) => void;
  isFiltered: boolean;
}

interface SectionProps {
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
  forceOpen?: boolean;
}

function Section({ title, color, count, children, forceOpen }: SectionProps) {
  const [open, setOpen] = useState(forceOpen ?? false);

  return (
    <div className="rounded-xl overflow-hidden border border-[#2d2d3a]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#121218] hover:bg-[#181820] transition-colors text-right"
      >
        <span className="font-bold text-sm" style={{ color }}>
          {title} ({count})
        </span>
        {open ? (
          <ChevronDown size={16} style={{ color }} />
        ) : (
          <ChevronLeft size={16} style={{ color }} />
        )}
      </button>
      {open && (
        <div className="bg-[#0e0e14] px-2 py-2 space-y-1">{children}</div>
      )}
    </div>
  );
}

interface SubSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  forceOpen?: boolean;
}

function SubSection({ title, color, children, forceOpen }: SubSectionProps) {
  const [open, setOpen] = useState(forceOpen ?? false);

  return (
    <div className="rounded-lg overflow-hidden border border-[#1e1e28]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#141420] hover:bg-[#1a1a28] transition-colors text-right"
      >
        <span className="font-bold text-xs" style={{ color }}>
          {title}
        </span>
        {open ? (
          <ChevronDown size={14} style={{ color }} />
        ) : (
          <ChevronLeft size={14} style={{ color }} />
        )}
      </button>
      {open && <div className="bg-[#0e0e14] px-2 py-1 space-y-1">{children}</div>}
    </div>
  );
}

function IpLink({ ip }: { ip: string }) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealed(true);
    window.open(`http://${ip}`, "_blank", "noopener,noreferrer");
  };

  if (revealed) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1 text-[#38bdf8] hover:text-[#7dd3fc] font-mono text-[11px] transition-colors"
        title={`فتح http://${ip}`}
      >
        {ip}
        <ExternalLink size={10} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 bg-[#0c1f2e] hover:bg-[#0f2d42] border border-[#1e4a66] text-[#38bdf8] hover:text-[#7dd3fc] text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
      title={`فتح http://${ip}`}
    >
      <ExternalLink size={9} />
      <span>فتح IP</span>
    </button>
  );
}

interface DeviceTileProps {
  item: DeviceEntry;
  selected: boolean;
  onSelect: (item: DeviceEntry) => void;
  onEdit: (item: DeviceEntry) => void;
}

function DeviceTile({ item, selected, onSelect, onEdit }: DeviceTileProps) {
  const phoneStr = item.phone ? `  📞 ${item.phone}` : "";

  let title = "";
  let detailParts: (string | { type: "ip"; ip: string })[] = [];

  if (item.position === "تحت") {
    const connStr =
      item.conn_type?.includes("سلك") && item.switch_name
        ? `  🔌 واصل من: ${item.switch_name}`
        : item.conn_type
        ? `  ${item.conn_type}`
        : "";
    title = `🔽 ${item.name || ""}${phoneStr}`;
    detailParts = ["IP: ", { type: "ip", ip: item.ip }, `  |  ${item.device || ""}${connStr}`];
    if (item.pppoe_user) {
      detailParts.push(`  |  يوزر: ${item.pppoe_user}  باسورد: ${item.pppoe_pass}`);
    }
  } else {
    const linkStr = item.link_type ? `  ⚡ ${item.link_type}` : "";
    title = `🔼 [${item.mode || ""}]  IP: `;
    detailParts = [`النوع: ${item.device || ""}${linkStr}`];
    if (item.connected_to) detailParts.push(`  🔗 لاقط من: ${item.connected_to}`);
    if (item.wifi_name) detailParts.push(`  📡 ${item.wifi_name}  🔑 ${item.wifi_pass || ""}`);
    if (item.above_pppoe_user)
      detailParts.push(`  يوزر الباند: ${item.above_pppoe_user}  باسورد: ${item.above_pppoe_pass}`);
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`w-full text-right px-3 py-2.5 rounded-lg transition-colors border cursor-pointer group relative ${
        selected
          ? "bg-[#0284c7] border-[#0ea5e9] text-white"
          : "bg-[#1c1c24] border-transparent hover:bg-[#272735] text-white"
      }`}
    >
      {/* Edit button — top-left corner (RTL: visually top-right in LTR, but start-side in RTL) */}
      <button
        onClick={handleEdit}
        className={`absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
          selected
            ? "bg-[#0369a1] hover:bg-[#0284c7] text-white"
            : "bg-[#2d2d3a] hover:bg-[#3d3d4e] text-[#38bdf8]"
        }`}
        title="تعديل الجهاز"
      >
        <Pencil size={12} />
      </button>

      {/* Title row */}
      {item.position === "فوق" ? (
        <div className="font-bold text-xs leading-relaxed flex items-center gap-1 flex-wrap">
          <span>{title}</span>
          <IpLink ip={item.ip} />
          <span>{item.phone ? `  📞 ${item.phone}` : ""}</span>
        </div>
      ) : (
        <div className="font-bold text-xs leading-relaxed">{title}</div>
      )}

      {/* Detail row */}
      <div className="text-[11px] text-[#aaaacc] leading-relaxed mt-0.5 flex items-center gap-1 flex-wrap">
        {item.position === "تحت" ? (
          <>
            <span>IP: </span>
            <IpLink ip={item.ip} />
            {detailParts.slice(2).map((part, i) =>
              typeof part === "string" ? <span key={i}>{part}</span> : null
            )}
          </>
        ) : (
          detailParts.map((part, i) =>
            typeof part === "string" ? <span key={i}>{part}</span> : null
          )
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-[#555566] text-xs px-4 py-3">لا توجد بيانات في هذا القسم</div>
  );
}

export function NetworkTree({ data, selectedItem, onSelect, onEdit, isFiltered }: NetworkTreeProps) {
  const broadband: DeviceEntry[] = [];
  const hotspot: DeviceEntry[] = [];
  const apByRegion: Record<string, DeviceEntry[]> = {};
  const stationByRegion: Record<string, DeviceEntry[]> = {};

  for (const item of data) {
    if (item.position === "تحت") {
      if (item.service?.includes("برود باند")) broadband.push(item);
      else hotspot.push(item);
    } else if (item.position === "فوق") {
      const reg = item.region || "غير محدد";
      if (item.mode?.includes("ارسال")) {
        apByRegion[reg] = apByRegion[reg] || [];
        apByRegion[reg].push(item);
      } else {
        stationByRegion[reg] = stationByRegion[reg] || [];
        stationByRegion[reg].push(item);
      }
    }
  }

  const apCount = Object.values(apByRegion).reduce((s, a) => s + a.length, 0);
  const stationCount = Object.values(stationByRegion).reduce((s, a) => s + a.length, 0);

  if (data.length === 0) {
    return (
      <div className="text-center text-[#555566] py-8 text-sm">
        لا توجد بيانات. قم بإضافة أجهزة أولاً.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Section
        title="🌐 قسم عملاء البرود باند"
        color="#38bdf8"
        count={broadband.length}
        forceOpen={isFiltered && broadband.length > 0}
      >
        {broadband.length === 0 ? (
          <EmptyState />
        ) : (
          broadband.map((item, i) => (
            <DeviceTile
              key={item._id || i}
              item={item}
              selected={selectedItem?._id === item._id}
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))
        )}
      </Section>

      <Section
        title="📡 قسم عملاء الهوتسبوت"
        color="#a855f7"
        count={hotspot.length}
        forceOpen={isFiltered && hotspot.length > 0}
      >
        {hotspot.length === 0 ? (
          <EmptyState />
        ) : (
          hotspot.map((item, i) => (
            <DeviceTile
              key={item._id || i}
              item={item}
              selected={selectedItem?._id === item._id}
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))
        )}
      </Section>

      <Section
        title="📡 أجهزة الإرسال والبث (Access Point)"
        color="#22c55e"
        count={apCount}
        forceOpen={isFiltered && apCount > 0}
      >
        {apCount === 0 ? (
          <EmptyState />
        ) : (
          Object.entries(apByRegion).map(([reg, items]) => (
            <SubSection
              key={reg}
              title={`🗼 برج إرسال: ${reg}`}
              color="#eab308"
              forceOpen={isFiltered}
            >
              {items.map((item, i) => (
                <DeviceTile
                  key={item._id || i}
                  item={item}
                  selected={selectedItem?._id === item._id}
                  onSelect={onSelect}
                  onEdit={onEdit}
                />
              ))}
            </SubSection>
          ))
        )}
      </Section>

      <Section
        title="🔗 أجهزة الاستقبال والربط (Station)"
        color="#f43f5e"
        count={stationCount}
        forceOpen={isFiltered && stationCount > 0}
      >
        {stationCount === 0 ? (
          <EmptyState />
        ) : (
          Object.entries(stationByRegion).map(([reg, items]) => (
            <SubSection
              key={reg}
              title={`🗼 برج استقبال: ${reg}`}
              color="#eab308"
              forceOpen={isFiltered}
            >
              {items.map((item, i) => (
                <DeviceTile
                  key={item._id || i}
                  item={item}
                  selected={selectedItem?._id === item._id}
                  onSelect={onSelect}
                  onEdit={onEdit}
                />
              ))}
            </SubSection>
          ))
        )}
      </Section>
    </div>
  );
}
