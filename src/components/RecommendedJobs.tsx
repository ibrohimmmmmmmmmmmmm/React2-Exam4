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
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Recommended jobs</h2>
      </div>

      {status === "loading" ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-28 rounded-3xl bg-slate-100 p-4" />
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
              <div key={jobId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title || job.name || "New role"}</p>
                    <p className="mt-1 text-sm text-slate-500">{getCompany(job)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                </div>
                <div className="mb-4 space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {getLocation(job)}</p>
                  <p className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5" /> {getSalary(job)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`job/${jobId}`)}
                  className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  disabled={!jobId}
                >
                  View details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
