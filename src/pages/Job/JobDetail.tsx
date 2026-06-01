import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { RootState } from "../../store";
import { loadJobById } from "../../features/jobs/jobsSlice";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedJob, detailStatus, detailError } = useAppSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (jobId) {
      dispatch(loadJobById(jobId));
    }
  }, [dispatch, jobId]);

  const job = selectedJob;
  const company = job?.companyName || job?.organizationName || job?.name || "Company";
  const title = job?.title || job?.name || "Job details";
  const location = job?.location || [job?.city, job?.country].filter(Boolean).join(", ") || "Remote";
  const salary = job?.salary || job?.salaryRange || (job?.minSalary || job?.maxSalary ? `${job?.minSalary ?? "-"} - ${job?.maxSalary ?? "-"}` : "Market rate");
  const employmentType = job?.employmentType || job?.jobType || job?.type || "Full-time";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        {detailStatus === "loading" ? (
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-1/4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : detailError ? (
          <p className="text-sm text-rose-600">{detailError}</p>
        ) : !job ? (
          <p className="text-sm text-slate-500">Unable to load job details.</p>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <Briefcase className="h-4 w-4" />
                  {company}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <DollarSign className="h-4 w-4" />
                  {salary}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{employmentType}</span>
              </div>
            </div>

            <div className="space-y-4 text-slate-700">
              <h2 className="text-lg font-semibold text-slate-900">About this role</h2>
              <p className="whitespace-pre-line leading-7">{job.description || "Description is not available for this job."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
