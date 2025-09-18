import React from 'react';
// import DefaultDesign from './designs/DefaultDesign';
// import DesignVariantA from './designs/DesignVariantA';
// import DesignVariantB from './designs/DesignVariantB';

import JobPageClassic from '@/components/varients/JobPageClassic';
import JobPageLight from '@/components/varients/JobPageLight';
import JobPagePanel from '@/components/varients/JobPagePanel';


const componentMap = {
  JobPageClassic,
  JobPageLight,
  JobPagePanel,
};

export default function RenderDesign({ variant, job }) {
  const Component = componentMap[variant] || JobPageLight;
  return <Component job={job} />;
}
