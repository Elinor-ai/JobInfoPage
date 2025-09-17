import React from 'react';

const DesignVariantB = ({ job }) => {
  if (!job) {
    return <div>Job data not available.</div>;
  }

  const { title, original_body, body, city, state, date_posted, job_metadata_v2 } = job;

  // Extract some metadata if available
  const languages = job_metadata_v2?.['_languageRequirements'] || job_metadata_v2?.['_item_language']?.map(lang => lang.language_code);
  const isPartTime = job_metadata_v2?._isPartTime;
  const isHybrid = job_metadata_v2?._isHybrid;
  const isRemote = job_metadata_v2?._isFullyRemote;
  const jobLevel = job_metadata_v2?._jobLevel;

  return (
    <div className="design-variant-b">
      <header>
        <h1>{title}</h1>
        {(city || state) && (
          <p>
            {city && <span>{city}</span>}
            {city && state && ', '}
            {state && <span>{state}</span>}
          </p>
        )}
        {date_posted && (
          <p><strong>Posted on:</strong> {new Date(date_posted).toLocaleDateString()}</p>
        )}
      </header>
      <section dangerouslySetInnerHTML={{ __html: original_body || body }} />
      {(languages || isPartTime || isHybrid || isRemote || jobLevel) && (
        <aside style={{ marginTop: '1rem' }}>
          <h3>Job Details</h3>
          <ul>
            {languages && languages.length > 0 && (
              <li><strong>Languages:</strong> {languages.join(', ')}</li>
            )}
            {typeof isPartTime === 'boolean' && (
              <li><strong>Type:</strong> {isPartTime ? 'Part-time' : 'Full-time'}</li>
            )}
            {typeof isHybrid === 'boolean' && isHybrid && <li><strong>Hybrid position</strong></li>}
            {typeof isRemote === 'boolean' && isRemote && <li><strong>Remote position</strong></li>}
            {jobLevel && <li><strong>Level:</strong> {jobLevel}</li>}
          </ul>
        </aside>
      )}
    </div>
  );
};

export default DesignVariantB;
