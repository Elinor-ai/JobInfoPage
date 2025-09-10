'use client';
import { normalizeSalary } from '@/public/utils/salaryUtils';

export default function SalaryTile({ jobData }) {
  const normalizedSalary = normalizeSalary(jobData);
  if (!normalizedSalary?.displayAmount) return null;

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50">
      <p className="text-xl font-bold text-green-700">{normalizedSalary.displayAmount}</p>
      {normalizedSalary.periodLabel && (
        <p className="text-xs text-green-600">{normalizedSalary.periodLabel}</p>
      )}
    </div>
  );
}
