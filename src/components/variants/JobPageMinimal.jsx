// app/(components)/JobPagePanel.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Wallet2,
  Home,
  Clock,
  Rocket,
} from "lucide-react";

/** Pretty labels for common v2 booleans; any other is* key gets startCased. */
const BOOL_LABELS = {
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

const startCase = (s = "") =>
  String(s)
    .replace(/^is/, "")
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const isBlank = (v) =>
  v == null ||
  (typeof v === "string" && v.trim().length === 0) ||
  v === "cant_determine";

const timeAgo = (dateLike) => {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(+d)) return null;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const v = Math.floor(s / secs);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

export default function JobPageMinimal({ job }) {
    console.log('minimal')
  // ---------- Normalize from the summary you pass in ----------
  const title = job?.title || "Job Title";
  const company = job?.company || "Company not disclosed";
  const city = job?.city ?? null;
  const state = job?.state ?? null;
  const location = job?.location || [city, state].filter(Boolean).join(", ") || null;

  // Body: prefer HTML if you have it on the summary, otherwise join bodyPoints
  const bodyHtml =
    job?.original_body ||
    job?.bodyFull ||
    (Array.isArray(job?.bodyPoints) && job.bodyPoints.length
      ? `<p>${job.bodyPoints.map((p) => String(p)).join("</p><p>")}</p>`
      : "<p>No job description provided.</p>");

  const salary = !isBlank(job?.salary) ? job?.salary : null;
  const contractType = job?.contract_type || null;

  // Work style
  const workStyle =
    job?.isFullyRemote ? "Fully Remote" : job?.isHybrid ? "Hybrid" : null;

  // Job type derived if contract type missing
  const jobType = contractType
    ? startCase(String(contractType).toLowerCase())
    : job?.isPartTime
    ? "Part-time"
    : null;

  const posted =
    job?.date_posted || job?.inserted_db_at || job?.db_inserted_at || null;
  const postedLabel = timeAgo(posted);

  const logo = job?.logo || null;
  const logoLetter =
    !logo && company ? company.slice(0, 1).toUpperCase() : "J";

  const benefits = Array.isArray(job?.benefits) ? job.benefits : [];

  // Build highlights from ANY boolean key that starts with "is" and is true
  const highlights = useMemo(() => {
    if (!job || typeof job !== "object") return [];
    return Object.entries(job)
      .filter(([k, v]) => k.startsWith("is") && v === true)
      .map(([k]) => BOOL_LABELS[k] || startCase(k));
  }, [job]);

  // Description collapse
  const [expanded, setExpanded] = useState(false);
  const descRef = useRef(null);
  const [isCollapsible, setIsCollapsible] = useState(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    // slight delay to allow HTML to render
    const t = setTimeout(() => {
      setIsCollapsible(el.scrollHeight > el.clientHeight + 2);
    }, 60);
    return () => clearTimeout(t);
  }, [bodyHtml]);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Header / Main info */}
      <section className="bg-white card rounded-2xl shadow-sm border border-slate-200">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="h-20 w-20 object-contain rounded-lg border border-slate-200 bg-white"
                  onError={(e) => {
                    e.currentTarget.replaceWith(
                      createFallbackLogoNode(logoLetter)
                    );
                  }}
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-3xl font-bold">
                  {logoLetter}
                </div>
              )}
            </div>

            {/* Title / Company / Location */}
            <div className="flex-grow min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
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
            </div>
          </div>

          {/* Apply / Save */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <Link
              id="apply-url-top"
              href={job?.url || "#"}
              target={job?.url ? "_blank" : undefined}
              className="w-full sm:w-auto flex-1 text-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-transform hover:scale-[1.02]"
            >
              Easy Apply
            </Link>
            <button className="w-full sm:w-auto text-center bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">
              Save Job
            </button>
          </div>
        </div>
      </section>

      {/* Key Details */}
      {(salary || jobType || workStyle || postedLabel) && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800">Key Details</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {salary && (
              <Pill icon={<Wallet2 className="w-5 h-5 text-indigo-500" />}>
                <PillLabel>Salary</PillLabel>
                <PillValue>{salary}</PillValue>
              </Pill>
            )}

            {jobType && (
              <Pill icon={<Clock className="w-5 h-5 text-indigo-500" />}>
                <PillLabel>Job Type</PillLabel>
                <PillValue>{jobType}</PillValue>
              </Pill>
            )}

            {workStyle && (
              <Pill icon={<Home className="w-5 h-5 text-indigo-500" />}>
                <PillLabel>Work Style</PillLabel>
                <PillValue>{workStyle}</PillValue>
              </Pill>
            )}

            {postedLabel && (
              <Pill icon={<CalendarDays className="w-5 h-5 text-indigo-500" />}>
                <PillLabel>Posted</PillLabel>
                <PillValue>{postedLabel}</PillValue>
              </Pill>
            )}
          </div>
        </section>
      )}

      {/* Highlights (from any true boolean) */}
      {highlights.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            Highlights
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span
                key={`hl-${i}`}
                className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 text-xs font-semibold"
              >
                {h}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Benefits &amp; Perks
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {benefits.map((b, i) => (
              <span
                key={`b-${i}`}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4" />
                {b}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Full Job Description
        </h2>
        <div className="relative">
          <div
            ref={descRef}
            className={`prose max-w-none text-slate-700 ${
              expanded ? "max-h-none" : "max-h-72"
            } overflow-hidden transition-all duration-500 ease-in-out`}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          {!expanded && isCollapsible && (
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          {isCollapsible && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 text-indigo-600 font-semibold hover:underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </section>

      {/* Floating pulsing CTA (right on desktop, bottom on mobile) */}
      <Link
        href={job?.url || "#"}
        target={job?.url ? "_blank" : undefined}
        className="fixed right-6 bottom-6 md:right-8 md:top-1/3 md:bottom-auto z-40
                   inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white font-semibold
                   px-5 py-3 shadow-lg hover:bg-indigo-700 transition pulse"
        aria-label="Easy Apply"
      >
        <Rocket className="w-5 h-5" />
        Easy Apply
      </Link>
    </div>
  );
}

/* ---------------------------------- UI bits --------------------------------- */
function Pill({ icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-3">
      {icon}
      <div>{children}</div>
    </div>
  );
}
const PillLabel = ({ children }) => (
  <p className="text-sm text-slate-500">{children}</p>
);
const PillValue = ({ children }) => (
  <p className="font-semibold text-slate-800">{children}</p>
);

/* Fallback logo node creator (used on image onError) */
function createFallbackLogoNode(letter = "J") {
  const el = document.createElement("div");
  el.className =
    "w-20 h-20 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-3xl font-bold";
  el.textContent = letter;
  return el;
}
