'use client';

import { Clock } from 'lucide-react';

function getContractTimeLabelFromJobJson(jobData) {
  const rawContractTime =
    jobData?.contract_time ??
    jobData?.contract_type ??
    jobData?.contractTime ??
    jobData?.employment_time ??
    jobData?.employmentTime ??
    jobData?.job_time ??
    jobData?.jobTime ??
    null;

  if (!rawContractTime) return null;

  const normalized = String(rawContractTime).toLowerCase().replace(/[_-]+/g, ' ');
  if (normalized.includes('full')) return 'Full Time';
  if (normalized.includes('part')) return 'Part Time';
  return normalized.replace(/\b\w/g, char => char.toUpperCase()); // Title Case
}

function getHoursPerWeekFromJobJson(jobData) {
  const hoursValue =
    jobData?.hours_per_week ??
    jobData?.hoursPerWeek ??
    jobData?.job_metadata_v2?.hours_per_week ??
    jobData?.job_metadata_v2?.hoursPerWeek ??
    null;

  return typeof hoursValue === 'number' && hoursValue > 0 ? hoursValue : null;
}

export default function HoursTile({ jobData }) {
  const contractTimeLabel = getContractTimeLabelFromJobJson(jobData);
  const hoursPerWeek = getHoursPerWeekFromJobJson(jobData);

  if (!contractTimeLabel && !hoursPerWeek) return null;

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-yellow-50">
      <Clock className="w-5 h-5 mb-1 text-yellow-600" />
      {contractTimeLabel && (
        <p className="text-sm font-semibold text-yellow-700">{contractTimeLabel}</p>
      )}
      {hoursPerWeek && (
        <p className="text-xs text-yellow-600">{hoursPerWeek} hours/week</p>
      )}
    </div>
  );
}
