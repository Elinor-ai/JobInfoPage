// public/utils/Job.js
export default class Job {
  constructor(jobId, jobRecord) {
    this.id = jobId ?? jobRecord?._id?.$oid ?? null;
    this.raw = jobRecord || {};
    this.v2 = this.raw?.job_metadata_v2 || {};
  }

  /* ------------------------- basic getters ------------------------- */
  getTitle() {
    return this.raw?.title || "";
  }
  getCompany() {
    return this.raw?.company || "";
  }
  getUrl() {
    return this.raw?.url || "#";
  }
  getLogo() {
    return this.raw?.logo ? String(this.raw.logo) : null;
  }
  getBody() {
    return String(this.raw?.body || "");
  }

  getLocation() {
    const city = this.raw?.city || null;
    const state = this.raw?.state || null;
    const merged = [city, state].filter(Boolean).join(", ");
    return merged || this.raw?.location || "";
  }
  isImmediateStart() {
    return this.v2?._isImmediateStart === true;
  }

  /* --------------------------- salary ------------------------------ */
  getSalary() {
    // Prefer v2 salary, fall back to top-level salary
    const sourceSalary = this.v2?._salary ?? this.raw?.salary ?? null;
    if (sourceSalary == null) return null;

    const normalizedText = String(sourceSalary).trim();
    if (!normalizedText) return null;

    // Strings that mean “no usable salary”
    const normalizedLower = normalizedText.toLowerCase();
    const INVALID_MARKERS = new Set([
      "cant_determine",
      "cannot_determine",
      "n/a",
    ]);
    if (INVALID_MARKERS.has(normalizedLower)) return null;

    // Otherwise, return the clean string for display
    return normalizedText;
  }

  /* ------------------------ benefits & flags ------------------------ */
  getBenefits() {
    const arr = Array.isArray(this.v2?._benefits) ? this.v2._benefits : [];
    return arr
      .map((b) => (typeof b === "string" ? b.trim() : String(b ?? "").trim()))
      .filter(Boolean);
  }

  getEntryLevelLabel() {
    const raw = this.v2?._jobLevel ?? this.raw?.job_metadata?._jobLevel ?? null;
    if (!raw) return null;
    const norm = String(raw).trim().toLowerCase().replace(/[-_]/g, " ");
    if (norm === "entry level" || norm === "entrylevel" || norm === "entry") {
      return "Entry Level";
    }
    return null;
  }

  /* --------------------------- booleans ----------------------------- */
  #trueV2Bools() {
    const trueBooleanFlags = {};
    const v2metadata = this.v2 || {};

    for (const [fieldName, fieldValue] of Object.entries(v2metadata)) {
      if (!fieldName.startsWith("_is")) continue;
      if (fieldValue === true) {
        const normalizedFlagName = fieldName.replace(/^_/, "");
        trueBooleanFlags[normalizedFlagName] = true;
      } // _isHybrid -> isHybrid
    }
    return trueBooleanFlags;
  }

  getWorkStyle() {
    const f = this.#trueV2Bools();
    if (f.isFullyRemote) return "Fully Remote";
    if (f.isHybrid) return "Hybrid";
    return "";
  }

  getJobType() {
    const ct = this.raw?.contract_type;
    if (ct)
      return String(ct)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const f = this.#trueV2Bools();
    if (f.isPartTime) return "Part-time";
    return "";
  }

  getHighlights() {
    const LABELS = {
      isPartTime: "Part-time",
      isHybrid: "Hybrid working",
      isNoExperience: "No experience required",
      isGig: "Gig job",
      isTemp: "Temporary",
      isCustomerService: "Customer service",
      isImmediateStart: "Immediate start!",
      isManagement: "Management",
      isFullyRemote: "Remote",
    };
    const f = this.#trueV2Bools();
    const startCase = (s) =>
      String(s)
        .replace(/^is/, "")
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
    return Object.keys(f).map((k) => LABELS[k] || startCase(k));
  }

  /* --------------------------- posted ago --------------------------- */
  static #timeAgo(dateLike) {
    if (!dateLike) return null;
    const date = new Date(dateLike);
    if (Number.isNaN(+date)) return null;

    const secondsElapsed = Math.floor((Date.now() - date.getTime()) / 1000);
    const UNITS = [
      ["year", 31536000],
      ["month", 2592000],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];

    for (const [unitName, unitSecs] of UNITS) {
      const value = Math.floor(secondsElapsed / unitSecs);
      if (value >= 1) return `${value} ${unitName}${value > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  }

  getPostedAgo() {
    const candidateDate =
      this.raw?.date_posted ||
      this.raw?.inserted_db_at ||
      this.raw?.db_inserted_at?.$date ||
      null;

    const postedAt = candidateDate ? new Date(candidateDate) : null;
    if (!(postedAt instanceof Date) || Number.isNaN(+postedAt)) return null;

    // Hide if older than ~90 days
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
    const ageMs = Date.now() - postedAt.getTime();
    if (ageMs > NINETY_DAYS_MS) return null;

    return Job.#timeAgo(postedAt);
  }

  getWorkEnvironment() {
    const workEnvironmentRaw = this.v2?._workEnvironment;

    const normalizedList = Array.isArray(workEnvironmentRaw)
      ? workEnvironmentRaw
      : typeof workEnvironmentRaw === "string"
      ? [workEnvironmentRaw]
      : [];

    const uniqueLowerSet = new Set();
    const environments = [];
    for (const env of normalizedList) {
      const label = String(env ?? "").trim();
      if (!label) continue;
      const labelLower = label.toLowerCase();
      if (
        labelLower === "cant_determine" ||
        labelLower === "cannot_determine" ||
        labelLower === "none"
      )
        continue;

      if (uniqueLowerSet.has(labelLower)) continue;
      uniqueLowerSet.add(labelLower);
      environments.push(label);
    }

    return environments.length ? environments : null;
  }

  /* --------------------------- view model --------------------------- */
  toClassicViewModel() {
    const entryLevel = this.getEntryLevelLabel();
    return {
      id: this.id,
      title: this.getTitle(),
      company: this.getCompany(),
      logo: this.getLogo(),
      location: this.getLocation(),
      url: this.getUrl(),
      salary: this.getSalary(),
      workStyle: this.getWorkStyle(),
      isEntryLevel: this.getEntryLevelLabel(),
      workEnvironment: this.getWorkEnvironment(),
      jobType: this.getJobType(),
      bodyFull: this.getBody(),
      postedAgo: this.getPostedAgo(),
      highlights: this.getHighlights(),
      benefits: this.getBenefits(),
      ...(entryLevel ? { jobLevel: entryLevel } : {}),
      isImmediateStart: this.isImmediateStart(),
    };
  }
}
