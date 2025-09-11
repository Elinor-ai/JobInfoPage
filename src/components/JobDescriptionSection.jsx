"use client";

import { useState } from "react";


export default function JobDescriptionSection({descriptionText}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!descriptionText) return null;

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>

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