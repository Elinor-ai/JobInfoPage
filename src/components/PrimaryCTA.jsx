"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * PrimaryCTA
 * - Renders a primary call-to-action as a Link (if href) or a Button (if onClick).
 * - Flexible props for label, width, icons, analytics data attributes, etc.
 */
export default function PrimaryCTA({
  label = "Quick Apply",
  href,                 // if provided -> renders a Link
  onClick,              // if provided (and no href) -> renders a Button
  fullWidth = true,
  icon: Icon,           // pass an icon component, e.g. lucide icon
  className = "",
  trackingId,
  jobId,
  jobTitle,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg shadow-lg " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 " +
    "transition-transform transform hover:scale-[1.02] active:scale-[0.99] " +
    "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed " +
    (fullWidth ? "w-full " : "") +
    "py-4 px-8 text-lg";

  if (href) {
    // Link mode (navigates to internal/external URL)
    return (
      <Link
        href={href}
        className={`${baseClasses} ${className}`}
        data-tracking-id={trackingId}
        data-job-id={jobId}
        aria-label={label}
      >
        {Icon ? <Icon className="w-5 h-5 mr-2" /> : null}
        <span>{label}</span>
      </Link>
    );
  }

  // Button mode (runs onClick)
  const handleClick = async (e) => {
    if (!onClick) return;
    try {
      setIsLoading(true);
      await onClick(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      disabled={isLoading}
      data-tracking-id={trackingId}
      data-job-id={jobId}
      aria-label={label}
      aria-busy={isLoading}
    >
      {isLoading ? (
        // tiny spinner
        <svg
          className="w-5 h-5 mr-2 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : null}
      <span>{isLoading ? "Processing…" : label}</span>
    </button>
  );
}