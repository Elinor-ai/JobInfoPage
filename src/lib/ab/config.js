// src/lib/ab/config.js

// Global sticky user id cookie (shared across all design programs)
export const GLOBAL_USER_ID_COOKIE = "design:uid";

// A stable identifier for your multi-version program
export const PROGRAM_ID = "designs_v1";

// Main program with 3–4+ designs. Tweak variants & weights here.
export const experiments = [
  {
    id: PROGRAM_ID,
    variants: ["light", "panel", "classic"],

    // Weighted allocation (any positive numbers; proportional split)
    allocation: { light: 1, panel: 1, classic: 1 },

    // Assignment strategy:
    // - "weightedHash" (recommended): stable by userId, respects weights
    // - "randomWeighted": random first-visit using weights
    // - "hashUserId": uniform across N variants (ignores weights)
    assignmentStrategy: "weightedHash",

    // Cookie names used by middleware and server components
    cookieNames: {
      userId: GLOBAL_USER_ID_COOKIE,
      variant: `${PROGRAM_ID}:variant`,
    },

    // Enable QA override like ?design=compact
    urlOverride: { enabled: true, param: "design" },

    // Expiries
    cookieMaxAgeDays: 180,
    redisTtlDays: 365,
  },
];

// Optional: token for the admin force-assign endpoint
export const ADMIN_TOKEN = process.env.DESIGN_ADMIN_TOKEN || null;
