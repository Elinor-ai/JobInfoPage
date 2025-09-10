import { HeartHandshake, Leaf } from "lucide-react";

/* -------------------- helpers (no JSON changes) -------------------- */

function normalizeUniqueStrings(items) {
  const seen = new Set();
  return (items || [])
    .map((value) => String(value || "").trim())
    .filter((value) => value.length > 0)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}


function extractBenefitsFromHtmlParagraph(htmlString) {
  if (!htmlString) return [];
  const paragraphMatch = htmlString.match(/<p[^>]*>[\s\S]*?Benefits:([\s\S]*?)<\/p>/i);
  if (!paragraphMatch) return [];
  const text = paragraphMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const parts = text.split(/\s*,\s*|\s+and\s+/i).map((t) => t.trim());
  return normalizeUniqueStrings(parts);
}

function extractBenefitsFromPlainText(bodyText) {
  if (!bodyText) return [];
  const lower = bodyText.toLowerCase();
  const startLabel = "benefits:";
  const startIndex = lower.indexOf(startLabel);
  if (startIndex === -1) return [];
  const after = bodyText.slice(startIndex + startLabel.length);
  const endLabels = [
    "role overview:", "key responsibilities:", "essential requirements:",
    "desirable qualifications:", "what to do next:",
  ];
  let endIndex = after.length;
  for (const label of endLabels) {
    const idx = after.toLowerCase().indexOf(label);
    if (idx !== -1 && idx < endIndex) endIndex = idx;
  }
  const benefitsChunk = after.slice(0, endIndex);
  return normalizeUniqueStrings(
    benefitsChunk
      .split(/\s*,\s*|\s+and\s+/i)
      .map((t) => t.replace(/[.;]+$/g, "").trim())
  );
}

function getBenefitsFromJob(jobRecord) {
  const structuredV2 = jobRecord?.job_metadata_v2?._benefits;
  if (Array.isArray(structuredV2) && structuredV2.length) return normalizeUniqueStrings(structuredV2);

  const structuredV1 = jobRecord?.job_metadata?._benefits;
  if (Array.isArray(structuredV1) && structuredV1.length) return normalizeUniqueStrings(structuredV1);

  const fromHtml = extractBenefitsFromHtmlParagraph(String(jobRecord?.original_body || ""));
  if (fromHtml.length) return fromHtml;

  const fromPlain = extractBenefitsFromPlainText(String(jobRecord?.body || ""));
  if (fromPlain.length) return fromPlain;

  return [];
}

/* --------------------------- component --------------------------- */

/**
 * Props:
 * - job?: object                       // pass the full job JSON (preferred)
 * - benefits?: string[]                // or pass a precomputed benefits array
 * - sectionTitle?: string              // defaults to "Pay, Perks & Peace of Mind"
 * - BenefitIconComponent?: React.FC    // optional icon component per benefit (receives { benefit, className })
 * - emptyStateText?: string            // text to show if no benefits found
 */
export default function BenefitsSection({
  job,
  benefits,
  sectionTitle = "Pay, Perks & Peace of Mind",
  BenefitIconComponent,
  emptyStateText = "Benefits not specified.",
}) {
  const resolvedBenefits = Array.isArray(benefits) ? benefits : getBenefitsFromJob(job);

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <HeartHandshake className="w-6 h-6 mr-3 text-green-500" />
        {sectionTitle}
      </h3>

      {resolvedBenefits.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resolvedBenefits.map((benefitText, benefitIndex) => (
            <div
              key={`${benefitText}-${benefitIndex}`}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {BenefitIconComponent ? (
                <BenefitIconComponent
                  benefit={benefitText}
                  className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                />
              ) : (
                <Leaf className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              )}
              <span className="text-gray-700 text-sm">{benefitText}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{emptyStateText}</p>
      )}
    </section>
  );
}
