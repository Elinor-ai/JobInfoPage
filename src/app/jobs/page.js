
// app/jobs/page.js
import { redirect } from "next/navigation";
import { jobs } from "@/app/data/jobData"

const getId = (j) => String(j?.id ?? j?._id?.$oid ?? j?._id ?? "");
export default function Jobs() {
  redirect(`/jobs/${getId(jobs[0])}`);
}
