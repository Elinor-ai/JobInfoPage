// // src/app/jobs/page.js
// import { redirect } from "next/navigation";
// import { jobs } from "@/data/jobData";

// const getId = (j) => String(j?.id ?? j?._id?.$oid ?? j?._id ?? "");
// export default function Jobs({ searchParams }) {
//  { redirect("/jobs/68a5cdf8b7709270df12feb6"); }
//   const q = (searchParams?.q ?? '').toString();
//   const l = (searchParams?.l ?? '').toString();

//   return (
//     <main className="mx-auto max-w-5xl p-4">
//       <h1 className="text-2xl font-bold mb-4">Job results</h1>

//       <p className="text-gray-600 mb-6">
//         Showing results for <span className="font-semibold">{q || 'Any job'}</span>
//         {l ? <> in <span className="font-semibold">{l}</span></> : null}
//       </p>

//       {/* TODO: render your actual results here.
//           For now this proves the route works. */}
//       <div className="rounded border p-4">
//         <p>Implement your results list here…</p>
//       </div>
//     </main>
//   );
// }

// app/jobs/page.js
import { redirect } from "next/navigation";
import { jobs } from "@/app/data/jobData"

const getId = (j) => String(j?.id ?? j?._id?.$oid ?? j?._id ?? "");
export default function Jobs() {
  redirect(`/jobs/${getId(jobs[0])}`);
}
