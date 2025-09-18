import { NextResponse } from "next/server";
import jobRepo from "@/lib/jobRepository";

export async function GET(_req, { params }) {
  try {
    const job = await jobRepo.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
  }
}