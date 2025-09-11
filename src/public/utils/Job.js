import { jobs } from "@/app/data/jobData";

/**
 * Centralized job data model:
 * - Public instance getters return already-normalized values
 * - Static "FromRecord" extractors do the heavy parsing
 * - Private helpers (prefixed #) handle HTML, strings, paths, and tags
 */
export default class Job {
  /* =========================
   * Constructor & instance API
   * ========================= */
  constructor(jobId, job) {
    this.id = jobId;
    this.job = job || {};
    this.title = job?.title || "";
    this.url = job?.url || "";
    this.company = job?.company || "";
    this.body = job?.body || "";
    this.original_body = job?.original_body || "";
  }

  // ---- Instance getters (normalized) ----
  getDescription() {
    const fromHtml = Job.#stripHtmlToText(this.original_body || "");
    if (fromHtml) return fromHtml;
    return String(this.body || "").replace(/\s+/g, " ").trim();
  }

  getSalary() {
    return (
      this.job?.salary_range ??
      this.job?.salary ??
      this.job?.compensation ??
      this.job?.pay ??
      ""
    );
  }

  getLocation() {
    return (
      this.job?.location ||
      [this.job?.city, this.job?.state || this.job?.region, this.job?.country]
        .filter(Boolean)
        .join(", ")
    );
  }

  getLogo() {
    return this.job?.logo || "https://placehold.co/56x56/eef2f7/667085?text=Logo";
  }

  getBenefits() {
    return Job.getBenefitsFromRecord(this.job);
  }

  getRequirements() {
    return Job.getRequirementsFromRecord(this.job);
  }

  getContractTimeLabel() {
    return Job.getContractTimeLabelFromRecord(this.job);
  }

  getHoursPerWeek() {
    return Job.getHoursPerWeekFromRecord(this.job);
  }

  getSpecialFlags() {
    return Job.getSpecialFlagsFromRecord(this.job);
  }

  getTeaser(maxChars = 420) {
    // teaser of the already-normalized description
    return Job.#clampParagraph(this.getDescription(), maxChars);
  }

  getPostedAgo() {
  // tries several date fields commonly present in your data
    const d = Job.#coerceToDate(
      this.job?.date_posted ||
      this.job?.db_inserted_at?.$date ||
      this.job?.last_update_time?.$date
    );
    return Job.#postedAgo(d);
  }

  /* =========
   * Lookups
   * ========= */
  static findJobByRouteId(routeId) {
    const rid = String(routeId).trim();
    const list = Array.isArray(jobs) ? jobs : [];
    const item =
      list.find(
        (j) =>
          j &&
          j._id &&
          typeof j._id.$oid === "string" &&
          j._id.$oid === rid
      ) || null;
    return item ? new Job(routeId, item) : null;
  }

  /* ==============================
   * Static extractors (by record)
   * ============================== */
  static #clampParagraph(text, maxChars = 420) {
  const t = String(text || "").trim();
  if (t.length <= maxChars) return t;
  const slice = t.slice(0, maxChars);
  const lastStop = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? ")
  );
  if (lastStop > 200) return slice.slice(0, lastStop + 1).trim();
  return slice.replace(/\s+\S*$/, "").trim() + "…";
}



static #postedAgo(dateLike) {
  if (!dateLike) return null;
  const posted = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(+posted)) return null;
  const days = Math.max(0, Math.round((Date.now() - posted.getTime()) / 86400000));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  return `Posted ${days} days ago`;
}

static #coerceToDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && "$date" in value) return new Date(value.$date);
  return new Date(value);
}
  static getBenefitsFromRecord(jobRecord = {}) {
    // 1) Structured
    const v2 = jobRecord?.job_metadata_v2?._benefits;
    if (Array.isArray(v2) && v2.length) return Job.#normalizeUniqueStrings(v2);

    const v1 = jobRecord?.job_metadata?._benefits;
    if (Array.isArray(v1) && v1.length) return Job.#normalizeUniqueStrings(v1);

    // 2) From HTML <p>Benefits: …</p>
    const fromHtml = Job.#extractBenefitsFromHtmlParagraph(String(jobRecord?.original_body || ""));
    if (fromHtml.length) return fromHtml;

    // 3) Fallback: labeled text in plain body
    const fromPlain = Job.#extractBenefitsFromPlainText(String(jobRecord?.body || ""));
    if (fromPlain.length) return fromPlain;

    return [];
  }

  static getRequirementsFromRecord(job = {}) {
  const originalHtml = String(job?.original_body || "");
  const plainBody    = String(job?.body || "");

  // 1) Try HTML lists first
  const MUST_LABEL = /(Essential Requirements|Requirements)/i;
  const NICE_LABEL = /(Desirable Qualifications|Desirable|Nice to have)/i;
  const COMMON_STOPS = [/(Key Responsibilities|Role Overview|What to do Next|Benefits|Apply Now)/i];

  const mustHaveFromHtml   = Job.#getListFromHtml(originalHtml, MUST_LABEL);
  const niceToHaveFromHtml = Job.#getListFromHtml(originalHtml, NICE_LABEL);

  // 2) Bullet-like fallbacks from plain text
  const mustHaveFromBody = mustHaveFromHtml.length
    ? []
    : Job.#deriveBulletsAfterLabel(plainBody, MUST_LABEL);

  const niceToHaveFromBody = niceToHaveFromHtml.length
    ? []
    : Job.#deriveBulletsAfterLabel(plainBody, NICE_LABEL);

  // 3) NEW: sentence fallback if we still have nothing for a section
  const mustHaveFromSentences =
    mustHaveFromHtml.length || mustHaveFromBody.length
      ? []
      : Job.#deriveSentencesAfterLabel(plainBody, MUST_LABEL, COMMON_STOPS);

  const niceToHaveFromSentences =
    niceToHaveFromHtml.length || niceToHaveFromBody.length
      ? []
      : Job.#deriveSentencesAfterLabel(plainBody, NICE_LABEL, COMMON_STOPS);

  // 4) Tags / metadata chips
  const skills         = Job.#collectSkills(job);
  const education      = Job.#collectEducation(job);
  const certifications = Job.#collectCertifications(job);
  const languages      = Job.#collectLanguages(job);
  const experience     = Job.#collectExperience(job);

  return {
    mustHave: Job.#normalizeUniqueStrings([
      ...mustHaveFromHtml,
      ...mustHaveFromBody,
      ...mustHaveFromSentences,   // 👈 fallback added
    ]),
    niceToHave: Job.#normalizeUniqueStrings([
      ...niceToHaveFromHtml,
      ...niceToHaveFromBody,
      ...niceToHaveFromSentences, // 👈 fallback added
    ]),
    skills,
    education,
    certifications,
    languages,
    experience,
  };
}

  static getContractTimeLabelFromRecord(job = {}) {
    const raw =
      job?.contract_time ??
      job?.contract_type ??
      job?.contractTime ??
      job?.employment_time ??
      job?.employmentTime ??
      job?.job_time ??
      job?.jobTime ??
      null;

    if (!raw) return null;

    const normalized = String(raw).toLowerCase().replace(/[_-]+/g, " ");
    if (normalized.includes("full")) return "Full Time";
    if (normalized.includes("part")) return "Part Time";
    return Job.#startCase ? Job.#startCase(normalized) : normalized.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  static getHoursPerWeekFromRecord(job = {}) {
    // Direct numeric/field reads
    let hours =
      job?.hours_per_week ??
      job?.hoursPerWeek ??
      job?.job_metadata_v2?.hours_per_week ??
      job?.job_metadata_v2?.hoursPerWeek ??
      null;

    if (typeof hours === "number") return hours > 0 ? hours : null;

    // Strings like "37.5" or "35-40"
    if (typeof hours === "string") {
      const m = hours.match(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?/);
      if (m) return Number(m[2] ?? m[1]);
    }

    // Fallback: scan text
    const text = (Job.#stripHtmlToText(String(job?.original_body || "")) || "") + " " + String(job?.body || "");
    const m2 = text.match(/(\d+(?:\.\d+)?)\s*(?:hours|hrs)\s*\/?\s*(?:week|wk)/i);
    if (m2) return Number(m2[1]);

    return null;
  }

  static getSpecialFlagsFromRecord(job = {}) {
    const isGig = Job.#resolveBoolFromPaths(job, [
      "job_metadata_v2._isGig",
      "_isGig",
      "isGig",
      "job_flags.isGig",
    ]);

    const isHybridBool = Job.#resolveBoolFromPaths(job, [
      "job_metadata_v2._isHybrid",
      "_isHybrid",
      "isHybrid",
      "job_flags.isHybrid",
    ]);

    // Inferred hybrid from work environment
    const env = Job.#getByPath(job, "job_metadata_v2._workEnvironment") || [];
    const envVals = Array.isArray(env) ? env.map(String).map((s) => s.toLowerCase()) : [];
    const isHybridEnv = envVals.includes("home-office") && (envVals.includes("office") || envVals.includes("client-site"));
    const isHybrid = isHybridBool || isHybridEnv;

    const isTemporary = Job.#resolveBoolFromPaths(job, [
      "job_metadata_v2._isTemp",
      "_isTemp",
      "isTemp",
      "isTemporary",
      "job_flags.isTemp",
      "job_flags.isTemporary",
    ]);

    const isImmediateStart = Job.#resolveBoolFromPaths(job, [
      "job_metadata_v2._isImmediateStart",
      "_isImmediateStart",
      "isImmediateStart",
      "job_flags.isImmediateStart",
    ]);

    const isManagement = Job.#resolveBoolFromPaths(job, [
      "job_metadata_v2._isManagement",
      "_isManagement",
      "isManagement",
      "job_flags.isManagement",
    ]);

    return { gig: isGig, hybrid: isHybrid, temporary: isTemporary, immediateStart: isImmediateStart, management: isManagement };
  }

  /* ===========================
   * Private helpers: HTML/text
   * =========================== */

  static #stripHtmlToText(htmlString = "") {
    return String(htmlString)
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  static #extractBenefitsFromHtmlParagraph(htmlString = "") {
    if (!htmlString) return [];
    const match = htmlString.match(/<p[^>]*>[\s\S]*?Benefits:([\s\S]*?)<\/p>/i);
    if (!match) return [];
    const text = String(match[1]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const parts = text.split(/\s*,\s*|\s+and\s+/i).map((t) => t.trim());
    return Job.#normalizeUniqueStrings(parts);
  }

  static sentencesFromRequirementText(text = "") {
  const flat =
    (this.#stripHtmlToText ? this.#stripHtmlToText(String(text)) : String(text))
      .replace(/\s+/g, " ")
      .trim();

  if (!flat) return [];

  const parts = flat.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g);

  return parts
    .map(s =>
      s
        .trim()
        .replace(/^[\-\u2022•\s]+/, "")
        .replace(/\s+([,;:])/g, "$1")
    )
    .map(s => s.replace(/\s+$/g, ""))
    .map(s => s.replace(/\s*[.!?]+$/g, "."))
    .filter(s => s.length > 2);
}

static #sliceAfterLabelUntilNext(text = "", startRx, stopRxs = []) {
  if (!text) return "";
  const lower = String(text);
  const startIdx = lower.search(startRx);
  if (startIdx === -1) return "";

  const after = lower.slice(startIdx);
  let end = after.length;

  for (const rx of stopRxs) {
    const m = after.search(rx);
    if (m !== -1 && m < end) end = m;
  }
  return after.slice(0, end);
}

// Fallback: sentences split for a labeled section.
static #deriveSentencesAfterLabel(text = "", labelRx, stopRxs = []) {
  const chunk = this.#sliceAfterLabelUntilNext(text, labelRx, stopRxs);
  return this.sentencesFromRequirementText(chunk);
}

  static #extractBenefitsFromPlainText(bodyText = "") {
    if (!bodyText) return [];
    const lower = bodyText.toLowerCase();
    const label = "benefits:";
    const startIndex = lower.indexOf(label);
    if (startIndex === -1) return [];

    const after = bodyText.slice(startIndex + label.length);

    const stopLabels = [
      "role overview:",
      "key responsibilities:",
      "essential requirements:",
      "desirable qualifications:",
      "what to do next:",
    ];
    let endIndex = after.length;
    for (const stop of stopLabels) {
      const i = after.toLowerCase().indexOf(stop);
      if (i !== -1 && i < endIndex) endIndex = i;
    }

    const chunk = after.slice(0, endIndex);
    const parts = chunk
      .split(/\s*,\s*|\s+and\s+/i)
      .map((t) => t.replace(/[.;]+$/g, "").trim());
    return Job.#normalizeUniqueStrings(parts);
  }

  static #getListFromHtml(html = "", headingRegex) {
    if (!html) return [];
    const flags = headingRegex.flags?.includes("i") ? headingRegex.flags : `${headingRegex.flags || ""}i`;
    const rx = new RegExp(`${headingRegex.source}[\\s\\S]*?<ul[\\s\\S]*?>([\\s\\S]*?)</ul>`, flags);
    const match = html.match(rx);
    if (!match) return [];
    const listHtml = match[1] || "";
    const items = [...listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
      Job.#humanize(Job.#stripHtmlToText(m[1]))
    );
    return items.filter(Boolean);
  }

  static #deriveBulletsAfterLabel(text = "", labelRegex) {
  if (!text) return [];

  // 1) find the labeled section
  const startIdx = text.search(labelRegex);
  if (startIdx === -1) return [];

  // take a safe window after the label
  const after = text.slice(startIdx);
  // strip the label header like "Essential Requirements:" if present
  const afterSansLabel = after.replace(/^[^\n:]{0,80}:\s*/i, "");
  const windowText = afterSansLabel.slice(0, 1200);

  // 2) try bullet/newline splits
  const pieces = windowText
    .replace(/\r/g, "\n")
    .split(/[\n•\-–\u2022]/g)           // typical bullets & newlines
    .map((s) => s.trim())
    .filter((s) => s && s.length > 2);

  // If the very first piece still looks like the label, drop it
  if (pieces.length && labelRegex.test(pieces[0])) pieces.shift();

  // 3) if we have 2+ meaningful pieces, treat them as bullets
  const bulletish = pieces.filter((s) => s.length > 4);
  if (bulletish.length >= 2) {
    return bulletish.slice(0, 8).map(Job.#humanize);
  }

  // 4) Fallback: split the same chunk into sentences
  const sentences = Job.sentencesFromRequirementText(windowText);
  return sentences.slice(0, 8);
}
  /* =======================================
   * Private helpers: metadata collectors
   * ======================================= */

  static #collectSkills(job) {
    const fromV2 = (job?.job_metadata_v2?._skillsTags || []).map((it) => Job.#humanize(it?.tag || it));
    const fromV1 = (job?.job_metadata?._requiredSkills || []).map(Job.#humanize);
    return Job.#normalizeUniqueStrings([...fromV2, ...fromV1]).slice(0, 12);
  }

  static #collectEducation(job) {
    const values =
      job?.job_metadata_v2?._educationQualificationTags ??
      job?.job_metadata?._educationQualificationTags ??
      [];
    return values.map(Job.#humanizeTag).slice(0, 6);
  }

  static #collectCertifications(job) {
    const values =
      job?.job_metadata_v2?._alternativeQualificationTags ??
      job?.job_metadata?._alternativeQualificationTags ??
      [];
    return values.map(Job.#humanizeTag).slice(0, 6);
  }

  static #collectLanguages(job) {
    let values =
      job?.job_metadata_v2?._languageRequirements ??
      job?.job_metadata?._languageRequirements ??
      [];
    if (typeof values === "string") {
      const v = values.toLowerCase();
      if (v === "none" || v === "cant_determine") return [];
      values = [values];
    }
    return (values || []).map(Job.#humanize);
  }

  static #collectExperience(job) {
    const tags = job?.job_metadata_v2?._ExperienceLevelTags || [];
    const level = job?.job_metadata_v2?._jobLevel || job?.job_metadata?._jobLevel;
    const combined = [...tags, level].filter(Boolean).map(Job.#humanize);
    return Job.#normalizeUniqueStrings(combined);
  }

  /* =============================
   * Private helpers: strings/etc
   * ============================= */

  static #normalizeUniqueStrings(items = []) {
    const seenLower = new Set();
    const result = [];
    for (const raw of items) {
      const value = String(raw ?? "").trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (seenLower.has(key)) continue;
      seenLower.add(key);
      result.push(value);
    }
    return result;
  }

  static #humanizeTag(tag) {
    if (!tag) return "";
    const [prefix, rest] = String(tag).split(":");
    if (!rest) return Job.#humanize(tag);
    return `${Job.#startCase(prefix)} – ${Job.#startCase(rest)}`;
  }

  static #humanize(text) {
    if (!text) return "";
    return String(text)
      .replace(/&amp;/gi, "&")
      .replace(/&nbsp;/gi, " ")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  static #startCase(str) {
    return String(str)
      .replace(/[_\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  }

  /* ===========================
   * Private helpers: path/bool
   * =========================== */

  static #getByPath(obj, path) {
    return String(path)
      .split(".")
      .reduce((cur, key) => (cur != null ? cur[key] : undefined), obj);
  }

  static #normalizeBool(val) {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val !== 0;
    if (typeof val === "string") {
      const v = val.trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(v)) return true;
      if (["false", "0", "no", "n"].includes(v)) return false;
    }
    return Boolean(val);
  }

  static #resolveBoolFromPaths(job, paths = []) {
    for (const p of paths) {
      const v = Job.#getByPath(job, p);
      if (v !== undefined && v !== null && Job.#normalizeBool(v)) return true;
    }
    return false;
  }
}
