import React from 'react';
import DefaultDesign from './designs/DefaultDesign';
import DesignVariantA from './designs/DesignVariantA';
import DesignVariantB from './designs/DesignVariantB';

const componentMap = {
  DefaultDesign,
  DesignVariantA,
  DesignVariantB,
};

export default function RenderDesign({ variant, job }) {
  const Component = componentMap[variant] || DefaultDesign;
  return <Component job={job} />;
}
