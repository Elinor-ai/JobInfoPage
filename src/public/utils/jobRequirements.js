// utils/jobRequirements.js

// --- Public API ---
export function getRequirementsFromJob(job) {
  const originalHtml = String(job?.original_body || "");
  const plainBody = String(job?.body || "");

  // 1) Pull structured items from HTML sections if available
  const mustHaveFromHtml = getListFromHtml(originalHtml, /Essential Requirements|Requirements/i);
  const niceToHaveFromHtml = getListFromHtml(originalHtml, /Desirable Qualifications|Desirable|Nice to have/i);

  // 2) Fallbacks: derive bullets from the plain text body
  const mustHaveFromBody = mustHaveFromHtml.length
    ? []
    : deriveBulletsAfterLabel(plainBody, /Essential Requirements|Requirements/i);

  const niceToHaveFromBody = niceToHaveFromHtml.length
    ? []
    : deriveBulletsAfterLabel(plainBody, /Desirable Qualifications|Desirable|Nice to have/i);

  // 3) Metadata-driven chips
  const skills = collectSkills(job);
  const education = collectEducation(job);
  const certifications = collectCertifications(job);
  const languages = collectLanguages(job);
  const experience = collectExperience(job);

  return {
    mustHave: dedupe([...mustHaveFromHtml, ...mustHaveFromBody]),
    niceToHave: dedupe([...niceToHaveFromHtml, ...niceToHaveFromBody]),
    skills,
    education,
    certifications,
    languages,
    experience,
  };
}

// --- Helpers ---

function getListFromHtml(html, headingRegex) {
  if (!html) return [];
  // Find the section that starts with a heading label and the nearest <ul> that follows
  const sectionRegex = new RegExp(
    `${headingRegex.source}[\\s\\S]*?<ul[\\s\\S]*?>([\\s\\S]*?)</ul>`,
    headingRegex.flags?.includes("i") ? headingRegex.flags : `${headingRegex.flags || ""}i`
  );
  const match = html.match(sectionRegex);
  if (!match) return [];
  const listHtml = match[1] || "";
  const items = [...listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
    humanize(trimHtml(m[1]))
  );
  return items.filter(Boolean);
}

function deriveBulletsAfterLabel(text, labelRegex) {
  if (!text) return [];
  const idx = text.search(labelRegex);
  if (idx === -1) return [];

  // Capture a window after the label and split into bullet-like chunks
  const windowText = text.slice(idx, idx + 1200);

  // Try to split by typical bullet separators
  const pieces = windowText
    .replace(/\r/g, "\n")
    .split(/[\n•\-–\u2022]/g)
    .map((s) => s.trim())
    .filter((s) => s && s.length > 2);

  // Skip the first piece if it’s just the label itself
  if (pieces.length && labelRegex.test(pieces[0])) pieces.shift();

  // Keep the first ~8 plausible bullets
  return pieces.slice(0, 8).map(humanize);
}

function collectSkills(job) {
  const fromV2 = (job?.job_metadata_v2?._skillsTags || []).map((it) =>
    humanize(it?.tag || it)
  );
  const fromV1 = (job?.job_metadata?._requiredSkills || []).map(humanize);
  return dedupe([...fromV2, ...fromV1]).slice(0, 12);
}

function collectEducation(job) {
  const values =
    job?.job_metadata_v2?._educationQualificationTags ||
    job?.job_metadata?._educationQualificationTags ||
    [];
  return values.map(humanizeTag).slice(0, 6);
}

function collectCertifications(job) {
  const values =
    job?.job_metadata_v2?._alternativeQualificationTags ||
    job?.job_metadata?._alternativeQualificationTags ||
    [];
  return values.map(humanizeTag).slice(0, 6);
}

function collectLanguages(job) {
  let values =
    job?.job_metadata_v2?._languageRequirements ??
    job?.job_metadata?._languageRequirements ??
    [];
  if (typeof values === "string") {
    const v = values.toLowerCase();
    if (v === "none" || v === "cant_determine") return [];
    values = [values];
  }
  return (values || []).map(humanize);
}

function collectExperience(job) {
  const tags = job?.job_metadata_v2?._ExperienceLevelTags || [];
  const level = job?.job_metadata_v2?._jobLevel || job?.job_metadata?._jobLevel;
  const combined = [...tags, level].filter(Boolean).map(humanize);
  return dedupe(combined);
}

function humanizeTag(tag) {
  if (!tag) return "";
  // e.g., "bachelor:building_surveying" => "Bachelor – Building Surveying"
  const [prefix, rest] = String(tag).split(":");
  if (!rest) return humanize(tag);
  return `${startCase(prefix)} – ${startCase(rest)}`;
}

function humanize(text) {
  if (!text) return "";
  // small html entity cleanup
  const cleaned = String(text)
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned;
}

function trimHtml(html) {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function startCase(str) {
  return String(str)
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function dedupe(arr) {
  const set = new Set();
  const out = [];
  for (const item of arr) {
    const key = item?.toLowerCase?.() || item;
    if (!set.has(key) && item) {
      set.add(key);
      out.push(item);
    }
  }
  return out;
}
