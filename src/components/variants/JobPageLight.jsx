"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Wallet2,
  Clock,
  Home,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";

export default function JobPageLight({ job }) {
  console.log('light', job)
  const {
    title = "",
    company = "",
    logo = null,
    location = "",
    url = "#",
    salary = "",
    workStyle = "",
    isEntryLevel = false,
    workEnvironment = [],
    jobType = "",
    bodyFull = "",
    postedAgo,
    highlights = [],
    benefits = [],
    isImmediateStart = false,
  } = job || {};

  const accentPalette = [
    { iconColor: "text-indigo-500", barGradient: "from-indigo-400 via-indigo-500 to-indigo-600" },
    { iconColor: "text-emerald-500", barGradient: "from-emerald-400 via-emerald-500 to-emerald-600" },
    { iconColor: "text-amber-500", barGradient: "from-amber-400 via-amber-500 to-amber-600" },
    { iconColor: "text-sky-500", barGradient: "from-sky-400 via-sky-500 to-sky-600" },
  ];

  // Read-more UI
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const measure = () =>
      setIsOverflow(el.scrollHeight > el.clientHeight + 2 || (el.textContent || "").length > 280);
    const t = setTimeout(measure, 40);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [bodyFull]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Immediate start banner */}
      {isImmediateStart === true && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs md:text-sm px-3 py-2 inline-flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Kickstart your career now! Immediate openings available.</span>
        </div>
      )}
      {/* Header (compact) */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="h-14 w-14 md:h-16 md:w-16 object-contain rounded-lg border border-slate-200 bg-white"
                />
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-2xl font-bold">
                  {(company || "J").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div className="w-full">
              {/* Title with posted chip on the right */}

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {title && (
                  <div className="min-w-0 max-w-[70ch]">
                    <h1
                      className="
                      font-bold text-slate-900 leading-snug
                      break-words hyphens-auto
                      text-[clamp(1.1rem,0.9rem+1.6vw,1.9rem)]
                      md:text-[clamp(1.25rem,1rem+1.5vw,2rem)]
                    "
                    >
                      {title}
                    </h1>
                  </div>
                )}
                {postedAgo && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-medium sm:self-start sm:ml-6 sm:mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {postedAgo}
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-slate-600 text-sm">
                {company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{company}</span>
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{location}</span>
                  </span>
                )}
              </div>

              {/* Highlight pills */}
              {Array.isArray(highlights) && highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {highlights.map((h, i) => (
                    <span
                      key={`hl-${i}`}
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* tiles (compact) */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {/* Salary */}
                {salary && (
                  <div className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                      <Wallet2 className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                        SALARY
                      </span>
                      <div className="text-slate-900 text-sm">{salary}</div>
                    </div>
                  </div>
                )}

                {/* Job Type */}
                {jobType && (
                  <div className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                        JOB TYPE
                      </span>
                      <div className="text-slate-900 text-sm">{jobType}</div>
                    </div>
                  </div>
                )}

                {/* Work Style */}
                {workStyle && (
                  <div className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                      <Home className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                        WORK STYLE
                      </span>
                      <div className="text-slate-900 text-sm">{workStyle}</div>
                    </div>
                  </div>
                )}

                {/* Entry Level */}
                {isEntryLevel === true && (
                  <div className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                      <Star className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                        LEVEL
                      </span>
                      <div className="text-slate-900 text-sm">Entry level</div>
                    </div>
                  </div>
                )}

                {/* Work Environment */}
                {Array.isArray(workEnvironment) && workEnvironment.length > 0 && (
                  <div className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                      <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="leading-tight min-w-0">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                        WORK ENVIRONMENT
                      </span>
                      <div className="text-slate-900 text-sm break-words">
                        {workEnvironment.join(" • ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* CTA (compact) */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={url || "#"}
                  target={url ? "_blank" : undefined}
                  className="w-full sm:w-auto flex-1 text-center bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-md shadow-sm hover:bg-indigo-700 transition"
                >
                  Apply Now
                </Link>
                <button className="w-full sm:w-auto text-center bg-slate-100 text-slate-700 font-medium py-2.5 px-5 rounded-md hover:bg-slate-200 transition">
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits (tiles) */}
      {benefits.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
          <div className="px-6 py-5">
            <h2 className="text-slate-900 font-semibold text-lg flex items-center gap-2 tracking-tight">
              Benefits &amp; Perks
            </h2>
          </div>

          <div className="px-6 pb-6 pt-2">
            {/* auto-fit prevents lonely single tiles on their own row */}
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {benefits.map((b, i) => {
                const palette = accentPalette[i % accentPalette.length];
                return (
                  <div
                    key={`b-${i}`}
                    className="relative rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                  >
                    {/* thin accent bar */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${palette.barGradient}`} />

                    {/* star pinned top-left, smaller to avoid overlap */}
                    <Star className={`absolute left-2 top-2 h-4 w-4 ${palette.iconColor}`} />

                    {/* centered label with top/bottom padding so it never touches star or border */}
                    <div className="flex h-24 items-center justify-center text-center px-3 pt-6 pb-3">
                      <p className="text-sm font-semibold text-slate-900 leading-snug break-words">
                        {b}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
        <div className="px-6 py-5">
          <h2 className="text-slate-900 font-semibold text-lg">About the Role</h2>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div
            ref={descRef}
            className={`prose max-w-none text-slate-700 leading-relaxed ${expanded ? "max-h-none" : "max-h-40"} overflow-hidden transition-all duration-500 ease-in-out`}
            dangerouslySetInnerHTML={{ __html: bodyFull }}
          />
          {!expanded && isOverflow && (
            <div className="pointer-events-none absolute left-0 right-0 bottom-14 h-16 bg-gradient-to-t from-white to-transparent" />
          )}
          {isOverflow && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
              <svg
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11l3.71-3.77a.75.75 0 111.08 1.04l-4.25 4.32a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
