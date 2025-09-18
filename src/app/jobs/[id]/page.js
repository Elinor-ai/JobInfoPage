import RenderDesign from '@/components/RenderDesign';
import { cookies } from 'next/headers';

export default async function Page({ params, searchParams }) {
  const { id } = params;
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const flow = searchParams?.flow || '';
  // Build metadata query parameters from searchParams except flow
  const metadataEntries = Object.entries(searchParams || {}).filter(([key]) => key !== 'flow');
  const metadataQuery = metadataEntries
    .map(([key, value]) => `metadata[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`)
    .join('&');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const decideUrl = `${apiBase}/decide?flow=${encodeURIComponent(flow)}${metadataQuery ? '&' + metadataQuery : ''}`;

  const decideRes = await fetch(decideUrl, {
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  const decideData = await decideRes.json();
  const variant = decideData.variant;

  // Fetch job data
  const jobRes = await fetch(`${apiBase}/job/${id}`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  const jobData = await jobRes.json();
  const job = jobData.job;

  return <RenderDesign variant={variant} job={job} />;
}
