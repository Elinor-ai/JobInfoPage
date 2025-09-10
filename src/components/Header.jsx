// /components/Header.jsx
"use client";

import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Search } from "lucide-react";

/**
 * Props:
 * - jobId?: string               // if provided, searches go to /jobs/[jobId]?q=&l=
 * - initialSearchTerm?: string   // prefill “job title or keyword”
 * - initialLocation?: string     // prefill “location”
 */
export default function Header({
  jobId,
  initialSearchTerm = "",
  initialLocation = "",
}) {
  const router = useRouter();

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchTerm = String(formData.get("q") || "").trim();
    const locationTerm = String(formData.get("l") || "").trim();

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set("q", searchTerm);
    if (locationTerm) queryParams.set("l", locationTerm);

    const queryString = queryParams.toString();
    const urlSuffix = queryString ? `?${queryString}` : "";
    const destinationPath = jobId ? `/jobs/${jobId}` : `/jobs`;

    router.push(`${destinationPath}${urlSuffix}`);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-blue-600">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2" aria-label="JobsBear Home">
          <span className="text-white font-semibold text-lg tracking-tight">JobsBear</span>
        </a>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="ml-auto grid w-full max-w-2xl grid-cols-[1fr_1fr_auto] gap-2"
        >
          {/* Job title / keyword */}
          <label className="relative" aria-label="Job title or keyword">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
            <input
              name="q"
              defaultValue={initialSearchTerm}
              placeholder="Cashier"
              className="w-full rounded-lg bg-white py-2 pl-9 pr-3 text-sm text-gray-800 shadow-sm outline-none ring-1 ring-white/50 focus:ring-2 focus:ring-pink-500/60"
            />
          </label>

          {/* Location */}
          <label className="relative" aria-label="Location">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
            <input
              name="l"
              defaultValue={initialLocation}
              placeholder="Kefar sava"
              className="w-full rounded-lg bg-white py-2 pl-9 pr-3 text-sm text-gray-800 shadow-sm outline-none ring-1 ring-white/50 focus:ring-2 focus:ring-pink-500/60"
            />
          </label>

          {/* Submit button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 sm:px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Search Jobs"
          >
            <Search className="h-4 w-4" />
            <span>Search Jobs</span>
          </button>
        </form>
      </div>
    </header>
  );
}
