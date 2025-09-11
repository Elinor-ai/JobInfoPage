import { MapPin } from "lucide-react";

export default function LocationTile({ location = "" }) {
  const parts = String(location || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) return null;

  const mainLine = parts.length > 1 ? parts.slice(0, -1).join(", ") : parts[0];
  const subLine  = parts.length > 1 ? parts[parts.length - 1] : null;

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50">
      <MapPin className="w-5 h-5 mb-1 text-blue-600" />
      <p className="text-sm font-semibold text-blue-700">{mainLine}</p>
      {subLine && <p className="text-xs text-blue-600">{subLine}</p>}
    </div>
  );
}
