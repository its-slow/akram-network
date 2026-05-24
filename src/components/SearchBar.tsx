interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔍 اكتب هنا للبحث السريع عن أي عميل، يوزر، آي بي، سويتش، أو برج..."
        className="w-full bg-[#181820] border border-[#3d3d4e] focus:border-[#38bdf8] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#555566] outline-none transition-colors"
        dir="rtl"
      />
    </div>
  );
}
