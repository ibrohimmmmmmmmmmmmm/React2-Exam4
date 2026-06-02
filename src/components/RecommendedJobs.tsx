import { useNavigate } from "react-router-dom";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import type { JobDto } from "../types/api";

interface RecommendedJobsProps {
  jobs: JobDto[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export default function RecommendedJobs({ jobs, status, error }: RecommendedJobsProps) {
  const navigate = useNavigate();

  const getCompany = (job: JobDto) =>
    job.companyName || job.organizationName || job.name || "Employer";

  const getLocation = (job: JobDto) =>
    job.location || [job.city, job.country].filter(Boolean).join(", ") || "Remote";

  const getSalary = (job: JobDto) => {
    if (job.salary) return job.salary;
    if (job.salaryRange) return job.salaryRange;
    if (job.minSalary || job.maxSalary) {
      return `${job.minSalary ?? "-"} - ${job.maxSalary ?? "-"}`;
    }
    return "Market rate";
  };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-xl shadow-slate-200/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recommended</p>
          <h2 className="text-xl font-semibold text-slate-900">Jobs for you</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          AI match
        </span>
      </div>

      {status === "loading" ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-28 rounded-[28px] bg-slate-100 p-4" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm text-rose-600">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No recommended jobs available right now.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {jobs.slice(0, 4).map((job) => {
            const jobId = String(job.id ?? job._id ?? "");
            return (
              <div key={jobId} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title || job.name || "New role"}</p>
                    <p className="mt-1 text-sm text-slate-500">{getCompany(job)}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="mb-4 space-y-2 text-sm text-slate-500">
                  <p className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                    <MapPin className="h-4 w-4" />
                    {getLocation(job)}
                  </p>
                  <p className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                    <DollarSign className="h-4 w-4" />
                    {getSalary(job)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`job/${jobId}`)}
                  className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  disabled={!jobId}
                >
                  View details
                </button>
              </div>
            );
          })}
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Want more matches?</p>
            <p className="mt-2">Update your preferences or profile to fine-tune AI job recommendations.</p>
          </div>
        </div>
      )}
    </section>
  );
}
