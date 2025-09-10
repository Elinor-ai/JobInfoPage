export default function JobHeader({
  jobTitle,
  companyName,
  logoUrl,
  className = "",
}) {
  const resolvedLogoUrl =
    (logoUrl && logoUrl.trim()) ||
    "https://placehold.co/64x64/e2e8f0/475569?text=Logo";

  return (
    <header className={`flex items-center space-x-4 mb-6 mt-8 ${className}`}>
      <img
        src={resolvedLogoUrl}
        alt={`${companyName || "Company"} Logo`}
        className="w-16 h-16 rounded-lg object-contain border border-gray-200 bg-white"
      />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {jobTitle}
        </h1>
        <p className="text-md text-gray-500">{companyName}</p>
      </div>
    </header>
  );
}