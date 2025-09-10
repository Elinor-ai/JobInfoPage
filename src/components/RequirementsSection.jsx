// components/RequirementsSection.jsx
"use client";

import {
  ClipboardCheck,
  Star,
  GraduationCap,
  Languages as LanguagesIcon,
  BadgeCheck,
  Wrench,
} from "lucide-react";
import { getRequirementsFromJob } from "@/public/utils/jobRequirements";

export default function RequirementsSection({ job }) {
  const {
    mustHave,
    niceToHave,
    skills,
    education,
    certifications,
    languages,
    experience,
  } = getRequirementsFromJob(job);

  const hasAny =
    mustHave.length ||
    niceToHave.length ||
    skills.length ||
    education.length ||
    certifications.length ||
    languages.length ||
    experience.length;

  if (!hasAny) return null;

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <ClipboardCheck className="w-6 h-6 mr-3 text-emerald-600" />
        Requirements
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!!mustHave.length && (
          <Card title="Must-have" icon={<ClipboardCheck className="w-5 h-5" />}>
            <ul className="space-y-2">
              {mustHave.map((item, idx) => (
                <li key={`must-${idx}`} className="text-sm text-gray-700 flex">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!!niceToHave.length && (
          <Card title="Nice to have" icon={<Star className="w-5 h-5" />}>
            <ul className="space-y-2">
              {niceToHave.map((item, idx) => (
                <li key={`nice-${idx}`} className="text-sm text-gray-700 flex">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!!skills.length && (
          <Chips title="Skills" icon={<Wrench className="w-5 h-5" />} items={skills} />
        )}

        {!!education.length && (
          <Chips
            title="Education"
            icon={<GraduationCap className="w-5 h-5" />}
            items={education}
          />
        )}

        {!!certifications.length && (
          <Chips
            title="Certifications"
            icon={<BadgeCheck className="w-5 h-5" />}
            items={certifications}
          />
        )}

        {!!languages.length && (
          <Chips
            title="Languages"
            icon={<LanguagesIcon className="w-5 h-5" />}
            items={languages}
          />
        )}

        {!!experience.length && (
          <Chips title="Experience" icon={<ClipboardCheck className="w-5 h-5" />} items={experience} />
        )}
      </div>
    </section>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-gray-700">{icon}</span>
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Chips({ title, icon, items }) {
  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-gray-700">{icon}</span>
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((label, idx) => (
          <span
            key={`${title}-${idx}`}
            className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 bg-gray-50"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
