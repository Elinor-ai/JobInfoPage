import SalaryTile from "@/components/vitalsDashboard/SalaryTile";
import LocationTile from "@/components/vitalsDashboard/LocationTile";
import HoursTile from "@/components/vitalsDashboard/HoursTile";
import SpecialTiles from "@/components/vitalsDashboard/SpecialTiles";
import RequirementsSection from "@/components/RequirementsSection";
import BenefitsSection from "@/components/BenefitsSection";
import PrimaryCTA from "@/components/PrimaryCTA";
import JobHeader from "@/components/JobHeader";
import JobDescriptionSection from "@/components/JobDescriptionSection";

export default function JobPageLight({ job }) {
    console.log('JobPageLight', job)

  const vm = {
    title: job?.title || "Job Title",
    company: job?.company || "Company",
    logo: job?.getLogo?.() || "https://placehold.co/56x56/eef2f7/667085?text=Logo",
    location: job?.getLocation?.() || "Location",
    salary: job?.getSalary?.() || "",
    description: job?.getDescription?.() || "",
    benefits: job?.getBenefits?.() || [],
    contractTimeLabel: job?.getContractTimeLabel?.(), 
    hoursPerWeek: job?.getHoursPerWeek?.(),          
    specialFlags: job?.getSpecialFlags?.(), 
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

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <JobHeader jobTitle={vm.title} companyName={vm.company} logoUrl={vm.logo} />

      {/* Vitals Dashboard (kept as-is; refactor later if you want) */}
      <section className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Job Snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <SalaryTile salary={vm.salary} />
          <LocationTile location={vm.location} />
          <HoursTile contractTimeLabel={vm.contractTimeLabel} hoursPerWeek={vm.hoursPerWeek} />
           <SpecialTiles flags={vm.specialFlags} />
        </div>
      </section>

      {/* CTA */}
      <div className="mb-12">
        <PrimaryCTA
          label="Quick Apply"
          href={vm.url}
          fullWidth
          trackingId="cta-quick-apply"
          jobId={String(vm.id ?? "")}
          jobTitle={vm.title}
        />
      </div>

      {/* Content sections */}
      <div className="space-y-12">
        {/* Description now gets plain text, not `job` */}
        <JobDescriptionSection descriptionText={vm.description} />

        {/* Requirements now gets normalized object */}
        {hasRequirements && (
          <div>
            <h3 className="mb-3 text-base font-semibold">Requirements</h3>
            <RequirementsSection requirements={vm.requirements} />
          </div>
        )}

        {/* Benefits now gets a string[] */}
        {vm.benefits.length > 0 && (
          <div>
            <h3 className="mb-3 text-base font-semibold">Benefits</h3>
            <BenefitsSection benefits={vm.benefits} />
          </div>
        )}
      </div>
    </main>
  );

}
