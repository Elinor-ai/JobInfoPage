// app/(components)/JobPagePanel.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  PoundSterling,
  CalendarDays,
  Timer,
  Home,
  BriefcaseBusiness,
  Sparkles,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function JobPagePanel({ job }) {
  console.log('panel')
  // --- Accept Job instance OR summary POJO ---
  const isJob =
    typeof job?.getLocation === "function" ||
    typeof job?.getSalary === "function";

  const title   = isJob ? job.title : (job?.title || "Job Title");
  const company = isJob ? job.company : (job?.company || "Company");
  const logo    = isJob ? (job.getLogo?.() ?? job.logo) : (job?.logo || "");
  const url     = isJob ? job.url : (job?.url || "#");

  const salary  = isJob ? (job.getSalary?.() ?? job.salary) : (job?.salary || "");
  const location= isJob ? (job.getLocation?.() ?? job.location) : (job?.location || "");

  const contractTimeLabel = isJob
    ? (job.getContractTimeLabel?.() || "")
    : (job?.contractTimeLabel || "");

  const postedAgo = isJob
    ? (job.getPostedAgo?.() || "")
    : (job?.postedAgo || "");

  const flagsObj = isJob ? (job.getSpecialFlags?.() || {}) : null;
  const flagsArr = !isJob ? (job?.flags || []) : null;

  const workStyle = isJob
    ? (flagsObj?.hybrid ? "Hybrid" : "")
    : (Array.isArray(flagsArr) && flagsArr.some(s => /hybrid/i.test(String(s))) ? "Hybrid" : "");

  const benefits = isJob
    ? (job.getBenefits?.() ?? [])
    : (job?.benefits ?? []);

  // Description handling: 3 points + Read More
  const bodyFull = isJob
    ? (job.body ?? job.getDescription?.() ?? "")
    : (job?.bodyFull ?? job?.body ?? "");

  const explicitPoints = Array.isArray(job?.bodyPoints) ? job.bodyPoints : null;

  const firstThree = useMemo(() => {
    if (explicitPoints?.length) return explicitPoints.slice(0, 3);
    const flat = String(bodyFull || "").replace(/\s+/g, " ").trim();
    if (!flat) return [];
    return flat
      .split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [explicitPoints, bodyFull]);

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Banner */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-2 text-sm font-medium flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        Urgently Hiring: This employer is looking to fill this role quickly.
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        {/* LEFT: Company / Snapshot card */}
        <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <img
              src={logo || "https://placehold.co/96x96/e2e8f0/475569?text=Logo"}
              alt={`${company} logo`}
              className="h-20 w-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-2"
            />
            <h1 className="mt-4 text-xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            <div className="mt-1 text-slate-600 text-sm">{company}</div>

            {/* Primary CTA (animated pulse) */}
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
            {location ? (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Location</div>
                  <div className="font-semibold text-slate-800">{location}</div>
                </div>
              </li>
            ) : null}

            <li className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <PoundSterling className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Salary</div>
                <div className="font-semibold text-slate-800">{salary || "—"}</div>
                {salary ? <div className="text-xs text-slate-500">per annum</div> : null}
              </div>
            </li>

            {postedAgo ? (
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Posted</div>
                  <div className="font-semibold text-slate-800">{postedAgo}</div>
                </div>
              </li>
            ) : null}

            <li className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Timer className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Job Type</div>
                <div className="font-semibold text-slate-800">
                  {contractTimeLabel ? contractTimeLabel.toUpperCase() : "—"}
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Work Style</div>
                <div className="font-semibold text-slate-800">{workStyle || "—"}</div>
              </div>
            </li>
          </ul>
        </aside>

        {/* RIGHT: Benefits + Description + CTA */}
        <section className="space-y-6">
          {/* Benefits */}
          {benefits?.length ? (
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
          ) : null}

          {/* Full Description with Read More */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-indigo-600" />
              Full Job Description
            </h3>

            {!expanded ? (
              <>
                <ul className="space-y-2 text-slate-800">
                  {(firstThree.length ? firstThree : [bodyFull]).map((pt, i) => (
                    <li key={`pt-${i}`} className="leading-relaxed">
                      <span className="font-semibold"></span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* fade line for visual break */}
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
                <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                  {bodyFull}
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

          {/* Bottom CTA panel */}
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

      {/* Soft pulse animation (styled-jsx so no Tailwind config needed) */}
      <style jsx>{`
        @keyframes softPulse {
          0%   { transform: scale(1);   box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.35); }
          70%  { transform: scale(1.015); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { transform: scale(1);   box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .btn-pulse {
          animation: softPulse 2.4s ease-in-out infinite;
        }
        .btn-pulse:hover,
        .btn-pulse:focus {
          animation-play-state: paused; /* calm down on intent */
        }
      `}</style>
    </div>
  );
}
