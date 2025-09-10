'use client';
export default function JobVitals({ jobData, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Job Snapshot</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {children}
      </div>
    </div>
  );
}
