import { useState } from "react";
import { getImageUrl } from "../utils/image";
import { UserCircle2, MapPin, Mail } from "lucide-react";
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

  const avatarUrlRaw =
    user?.avatar ||
    user?.avatarUrl ||
    user?.photo ||
    user?.profilePicture ||
    "";
  const avatarUrl = getImageUrl(avatarUrlRaw) || "";

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
      <div className="space-y-6 p-6">
        <div className="rounded-[28px] bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white shadow-inner shadow-sky-200/30">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-white ring-1 ring-white/40">
              {avatarUrl && !imageError ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-full w-full rounded-3xl object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserCircle2 className="h-8 w-8" />
              )}
            </div>
            <div>
              <p className="text-xl font-semibold">{fullName}</p>
              <p className="mt-1 text-sm text-slate-100/90">{specialization}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-[28px] bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2 text-slate-500">
            <Mail className="h-4 w-4" />
            {user?.email || "Email unavailable"}
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        </div>

        {error && (
          <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
          <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
              <span className="text-slate-500">Applied jobs</span>
              <span className="text-base font-semibold text-slate-900">{applicationsCount}</span>
            </div>
            {savedJobsCount !== null && (
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <span className="text-slate-500">Saved jobs</span>
                <span className="text-base font-semibold text-slate-900">{savedJobsCount}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
              <span className="text-slate-500">Published posts</span>
              <span className="text-base font-semibold text-slate-900">{publishedPostsCount}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
