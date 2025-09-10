"use client";

import { Shield, Facebook, Twitter, Linkedin } from "lucide-react";

/** Small rounded card that can render either text or an image logo */
function PartnerBadge({
  label,
  logoSrc,               // optional image URL; if omitted we render styled text
  textClassName = "",
  href = "#",
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-indigo-50/40 px-6 py-3 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50 transition"
      aria-label={label}
    >
      {logoSrc ? (
        // image path works without next/image config; swap to <Image> if you prefer
        <img
          src={logoSrc}
          alt={label}
          className="h-6 w-auto"
          onError={(event) => {
            // graceful fallback to text if image fails
            event.currentTarget.replaceWith(Object.assign(document.createElement("span"), {
              className: `text-sm font-semibold ${textClassName}`,
              textContent: label,
            }));
          }}
        />
      ) : (
        <span className={`text-sm font-semibold ${textClassName}`}>{label}</span>
      )}
    </a>
  );
}

export default function Footer() {
  // Partners (use logoSrc if you have files/domains set; otherwise text colors mimic the brands)
  const partnerList = [
    { label: "indeed", textClassName: "text-[#2164f4]" },
    { label: "neuvoo", textClassName: "text-[#25c7ff]" },
    { label: "CareerNow", textClassName: "text-[#c63eb0] italic" },
    { label: "adzuna", textClassName: "text-[#1ea55a]" },
  ];

  const navigationLinks = [
    { label: "Jobs", href: "#" },
    { label: "VIP package", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Unsubscribe", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms and Conditions", href: "#" },
  ];

  const socialLinks = [
    { label: "Facebook", icon: Facebook, href: "#" },
    { label: "Twitter", icon: Twitter, href: "#" },
    { label: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer
      className="
        relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen
      "
    >
      {/* Partners band */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span>OUR PARTNERS</span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {partnerList.map((partner) => (
              <div key={partner.label} className="flex items-center justify-center">
                <PartnerBadge {...partner} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient footer */}
      <div className="bg-gradient-to-b from-indigo-600 to-blue-800 text-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          {/* Top row: nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 py-4 text-sm font-semibold">
            {navigationLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white/85"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Bottom row: copyright left, social right */}
          <div className="flex items-center justify-between pb-5">
            <p className="text-sm text-white/90">
              All Rights Reserved to jobsbear ©
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm hover:opacity-95"
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
