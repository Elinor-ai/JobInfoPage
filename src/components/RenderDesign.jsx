import React from 'react';
import JobPageClassic from '@/components/varients/JobPageClassic';
import JobPageLight from '@/components/varients/JobPageLight';
import JobPagePanel from '@/components/varients/JobPagePanel';

const componentMap = {
  classic: JobPageClassic,
  light: JobPageLight,
  panel: JobPagePanel,
};

export default function RenderDesign({ variant, job }) {
  const Component = componentMap[variant] ?? JobPageLight;
  return <Component job={job} />;
}
