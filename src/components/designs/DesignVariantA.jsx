import React from 'react';

const DesignVariantA = ({ job }) => {
  if (!job) {
    return <div>No job data available.</div>;
  }

  const { title, original_body, body, date_posted, city } = job;

  return (
    <div className="design-variant-a">
      <h1>{title}</h1>
      {city && <p><em>{city}</em></p>}
      {date_posted && (
        <p><strong>Posted on:</strong> {new Date(date_posted).toLocaleDateString()}</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: original_body || body }} />
    </div>
  );
};

export default DesignVariantA;
