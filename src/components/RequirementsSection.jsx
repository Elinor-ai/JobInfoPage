// app/components/RequirementsSection.jsx
export default function RequirementsSection({
  requirements,                // { mustHave, niceToHave, skills, education, certifications, languages, experience }
  sectionTitle = null,
  emptyStateText = "No requirements listed.",
}) {
  const r = requirements || {};
  const hasLists =
    (r.mustHave && r.mustHave.length) ||
    (r.niceToHave && r.niceToHave.length) ||
    (r.skills && r.skills.length) ||
    (r.education && r.education.length) ||
    (r.certifications && r.certifications.length) ||
    (r.languages && r.languages.length) ||
    (r.experience && r.experience.length);

  const Chip = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 mr-2 mb-2">
      {children}
    </span>
  );

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      {sectionTitle && <h3 className="text-xl font-bold text-gray-800 mb-4">{sectionTitle}</h3>}

      {!hasLists && <p className="text-sm text-gray-500">{emptyStateText}</p>}

      {r.mustHave?.length > 0 && (
        <div className="mb-5">
          <h4 className="font-semibold text-gray-800 mb-2">Must-have</h4>
          <ul className="list-disc pl-5 space-y-1">
            {r.mustHave.map((item, i) => <li key={`must-${i}`} className="text-sm text-gray-700">{item}</li>)}
          </ul>
        </div>
      )}

      {r.niceToHave?.length > 0 && (
        <div className="mb-5">
          <h4 className="font-semibold text-gray-800 mb-2">Nice to have</h4>
          <ul className="list-disc pl-5 space-y-1">
            {r.niceToHave.map((item, i) => <li key={`nice-${i}`} className="text-sm text-gray-700">{item}</li>)}
          </ul>
        </div>
      )}

      {(r.skills?.length || r.education?.length || r.certifications?.length || r.languages?.length || r.experience?.length) ? (
        <div className="grid md:grid-cols-2 gap-5">
          {r.skills?.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Skills</h5>
              <div>{r.skills.map((s, i) => <Chip key={`skill-${i}`}>{s}</Chip>)}</div>
            </div>
          )}
          {r.education?.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Education</h5>
              <div>{r.education.map((e, i) => <Chip key={`edu-${i}`}>{e}</Chip>)}</div>
            </div>
          )}
          {r.certifications?.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Certifications</h5>
              <div>{r.certifications.map((c, i) => <Chip key={`cert-${i}`}>{c}</Chip>)}</div>
            </div>
          )}
          {r.languages?.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Languages</h5>
              <div>{r.languages.map((l, i) => <Chip key={`lang-${i}`}>{l}</Chip>)}</div>
            </div>
          )}
          {r.experience?.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Experience</h5>
              <div>{r.experience.map((x, i) => <Chip key={`exp-${i}`}>{x}</Chip>)}</div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
