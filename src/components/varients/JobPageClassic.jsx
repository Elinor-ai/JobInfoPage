
import Link from "next/link";
import {
  Building2,
  MapPin,
  Gift,
  CheckCircle2,
  Clock,
  PoundSterling,
} from "lucide-react";

export default function JobPageClassic({ job }) {
    console.log('JobPageClassic', job)

  const vm = {
    title: job?.title || "Job Title",
    company: job?.company || "Company",
    logo: job?.getLogo?.() || "https://placehold.co/56x56/eef2f7/667085?text=Logo",
    location: job?.getLocation?.() || "Location",
    salary: job?.getSalary?.() || "",
    benefits: job?.getBenefits?.() || [],
    contractTimeLabel: job?.getContractTimeLabel?.(),
    hoursPerWeek: job?.getHoursPerWeek?.(),
    specialFlags: job?.getSpecialFlags?.(),
    teaser: job?.getTeaser?.(420) || job?.getDescription?.() || "",
    postedAgo: job?.getPostedAgo?.() || null,
    requirements:
      job?.getRequirements?.() || {
        mustHave: [],
        niceToHave: [],
        skills: [],
        education: [],
        certifications: [],
        languages: [],
        experience: [],
      },
    url: job?.url || "#",
    id: job?.id,
  };
  const dedupe = (items = []) => {
  const seen = new Set();
  return items
    .map(v => String(v || "").trim())
    .filter(v => v.length)
    .filter(v => {
      const k = v.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
};
  const reqBullets = dedupe([
    ...(vm.requirements?.niceToHave || []),
    ...(vm.requirements?.skills || []),
    ...(vm.requirements?.education || []),
    ...(vm.requirements?.certifications || []),
    ...(vm.requirements?.languages || []),
    ...(vm.requirements?.experience || []),
  ]).slice(0, 8);  const benefitBullets = (vm.benefits || []).slice(0, 5);

  // Optional: avoid duplicating "p.a." if salary already contains it
  const salaryHasPeriod =
    /\b(per\s*(annum|year)|p\.?a\.?)\b/i.test(String(vm.salary));
  const salarySuffix = vm.salary && !salaryHasPeriod ? " p.a." : "";

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* LEFT: Main card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <img
              src={vm.logo}
              alt={`${vm.company} logo`}
              className="h-14 w-14 rounded-lg object-contain bg-slate-100 p-1"
            />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-slate-900">
                {vm.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{vm.company}</span>
                </span>
                {vm.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{vm.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Role Overview */}
          <div className="my-6 border-t border-slate-200" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Role Overview
            </h3>
            <p className="text-slate-700 leading-relaxed">{vm.teaser}</p>
          </div>

          {/* Key Requirements */}
          {reqBullets.length > 0 && (
            <>
              <div className="my-6 border-t border-slate-200" />
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Key Requirements
                </h3>
                <ul className="space-y-3">
                  {reqBullets.map((item, i) => (
                    <li key={`req-${i}`} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Benefits & Perks */}
          {benefitBullets.length > 0 && (
            <>
              <div className="my-6 border-t border-slate-200" />
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Benefits &amp; Perks
                </h3>
                <ul className="space-y-3">
                  {benefitBullets.map((b, i) => (
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
          {/* Salary + Apply */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">
                Salary
              </span>
              <PoundSterling className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mt-1 text-3xl font-bold text-slate-900">
              {vm.salary || "—"}
              {salarySuffix && (
                <span className="text-base font-medium text-slate-500">
                  {salarySuffix}
                </span>
              )}
            </div>

            <Link
              href={vm.url || "#"}
              target={vm.url && vm.url !== "#" ? "_blank" : undefined}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Apply Now
            </Link>

            {vm.postedAgo && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{vm.postedAgo}</span>
              </div>
            )}
          </div>

          {/* Job Snapshot */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              Job Snapshot
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Type
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {vm.contractTimeLabel || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {vm.location || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
