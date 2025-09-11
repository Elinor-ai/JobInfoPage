// components/vitalsDashboard/HoursTile.jsx
import { Clock } from "lucide-react";

export default function HoursTile({ contractTimeLabel = null, hoursPerWeek = null }) {
  if (!contractTimeLabel && !hoursPerWeek) return null;

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-yellow-50">
      <Clock className="w-5 h-5 mb-1 text-yellow-600" />
      {contractTimeLabel && (
        <p className="text-sm font-semibold text-yellow-700">{contractTimeLabel}</p>
      )}
      {typeof hoursPerWeek === "number" && hoursPerWeek > 0 && (
        <p className="text-xs text-yellow-600">{hoursPerWeek} hours/week</p>
      )}
    </div>
  );
}
