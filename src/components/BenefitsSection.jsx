import {Sun, Mountain, Bike, Leaf, HeartHandshake} from "lucide-react";

function BenefitIcon({ benefit, className }) {
  const lower = (benefit || "").toLowerCase();
  if (lower.includes("hybrid") || lower.includes("flexible")) return <Sun className={className} />;
  if (lower.includes("leave")  || lower.includes("annual"))   return <Mountain className={className} />;
  if (lower.includes("cycle"))                                return <Bike className={className} />;
  return <Leaf className={className} />;
}
export default function BenefitsSection({benefits}) {

  console.log('Sbenefits', benefits)
  if (!benefits) return null;
  const resolvedBenefits = Array.isArray(benefits) ? benefits : getBenefitsFromJob(job);

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <HeartHandshake className="w-6 h-6 mr-3 text-green-500" />
        Pay, Perks & Peace of Mind
      </h3>

      {resolvedBenefits.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resolvedBenefits.map((benefitText, benefitIndex) => (
            <div
              key={`${benefitText}-${benefitIndex}`}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              
                <BenefitIcon
                  benefit={benefitText}
                  className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                />              
              <span className="text-gray-700 text-sm">{benefitText}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Benefits not specified.</p>
      )}
    </section>
  );
}
