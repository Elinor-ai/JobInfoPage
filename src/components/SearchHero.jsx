'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Search as SearchIcon } from 'lucide-react';

export default function SearchHero({
  initialKeyword = '',
  initialLocation = 'Remote',
  buttonTitle = 'Search Jobs',
}) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ q: keyword || '', l: location || '' });
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" aria-label="Job search" className="w-full">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Job or keyword</span>
          <Briefcase className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5c6ac4]" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter Job or Keyword"
            className="h-12 w-full rounded-md bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-white/70"
          />
        </label>

        <label className="relative w-full sm:w-[220px]">
          <span className="sr-only">Location</span>
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5c6ac4]" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="h-12 w-full rounded-md bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-white/70"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-[#fe909c] to-[#ff6c98] px-5 text-sm font-semibold text-white shadow-[0_4px_4px_rgba(0,6,57,0.12)] hover:opacity-95 active:opacity-90"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          {buttonTitle}
        </button>
      </div>
    </form>
  );
}
