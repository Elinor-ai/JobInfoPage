import JobDescriptionSection from "@/components/JobDescriptionSection";
import BenefitsSection from "@/components/BenefitsSection";
import RequirementsSection from "@/components/RequirementsSection"; // 👈 add this
import PrimaryCTA from "@/components/PrimaryCTA";

export default function JobPagePanel({ job }) {
  // Build a simple view-model once
  const vm = {
    title: job?.title || "Job Title",
    company: job?.company || "Company",
    logo: job?.getLogo?.() || "https://placehold.co/56x56/eef2f7/667085?text=Logo",
    location: job?.getLocation?.() || "Location",
    salary: job?.getSalary?.() || "",
    description: job?.getDescription?.() || "",
    benefits: job?.getBenefits?.() || [],
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

  const hasRequirements =
    (vm.requirements.mustHave?.length ?? 0) > 0 ||
    (vm.requirements.niceToHave?.length ?? 0) > 0 ||
    (vm.requirements.skills?.length ?? 0) > 0 ||
    (vm.requirements.education?.length ?? 0) > 0 ||
    (vm.requirements.certifications?.length ?? 0) > 0 ||
    (vm.requirements.languages?.length ?? 0) > 0 ||
    (vm.requirements.experience?.length ?? 0) > 0;

  // Show a divider if either Requirements or Benefits exists
  const hasAnyPostDescriptionSection = hasRequirements || (vm.benefits.length > 0);
  return (
    <main className="page">
      {/* Main card */}
      <section className="card p-5 md:p-6 lg:p-7">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <img
            src={vm.logo}
            alt={vm.company ? `${vm.company} logo` : "Company logo"}
            className="h-12 w-12 rounded-md object-contain bg-slate-100"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-snug">{vm.title}</h1>
            <p className="mt-1 text-sm text-slate-600 flex flex-wrap items-center gap-2">
              <span className="truncate">{vm.company}</span>
              <span>•</span>
              <span className="truncate">📍 {vm.location}</span>
            </p>

            {/* Salary pill */}
            {vm.salary && (
              <div className="mt-3">
                <span className="salary-pill">💲 {vm.salary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-5" />

        {/* Description */}
        <div className="prose prose-slate max-w-none">
          <h3 className="mb-2 text-base font-semibold">About The Job</h3>
          <JobDescriptionSection descriptionText={vm.description} />
        </div>

        {/* Divider (only if there’s a section after description) */}
        {hasAnyPostDescriptionSection && <div className="divider my-6" />}

        {/* Requirements */}
        {hasRequirements && (
          <div className="mb-6">
            <h3 className="mb-3 text-base font-semibold">Requirements</h3>
            <RequirementsSection requirements={vm.requirements} />
          </div>
        )}

        {/* Benefits */}
        {vm.benefits.length > 0 && (
          <div>
            <h3 className="mb-3 text-base font-semibold">Benefits</h3>
            <BenefitsSection benefits={vm.benefits} />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="panel-bottom-cta">
          <div className="w-full max-w-xs">
            <PrimaryCTA
              label="View & Apply"
              href={vm.url}
              fullWidth
              trackingId="apply:panel:bottom"
              jobId={vm.id}
              jobTitle={vm.title}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
