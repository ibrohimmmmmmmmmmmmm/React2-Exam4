import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { JobDto } from "../types/api";

interface JobPostCardProps {
  job: JobDto;
}

export default function JobPostCard({ job }: JobPostCardProps) {
  const navigate = useNavigate();

  const company = job.companyName || job.organizationName || job.name || "Company";
  const title = job.title || job.name || "Job";
  const location = job.location || [job.city, job.country].filter(Boolean).join(", ") || "Remote";
  const salary = job.salary || job.salaryRange || (job.minSalary || job.maxSalary ? `${job.minSalary ?? "-"} - ${job.maxSalary ?? "-"}` : "Market rate");

  const jobId = String(job.id ?? job._id ?? "");

  const matchLabel = (job as any).matchScore ? `${(job as any).matchScore}% Match` : "AI Match";

  return (
    <article className="rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/30">
      <div className="p-5">
        <div className="flex flex-col gap-4 rounded-[28px] bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{company}</p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {matchLabel}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              <DollarSign className="h-4 w-4" />
              {salary}
            </span>
          </div>

          <p className="text-sm leading-7 text-slate-700">{job.description ?? "No description available."}</p>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`job/${jobId}`)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              disabled={!jobId}
            >
              <Briefcase className="h-4 w-4" />
              View role
            </button>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {job.type ?? "Full-time"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
