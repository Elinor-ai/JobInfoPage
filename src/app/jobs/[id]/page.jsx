import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ABTestManager from '@/lib/ab/ABTestManager';
import { experiments } from "@/lib/ab/config";
import { getVariantComponent } from "@/lib/ab/variantRegistry";
import AbClientBootstrap from "@/components/AbClientBootstrap";
import Job from "@/public/utils/job";

// TODO: point this to your real data source
// If you already fetch from an API/DB, keep that logic and just return `job`.
const ab = new ABTestManager({ experiments });

export default function JobPage({ params }) {
  // const job = getJobData(params.id)

  const job = Job.findJobByRouteId(params.id);
  if (!job) return notFound();

  // Read the chosen design that middleware set as a cookie
  const programId = "designs_v1";
  const design = ab.getServerVariantForProgram(cookies(), programId) || "light";
  console.log('design', design)

  // Map that design id to a component (registry handles it)
  const Variant = getVariantComponent(design);

  return (
    <>
      <AbClientBootstrap /> {/* mirrors cookie→sessionStorage + fires /api/ab/sync */}
      <Variant job={job} />
    </>
  );
}
