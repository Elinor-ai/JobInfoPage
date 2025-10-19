"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Wallet, CalendarDays, Timer, Home, Sparkles, FileText, CheckCircle2, } from "lucide-react";

export default function JobPagePanel({ job }) {
  console.log("panel");
  const {
    title = "Job Title",
    company = "",
    logo = "",
    location = "",
    url = "#",
    salary = null,
    workStyle = "",
    isEntryLevel = false,
    workEnvironment = [],
    jobType = "",
    bodyFull = "",
    postedAgo = "",
    highlights = [],
    benefits = [],
    isImmediateStart = false,
    
  } = job || {};

  const previewSentences = useMemo(() => {
    const flat = String(bodyFull || "").replace(/\s+/g, " ").trim();
    if (!flat) return [];
    return flat
      .split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [bodyFull]);

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Immediate start banner */}
      {isImmediateStart && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Immediate Hiring: This employer is looking to fill this role quickly.
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        {/* LEFT: Company / Snapshot */}
        <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            {logo && (
              <img
                src={logo}
                alt={company ? `${company} logo` : "Company logo"}
                className="h-20 w-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-2"
              />
            )}

            <h1 className="mt-4 text-xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>

            {company && (
              <div className="mt-1 text-slate-600 text-sm">{company}</div>
            )}

            <Link
              href={url || "#"}
              target={url && url !== "#" ? "_blank" : undefined}
              className="btn-pulse mt-4 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Easy Apply
            </Link>

            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-slate-700 hover:bg-slate-50"
            >
              Save Job
            </button>
          </div>

          <div className="my-5 h-px bg-slate-200" />

          {/* Snapshot list */}
          <ul className="space-y-4 text-sm">
            {location && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </div>
                  <div className="font-semibold text-slate-800">{location}</div>
                </div>
              </li>
            )}

            {/* Salary — hidden entirely when not present */}
            {salary && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Salary
                  </div>
                  <div className="font-semibold text-slate-800">{salary}</div>
                </div>
              </li>
            )}

            {/* NEW: Entry Level row (only when true) */}
            {isEntryLevel && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Level
                  </div>
                  <div className="font-semibold text-slate-800">Entry level</div>
                </div>
              </li>
            )}

            {postedAgo && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Posted
                  </div>
                  <div className="font-semibold text-slate-800">{postedAgo}</div>
                </div>
              </li>
            )}

            {jobType && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Timer className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Job Type
                  </div>
                  <div className="font-semibold text-slate-800">{jobType}</div>
                </div>
              </li>
            )}

            {workStyle && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Home className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Work Style
                  </div>
                  <div className="font-semibold text-slate-800">{workStyle}</div>
                </div>
              </li>
            )}

            {workEnvironment && (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Home className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Work Environment
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {workEnvironment.map((env, i) => (
                      <span
                        key={`env-${i}`}
                        className="font-semibold text-slate-800"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            )}
          </ul>

          {/* Optional highlight badges */}
          {Array.isArray(highlights) && highlights.length > 0 && (
            <>
              <div className="my-5 h-px bg-slate-200" />
              <div className="flex flex-wrap gap-2">
                {highlights.slice(0, 6).map((h, i) => (
                  <span
                    key={`hl-${i}`}
                    className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 text-xs font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* RIGHT: Benefits + Description + CTA */}
        <section className="space-y-6">
          {Array.isArray(benefits) && benefits.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Benefits &amp; Perks
              </h3>
              <div className="flex flex-wrap gap-2">
                {benefits.map((b, i) => (
                  <span
                    key={`benefit-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-indigo-600" />
              Full Job Description
            </h3>

            {!expanded ? (
              <>
                <ul className="space-y-2 text-slate-800">
                  {(previewSentences.length ? previewSentences : [bodyFull]).map((pt, i) => (
                    <li key={`pt-${i}`} className="leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="my-4 h-px bg-slate-200" />
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Read More
                </button>
              </>
            ) : (
              <>
                {/* ✅ No descriptionHtml; just render plain text */}
                <p className="whitespace-pre-line text-slate-800 leading-relaxed">
                  {bodyFull || "No description provided."}
                </p>
                <div className="my-4 h-px bg-slate-200" />
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Show Less
                </button>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="text-slate-900 font-semibold text-lg">
              Ready to make a move?
            </div>
            <div className="text-slate-600 mt-1">
              Don’t wait, apply now and take the next step in your career.
            </div>
            <Link
              href={url || "#"}
              target={url && url !== "#" ? "_blank" : undefined}
              className="btn-pulse mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Easy Apply
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}