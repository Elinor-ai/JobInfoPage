// components/vitalsDashboard/SalaryTile.jsx
import { BadgeDollarSign } from "lucide-react";

export default function SalaryTile({ salary = "" }) {
  if (!salary) return null;

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50">
      <p className="text-xl font-bold text-green-700">{salary}</p>
    </div>
  );
}
