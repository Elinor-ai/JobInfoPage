// app/(components)/JobPageClassicFlexible.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Gift, PoundSterling, CheckCircle2 } from "lucide-react";

const LABELS = {
  isPartTime: "Part-time",
  isHybrid: "Hybrid working",
  isNoExperience: "No experience required",
  isGig: "Gig job",
  isTemp: "Temporary",
  isCustomerService: "Customer service",
  isImmediateStart: "Immediate start!",
  isManagement: "Management",
  isFullyRemote: "Remote",
};

// fallback prettifier for unknown boolean keys
function startCase(key = "") {
  return String(key)
    .replace(/^is/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/^\w/, c => c.toUpperCase());
}

export default function JobPageClassic({ job }) {
  const {
    title = "Job Title",
    company = "Company",
    logo,
    location,
    bodyPoints = [],
    bodyFull = "",
    salary = "",
    salarySuffix = "",
    url = "#",
    isNewThisMonth = false,
    benefits = [],
  } = job || {};

  // Build highlights from ANY is* === true on the summary object
  const highlights = useMemo(() => {
    if (!job || typeof job !== "object") return [];
    return Object.entries(job)
      .filter(([k, v]) => k.startsWith("is") && v === true)
      .map(([k]) => LABELS[k] || startCase(k));
  }, [job]);

  // Salary visibility (treat "cant_determine" as missing)
  const rawSalary = String(salary || "").trim();
  const hasSalary =
    rawSalary.length > 0 && !/^cant[_\s-]*determine$/i.test(rawSalary);
  const salaryDisplay = hasSalary ? `${rawSalary}${salarySuffix || ""}` : "";

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* LEFT: Main card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <img
              src={logo || "https://placehold.co/56x56/eef2f7/667085?text=Logo"}
              alt={`${company} logo`}
              className="h-14 w-14 rounded-lg object-contain bg-slate-100 p-1"
            />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-slate-900">
                {title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{company}</span>
                </span>
                {location ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{location}</span>
                  </span>
                ) : null}
              </div>

              {isNewThisMonth ? (
                <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-medium">
                  New this month
                </div>
              ) : null}
            </div>
          </div>

          {/* Job Description */}
          <div className="my-6 border-t border-slate-200" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Job Description
            </h3>

            {!expanded ? (
              <>
                <ul className="space-y-3">
                  {(bodyPoints || []).map((p, i) => (
                    <li key={`point-${i}`} className="text-slate-700 leading-relaxed">
                      • {p}
                    </li>
                  ))}
                </ul>
                {bodyFull && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Read more
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {bodyFull}
                </p>
                <button
                  onClick={() => setExpanded(false)}
                  className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Show less
                </button>
              </>
            )}
          </div>

          {/* Benefits & Perks */}
          {benefits?.length ? (
            <>
              <div className="my-6 border-t border-slate-200" />
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Benefits &amp; Perks
                </h3>
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <li key={`benefit-${i}`} className="flex items-start gap-3">
                      <Gift className="h-5 w-5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </section>

        {/* RIGHT: Sidebar cards */}
        <aside className="space-y-4">
          {/* Salary + Apply (only if we truly have salary) */}
          {hasSalary ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">
                  Salary
                </span>
                <PoundSterling className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-1 text-3xl font-bold text-slate-900">
                {salaryDisplay}
              </div>
              <Link
                href={url || "#"}
                target={url && url !== "#" ? "_blank" : undefined}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Apply Now
              </Link>
            </div>
          ) : (
            // Apply-only card when salary is missing
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="text-sm text-slate-600">
                Compensation discussed during the interview process.
              </div>
              <Link
                href={url || "#"}
                target={url && url !== "#" ? "_blank" : undefined}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Apply Now
              </Link>
            </div>
          )}

          {/* Job Snapshot */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              Job Snapshot
            </h4>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {location || "—"}
                  </div>
                </div>
              </div>

              {/* Highlights from any is* booleans */}
              {highlights.length ? (
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Highlights
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {highlights.map((label, i) => (
                        <span
                          key={`hl-${i}`}
                          className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 text-xs font-semibold"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
