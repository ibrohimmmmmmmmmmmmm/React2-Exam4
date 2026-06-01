import { useState } from "react";
import { UserCircle2, Briefcase, MapPin, Mail } from "lucide-react";
import type { ProfileDto, UserDto } from "../types/api";

interface CandidateProfileCardProps {
  user: UserDto | null;
  profile: ProfileDto | null;
  applicationsCount: number;
  publishedPostsCount: number;
  savedJobsCount: number | null;
  isLoading: boolean;
  error: string | null;
}

export default function CandidateProfileCard({
  user,
  profile,
  applicationsCount,
  publishedPostsCount,
  savedJobsCount,
  isLoading,
  error,
}: CandidateProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Candidate";

  const specialization =
    profile?.specialization || profile?.title || user?.role || "Product Designer";

  const location = profile?.location || [profile?.city, profile?.country].filter(Boolean).join(", ") || "Remote";

  const avatarUrl =
    user?.avatar ||
    user?.avatarUrl ||
    user?.photo ||
    user?.profilePicture ||
    "";

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-slate-100">
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                <UserCircle2 className="h-10 w-10" />
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{fullName}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Briefcase className="h-4 w-4" />
              {specialization}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="h-4 w-4" />
            {user?.email || "Email unavailable"}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        </div>

        {error && (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : (
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Applied jobs</span>
              <span className="font-semibold text-slate-900">{applicationsCount}</span>
            </div>
            {savedJobsCount !== null && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Saved jobs</span>
                <span className="font-semibold text-slate-900">{savedJobsCount}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Published posts</span>
              <span className="font-semibold text-slate-900">{publishedPostsCount}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
