// components/vitalsDashboard/SpecialTiles.jsx
import { Briefcase, Sun, Clock, Zap, Crown } from "lucide-react";

function FeatureTile({ iconElement, titleText, subtitleText, bg, titleColor, subtitleColor }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${bg}`}>
      <div className="mb-1">{iconElement}</div>
      <p className={`text-sm font-semibold ${titleColor}`}>{titleText}</p>
      {subtitleText ? <p className={`text-xs ${subtitleColor}`}>{subtitleText}</p> : null}
    </div>
  );
}

/**
 * Props:
 *  - flags: { gig, hybrid, temporary, immediateStart, management }
 */
export default function SpecialTiles({ flags = {} }) {
  const config = [
    {
      key: "gig",
      enabled: !!flags.gig,
      icon: <Briefcase className="w-5 h-5 text-pink-600" aria-label="Gig Work" />,
      title: "Gig Work",
      subtitle: "Flexible shifts",
      bg: "bg-pink-50",
      titleColor: "text-pink-700",
      subtitleColor: "text-pink-600",
    },
    {
      key: "hybrid",
      enabled: !!flags.hybrid,
      icon: <Sun className="w-5 h-5 text-amber-600" aria-label="Hybrid" />,
      title: "Hybrid",
      subtitle: "Office + Home",
      bg: "bg-amber-50",
      titleColor: "text-amber-700",
      subtitleColor: "text-amber-600",
    },
    {
      key: "temporary",
      enabled: !!flags.temporary,
      icon: <Clock className="w-5 h-5 text-yellow-600" aria-label="Temporary" />,
      title: "Temporary",
      subtitle: "Short-term",
      bg: "bg-yellow-50",
      titleColor: "text-yellow-700",
      subtitleColor: "text-yellow-600",
    },
    {
      key: "immediateStart",
      enabled: !!flags.immediateStart,
      icon: <Zap className="w-5 h-5 text-indigo-600" aria-label="Immediate Start" />,
      title: "Immediate Start",
      subtitle: "Start ASAP",
      bg: "bg-indigo-50",
      titleColor: "text-indigo-700",
      subtitleColor: "text-indigo-600",
    },
    {
      key: "management",
      enabled: !!flags.management,
      icon: <Crown className="w-5 h-5 text-violet-600" aria-label="Management" />,
      title: "Management",
      subtitle: "Lead a team",
      bg: "bg-violet-50",
      titleColor: "text-violet-700",
      subtitleColor: "text-violet-600",
    },
  ].filter((t) => t.enabled);

  if (config.length === 0) return null;

  return (
    <>
      {config.map((t) => (
        <FeatureTile
          key={t.key}
          iconElement={t.icon}
          titleText={t.title}
          subtitleText={t.subtitle}
          bg={t.bg}
          titleColor={t.titleColor}
          subtitleColor={t.subtitleColor}
        />
      ))}
    </>
  );
}
