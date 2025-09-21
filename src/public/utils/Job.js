// Job.js
export default class Job {
  constructor(jobId, jobRecord) {
    this.id = jobId ?? jobRecord?._id?.$oid ?? null;
    this.job = jobRecord || {};
    this.v2 = this.job?.job_metadata_v2 || {};
  }

  // ---------- MUST-HAVE ----------
  getTitle() {
    return this.job?.title || "";
  }
  getBody() {
    return this.job?.body || "";
  }
  getCompany() {
    return this.job?.company || "";
  }

  // "city, state" or null
  getLocation() {
    const city = this.job?.city || null;
    const state = this.job?.state || null;
    return city || state ? [city, state].filter(Boolean).join(", ") : null;
  }

  // ---------- CONDITIONAL FIELDS ----------
  getInsertedDbAt() {
    const raw = this.job?.db_inserted_at?.$date || null;
    if (!raw) return null;
    const d = new Date(raw);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
      ? d.toISOString()
      : null;
  }

  static #normalizeSalary(val) {
    const s = String(val ?? "").trim();
    if (!s) return null;
    if (/^cant[_\s-]*determine$/i.test(s)) return null;
    if (/^(n\/a|na|none|null|not\s+specified|unspecified)$/i.test(s))
      return null;
    return s;
  }

  getSalary() {
    const raw = this.v2?._salary ?? this.job?.salary ?? null;
    return Job.#normalizeSalary(raw);
  }

  getLogo() {
    return this.job?.logo ? String(this.job.logo) : null;
  }
  // getSalary() { return this.v2?._salary || this.job?.salary || null; }
  getUrl() {
    return this.job?.url || "";
  }
  getBenefits() {
    return Array.isArray(this.v2?._benefits) ? this.v2._benefits : [];
  }

  // ---------- PRIVATE STATIC HELPERS ----------
  static #dedupeStrings(items = []) {
    const seen = new Set();
    const out = [];
    for (const raw of items) {
      const v = String(raw ?? "").trim();
      if (!v) continue;
      const k = v.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(v);
    }
    return out;
  }

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

  static #hasSalaryPeriod(s) {
    return /\b(per\s*(annum|year)|p\.?a\.?)\b/i.test(String(s || ""));
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

  // Collect ONLY true booleans from job_metadata_v2 that start with _is*
  getTrueV2Booleans() {
    const out = {};
    for (const [k, v] of Object.entries(this.v2 || {})) {
      if (!k.startsWith("_is")) continue;
      if (!Job.#normalizeBool(v)) continue;
      // _isPartTime -> isPartTime
      const normalizedKey = k.replace(/^_/, "");
      out[normalizedKey] = true;
    }
    return out;
  }

  // ---------- CONVENIENCE DERIVATIONS ----------
  getTeaserV2(max = 420) {
    return Job.#clampParagraph(this.getBody(), max);
  }

  getBenefitsLimited(limit = 5) {
    return Job.#dedupeStrings(this.getBenefits()).slice(0, limit);
  }

  getSalarySuffix() {
    const s = this.getSalary();
    if (!s) return "";
    return Job.#hasSalaryPeriod(s) ? "" : " p.a.";
  }

  static #sentences(text = "") {
    const flat = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!flat) return [];
    return flat
      .split(/(?<=[.!?])\s+(?=[A-Z0-9(])/g)
      .map((s) => s.replace(/^[\-\u2022•\s]+/, "").trim())
      .filter(Boolean);
  }

  // public: first N points from body
  getBodyPoints(limit = 3) {
    return Job.#sentences(this.getBody()).slice(0, limit);
  }

  // ---------- OUTPUT SHAPES ----------
  toSummaryV2() {
    return {
      id: this.id,
      title: this.getTitle(),
      body: this.getBody(),
      location: this.getLocation(),
      company: this.getCompany(),
      inserted_db_at: this.getInsertedDbAt(),
      logo: this.getLogo(),
      salary: this.getSalary(),
      url: this.getUrl(),
      benefits: this.getBenefits(),
      // spread all TRUE booleans from job_metadata_v2 (_is*)
      ...this.getTrueV2Booleans(),
    };
  }

  // UI-ready POJO for your classic layout
  toClassicViewModel() {
    const salary = this.getSalary();
    return {
      id: this.id,
      title: this.getTitle(),
      company: this.getCompany(),
      logo: this.getLogo(),
      location: this.getLocation(),

      bodyPoints: this.getBodyPoints(3),
      bodyFull: this.getBody(),

      salary: salary || "",
      salarySuffix: this.getSalarySuffix(),
      url: this.getUrl() || "#",
      isNewThisMonth: Boolean(this.getInsertedDbAt()),
      benefits: this.getBenefitsLimited(5),

      // include TRUE booleans (e.g., isPartTime, isHybrid, isNoExperience, …)
      ...this.getTrueV2Booleans(),
    };
  }
}
