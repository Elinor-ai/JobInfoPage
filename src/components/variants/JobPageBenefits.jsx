// app/(components)/JobPageBenefits.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  PoundSterling,
  Timer,
} from "lucide-react";

export default function JobPageBenefits({ job }) {
  const {
    title = "Job Title",
    company = "Company",
    logo = "",
    location = "",
    url = "#",
    postedAgo = "",
    salary = "",
    salarySuffix = "",
    jobType = "—",
    benefits = [],
    descriptionHtml,
    bodyFull = "",
    bodyPoints = [],
    highlights = [],
  } = job || {};

  const [expanded, setExpanded] = useState(false);

  // 3-line preview for description (unchanged)
  const preview = useMemo(() => {
    if (Array.isArray(bodyPoints) && bodyPoints.length) {
      return bodyPoints.slice(0, 3);
    }
    const flat = String(bodyFull || "").replace(/\s+/g, " ").trim();
    if (!flat) return [];
    return flat
      .split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [bodyPoints, bodyFull]);

  // benefits split into two columns (unchanged)
  const [leftCol, rightCol] = useMemo(() => {
    const a = Array.isArray(benefits) ? benefits : [];
    const mid = Math.ceil(a.length / 2);
    return [a.slice(0, mid), a.slice(mid)];
  }, [benefits]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Top highlight chips (unchanged) */}
      {Array.isArray(highlights) && highlights.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {highlights.map((h, i) => (
            <span
              key={`hl-${i}`}
              className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Header card — UPDATED for mobile-friendly title/postedAgo alignment */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4 min-w-0">
            {/* Logo (fixed width, won’t collapse) */}
            <div className="shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="h-16 w-16 rounded-xl object-contain bg-slate-50 border border-slate-200 p-2"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-2xl font-bold">
                  {(company || "J").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            {/* Text column (can shrink; text wraps safely) */}
            <div className="min-w-0 flex-1">
              {/* Title row with postedAgo on the right */}
              <div className="flex items-start justify-between gap-2">
                <h1
                  className="
                    min-w-0
                    font-bold text-slate-900 leading-snug
                    break-words hyphens-auto
                    text-[clamp(1.1rem,0.9rem+1.6vw,1.9rem)]
                    md:text-[clamp(1.25rem,1rem+1.5vw,2rem)]
                  "
                >
                  {title}
                </h1>

                {!!postedAgo && (
                  <span className="whitespace-nowrap inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Posted {postedAgo}
                  </span>
                )}
              </div>

              {/* Company / Location line */}
              <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600">
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{company}</span>
                </span>

                {location && (
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{location}</span>
                  </span>
                )}
              </div>

              {/* CTA buttons (unchanged) */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={url || "#"}
                  target={url && url !== "#" ? "_blank" : undefined}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  Apply Now
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
                >
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200" />
      </section>

      {/* Perks & Benefits (unchanged) */}
      {Array.isArray(benefits) && benefits.length > 0 && (
        <section className="mt-4 bg-indigo-50 rounded-2xl border border-indigo-100 p-5 md:p-6">
          <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Perks &amp; Benefits
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <ul className="space-y-3">
              {leftCol.map((b, i) => (
                <li key={`b-l-${i}`} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-indigo-600" />
                  <span className="text-slate-800">{b}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {rightCol.map((b, i) => (
                <li key={`b-r-${i}`} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-indigo-600" />
                  <span className="text-slate-800">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Full Job Description (unchanged) */}
      <section className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <h3 className="text-slate-900 font-semibold mb-3">Full Job Description</h3>

        {!expanded ? (
          <>
            <ul className="space-y-2 text-slate-800">
              {(preview.length ? preview : [bodyFull || "No description provided."]).map(
                (pt, i) => (
                  <li key={`pt-${i}`} className="leading-relaxed">
                    {pt}
                  </li>
                )
              )}
            </ul>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Read More
            </button>
          </>
        ) : (
          <>
            <div
              className="prose max-w-none text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  descriptionHtml ||
                  `<p>${String(bodyFull || "No description provided.")}</p>`,
              }}
            />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Show Less
            </button>
          </>
        )}
      </section>

      {/* Key Details (unchanged) */}
      {(salary || jobType) && (
        <section className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h3 className="text-slate-900 font-semibold mb-4">Key Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {salary && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 p-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PoundSterling className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Salary
                  </div>
                  <div className="font-semibold text-slate-900">
                    {salary}
                    {salarySuffix || ""}
                  </div>
                </div>
              </div>
            )}

            {jobType && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 p-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Timer className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Job Type
                  </div>
                  <div className="font-semibold text-slate-900">{jobType}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
