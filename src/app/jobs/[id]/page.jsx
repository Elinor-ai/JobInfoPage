import { notFound } from "next/navigation";
import { jobs } from "@/app/data/jobData"
import JobVitals from "@/components/vitalsDashboard/JobVital";
import SalaryTile from "@/components/vitalsDashboard/SalaryTile";
import LocationTile from "@/components/vitalsDashboard/LocationTile";
import HoursTile from "@/components/vitalsDashboard/HoursTile";
import SpecialTiles from "@/components/vitalsDashboard/SpecialTiles";
import RequirementsSection from "@/components/RequirementsSection";
import BenefitsSection from "@/components/BenefitsSection";
import PrimaryCTA from "@/components/PrimaryCTA";
import JobHeader from "@/components/JobHeader";
import JobDescriptionSection from "@/components/JobDescriptionSection";



import {
  Sun, Mountain, Bike, Leaf
} from "lucide-react";

function getCanonicalJobId(job) {
  return (
    job?._id?.$oid ||               // your data uses this
    job?.id ||
    job?.extId ||
    job?.external_id ||
    job?.referencenumber ||
    job?.referencenumber_with_location ||
    job?.referencenumber_with_tsn ||
    ""
  );
}

// normalize any supported id shape from your data
const getId = (j) => String(j?.id ?? j?._id?.$oid ?? j?._id ?? "");

// export default function JobPage({ params }) {
//   const jobId = String(params.id);
//   const job = jobs.find((j) => getId(j) === jobId);
//   if (!job) return notFound();

//   return <JobDetailVariant job={job} />;
// }

function BenefitIcon({ benefit, className }) {
  const lower = (benefit || "").toLowerCase();
  if (lower.includes("hybrid") || lower.includes("flexible")) return <Sun className={className} />;
  if (lower.includes("leave")  || lower.includes("annual"))   return <Mountain className={className} />;
  if (lower.includes("cycle"))                                return <Bike className={className} />;
  return <Leaf className={className} />;
}

export default function JobPage({ params }) {
    const routeId = String(params.id);                   // e.g. "68a5cdf8b7709270df12feb6"
    const job = (Array.isArray(jobs) ? jobs : []).find(
    (record) => String(getCanonicalJobId(record)) === routeId
    );
    if (!job) return notFound();

  const logo = job.logo || "https://placehold.co/64x64/e2e8f0/475569?text=Logo";

  return (
    <>
    <main className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
       
      {/* Company Header */}
      <JobHeader
        jobTitle={job.title}
        companyName={job.company}
        logoUrl={job.logo}
      />


      {/* Vitals Dashboard */}
      <JobVitals jobData={job}>
        <SalaryTile jobData={job} />
        <LocationTile jobData={job} />
        <HoursTile jobData={job} />
        <SpecialTiles jobData={job} />
      </JobVitals>

        <div className="mb-12">
        <PrimaryCTA
          label="Quick Apply"
          href={job?.url || "#"}          // or omit href and pass onClick to open a modal, etc.
          fullWidth
          trackingId="cta-quick-apply"
          jobId={String(params.id)}
          jobTitle={job?.title}
        />
      </div>

      <div className="space-y-12">
        <JobDescriptionSection job={job} />
        <RequirementsSection job={job} />
        <BenefitsSection job={job} BenefitIconComponent={BenefitIcon} />

      </div>

    </main>
    </>
  );
}

export function generateStaticParams() {
  return (jobs || []).map(j => ({ id: getId(j) }));
}
