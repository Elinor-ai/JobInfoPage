// app/components/vitals/LocationTile.jsx
'use client';

import { MapPin } from 'lucide-react';

export default function LocationTile({ jobData }) {
  const cityName = jobData?.city || jobData?.location?.city || null;
  const stateOrRegion = jobData?.state || jobData?.location?.state || jobData?.region || null;
  const countryName = jobData?.country || jobData?.location?.country || null;

  if (!cityName && !stateOrRegion && !countryName) return null;

  const mainLine = [cityName, stateOrRegion].filter(Boolean).join(', ') || countryName;
  const subLine = !cityName && !stateOrRegion ? null : (countryName || null);

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50">
      <MapPin className="w-5 h-5 mb-1 text-blue-600" />
      <p className="text-sm font-semibold text-blue-700">{mainLine}</p>
      {subLine && <p className="text-xs text-blue-600">{subLine}</p>}
    </div>
  );
}
