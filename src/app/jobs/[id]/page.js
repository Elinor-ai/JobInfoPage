import RenderDesign from "@/components/RenderDesign";
import { getJobById } from "@/lib/jobRepository";
import { notFound } from "next/navigation";
import Job from "@/public/utils/Job";
import { headers, cookies } from "next/headers";

export default async function JobPage({ params, searchParams }) {
  const { id } = params;

  const flow = searchParams?.flow || "";
  const metadataEntries = Object.entries(searchParams || {}).filter(
    ([key]) => key !== "flow"
  );
  const metadataQuery = metadataEntries
    .map(
      ([key, value]) =>
        `metadata[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`
    )
    .join("&");

  // Build absolute internal URL from incoming request (works in dev/prod)
  const header = headers();
  const host = header.get("x-forwarded-host") || header.get("host");
  const proto = header.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  const decideUrl = `${baseUrl}/api/decide?flow=${encodeURIComponent(flow)}${
    metadataQuery ? "&" + metadataQuery : ""
  }`;

  // Forward request cookies so /api/decide sees the existing userId
  const cookieHeader = cookies().toString();
  const decideRes = await fetch(decideUrl, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });

  if (!decideRes.ok) {
    throw new Error("Decide API failed");
  }

  const decideData = await decideRes.json();
  const variant = decideData.variant;

  const jobRecord = await getJobById(id);
  const job = new Job(id, jobRecord);

  if (!job) notFound();

  const jobSummary = job.toClassicViewModel();

  return <RenderDesign variant={variant} job={jobSummary} />;
}
