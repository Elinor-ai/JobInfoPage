import React from 'react';
import JobPageClassic from '@/components/variants/JobPageClassic';
import JobPageLight from '@/components/variants/JobPageLight';
import JobPagePanel from '@/components/variants/JobPagePanel';
import JobPageMinimal from '@/components/variants/JobPageMinimal';

const componentMap = {
  classic: JobPageClassic,
  light: JobPageLight,
  panel: JobPagePanel,
  minimal: JobPageMinimal
};

export default function RenderDesign({ variant, job }) {
  const Component = componentMap[variant] ?? JobPageLight;
  return <Component job={job} />;
}
