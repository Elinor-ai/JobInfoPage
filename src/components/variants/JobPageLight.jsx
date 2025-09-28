// app/(components)/JobPageClassic.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  PoundSterling,
  BriefcaseBusiness,
  Home,
  Gift,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function JobPageLight({ job }) {
  console.log('light')
  const {
    title = "Job Title",
    company = "Company",
    logo,
    location,
    bodyPoints,           
    bodyFull = "",        
    salary = "",
    salarySuffix = "",    
    url = "#",
    isNewThisMonth = false,
    flags = [],           
    benefits = [],       
  } = job || {};

  const [expanded, setExpanded] = useState(false);

  // First 3 “points”: use provided bodyPoints if present, else sentence split
  const firstThree = useMemo(() => {
    if (Array.isArray(bodyPoints) && bodyPoints.length) {
      return bodyPoints.slice(0, 3);
    }
    const flat = String(bodyFull || "").replace(/\s+/g, " ").trim();
    if (!flat) return [];
    return flat
      .split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [bodyPoints, bodyFull]);

  // Work style derived from flags array (e.g., contains “Hybrid”)
  const workStyle = useMemo(() => {
    const hasHybrid = (flags || []).some(s => /hybrid/i.test(String(s)));
    return hasHybrid ? "Hybrid" : "—";
  }, [flags]);

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      {/* HEADER CARD */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
        <div className="flex items-start gap-4">
          <img
            src={logo || "https://placehold.co/64x64/e2e8f0/475569?text=Logo"}
            alt={`${company} logo`}
            className="h-14 w-14 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1"
          />
        <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="truncate">{company}</span>
              </span>
              {location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{location}</span>
                </span>
              ) : null}
            </div>
            {isNewThisMonth && (
              <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-medium">
                New this month
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col gap-2">
            <Link
              href={url || "#"}
              target={url && url !== "#" ? "_blank" : undefined}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition"
            >
              Apply Now
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Save Job
            </button>
          </div>
        </div>

        {/* STAT BAR */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3">
          {/* Salary */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <PoundSterling className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Salary
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {salary || "—"}
              </div>
            </div>
          </div>

          {/* Job Type (your summary doesn’t include it → show em dash) */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <BriefcaseBusiness className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Job Type
              </div>
              <div className="text-sm font-semibold text-slate-800">—</div>
            </div>
          </div>

          {/* Work Style from flags */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <Home className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Work Style
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {workStyle}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / DESCRIPTION */}
      <div className="h-6" />
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
        <h3 className="text-slate-800 font-semibold flex items-center gap-2 mb-3">
          <Tag className="h-5 w-5 text-indigo-600" />
          About This Job
        </h3>

        {!expanded ? (
          <>
            <ul className="space-y-2 text-slate-800">
              {(firstThree.length ? firstThree : [bodyFull || ""]).map((p, i) => (
                <li key={`pt-${i}`} className="leading-relaxed">
                  • {p || "—"}
                </li>
              ))}
            </ul>
            {bodyFull && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-3 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Read More <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
              {bodyFull}
            </p>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-3 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Show Less <ChevronUp className="h-4 w-4" />
            </button>
          </>
        )}
      </section>

      {/* BENEFITS */}
      {benefits?.length ? (
        <>
          <div className="h-6" />
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <h3 className="text-slate-800 font-semibold flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-indigo-600" />
              Benefits &amp; Perks
            </h3>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b, i) => (
                <span
                  key={`benefit-${i}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {/* MOBILE CTA */}
      <div className="sm:hidden h-6" />
      <div className="sm:hidden">
        <Link
          href={url || "#"}
          target={url && url !== "#" ? "_blank" : undefined}
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-4 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Apply Now
        </Link>
      </div>
    </main>
  );
}
