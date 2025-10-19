// app/(components)/JobPageClassic.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Gift, Wallet, CheckCircle2, Clock } from "lucide-react";

export default function JobPageClassic({ job }) {
  console.log('classic')
  const {
    title = "Job Title",
    company = "Company",
    logo,
    location,
    bodyFull = "",
    salary = null,
    url = "#",
    postedAgo,
    isNewThisMonth,
    benefits = [],
    highlights = [],
  } = job || {};
  console.log('job', job)

  const hasSalary = salary != null;

  const [expanded, setExpanded] = useState(false);
  const fullText = String(bodyFull || "").trim();
  const needsToggle = fullText.length > 420;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* LEFT: Main card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 min-w-0">
            <img
              src={logo || "https://placehold.co/56x56/eef2f7/667085?text=Logo"}
              alt={`${company} logo`}
              className="h-14 w-14 rounded-lg object-contain bg-slate-100 p-1"
            />
            <div className="min-w-0">
              <h1 className="
                text-2xl md:text-3xl font-bold leading-tight text-slate-900
                break-words hyphens-auto
              ">
                {title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600 min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4" />
                  <span className="block truncate max-w-[14rem] sm:max-w-[20rem]">{company}</span>
                </span>
                {location ? (
                  <span className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4" />
                    <span className="block truncate max-w-[12rem] sm:max-w-[16rem]">{location}</span>
                  </span>
                ) : null}
                {postedAgo ? (
                  <span className="flex items-center gap-2 min-w-0">
                    <Clock className="h-4 w-4" />
                    <span className="block truncate max-w-[10rem] sm:max-w-[14rem]">{postedAgo}</span>
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

            <div className="relative">
              <p
                className={[
                  "whitespace-pre-line text-slate-700 leading-relaxed transition-all duration-300 ease-in-out",
                  expanded ? "" : "max-h-40 overflow-hidden"
                ].join(" ")}
              >
                {fullText}
              </p>

              {!expanded && needsToggle && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>

            {needsToggle && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Benefits & Perks */}
          {benefits.length > 0 && (
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
          )}
        </section>

        {/* RIGHT: Sidebar cards */}
        <aside className="space-y-4">
          {/* Salary + Apply (only when salary is provided by Job class) */}
          {hasSalary ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">
                  Salary
                </span>
                <Wallet className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-1 text-3xl font-bold text-slate-900">
                {salary}
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
            // Apply-only when salary is missing
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="text-sm text-slate-600">
                Compensation will be discussed during the interview.
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

          {/* Snapshot */}
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

              {/* Highlights (already normalized by Job.getHighlights) */}
              {Array.isArray(highlights) && highlights.length > 0 && (
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
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
