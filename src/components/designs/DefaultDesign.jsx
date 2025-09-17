import React from 'react';

export default function DefaultDesign({ job }) {
  if (!job) return null;
  return (
    <div>
      <h1>{job.title}</h1>
      {/* Render original body if available, else fallback to body */}
      <div dangerouslySetInnerHTML={{ __html: job.original_body || job.body }} />
      {job.date_posted && (
        <p>Posted on: {new Date(job.date_posted).toLocaleDateString()}</p>
      )}
      {job.city && job.country_code && (
        <p>Location: {job.city}, {job.country_code}</p>
      )}
    </div>
  );
}
