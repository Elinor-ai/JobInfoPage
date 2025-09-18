import RenderDesign from '@/components/RenderDesign';
import { cookies } from 'next/headers';
import { getJobById } from '@/lib/jobRepository';

export default async function JobPage({ params, searchParams }) {
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
  const job = await getJobById(id)

  return <RenderDesign variant={variant} job={job} />;
}
