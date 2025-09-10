"use client";

import { useMemo, useState } from "react";

function stripHtmlToText(htmlString = "") {
  // Remove tags, collapse whitespace, decode a few common entities
  return String(htmlString)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getJobDescription(job) {
  const fromHtml = stripHtmlToText(job?.original_body || "");
  if (fromHtml) return fromHtml;
  return String(job?.body || "").replace(/\s+/g, " ").trim();
}

export default function JobDescriptionSection({ job, title = "Job Description" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionText = useMemo(() => getJobDescription(job), [job]);

  if (!descriptionText) return null;

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

      <div className="relative">
        <p
          className="text-gray-700 text-sm leading-6"
          style={
            isExpanded
              ? {}
              : {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,          
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
          }
        >
          {descriptionText}
        </p>

        {!isExpanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Read less" : "Read more"}
      </button>
    </section>
  );
}