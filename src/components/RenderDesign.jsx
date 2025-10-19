import React from 'react';
import JobPageClassic from '@/components/variants/JobPageClassic';
import JobPageLight from '@/components/variants/JobPageLight';
import JobPagePanel from '@/components/variants/JobPagePanel';
import JobPageBenefits from '@/components/variants/JobPageBenefits';

const componentMap = {
  classic: JobPageClassic,
  light: JobPageLight,
  panel: JobPagePanel,
  benefits: JobPageBenefits
};

export default function RenderDesign({ variant, job }) {
  const Component = componentMap[variant] ?? JobPageLight;
  return <Component job={job} />;
}
