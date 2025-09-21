import RenderDesign from '@/components/RenderDesign';
import { getJobById } from '@/lib/jobRepository';
import { notFound } from 'next/navigation';
import Job from '@/public/utils/Job';

export default async function JobPage({ params, searchParams }) {
  const { id } = params;

  const flow = searchParams?.flow || '';
  const metadataEntries = Object.entries(searchParams || {}).filter(
    ([key]) => key !== 'flow'
  );
  const metadataQuery = metadataEntries
    .map(([key, value]) => `metadata[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`)
    .join('&');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const decideUrl = `${baseUrl}/api/decide?flow=${encodeURIComponent(flow)}${metadataQuery ? '&' + metadataQuery : ''}`;

  const decideRes = await fetch(decideUrl, { cache: 'no-store' });

  if (!decideRes.ok) {
    throw new Error('Decide API failed');
  }

  const decideData = await decideRes.json();
  const variant = decideData.variant;

  const jobRecord = await getJobById(id);

  const job = new Job(id, jobRecord)

   if (!job) notFound();

  const jobSummary = job.toClassicViewModel()
   

  return <RenderDesign variant={variant} job={jobSummary} />;
}
