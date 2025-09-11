import JobPageLight from "@/components/varients/JobPageLight";
import JobPagePanel from "@/components/varients/JobPagePanel";
import JobPageClassic from "@/components/varients/JobPageClassic";


export const registry = {
  light: JobPageLight,
  panel: JobPagePanel,
  classic: JobPageClassic,
};

export function getVariantComponent(variantId) {
  return registry[variantId] || JobPageLight;
}
