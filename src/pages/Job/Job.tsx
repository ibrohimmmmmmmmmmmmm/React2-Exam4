import { useEffect } from "react";
import CandidateProfileCard from "../../components/CandidateProfileCard";
import CreatePostCard from "../../components/CreatePostCard";
import FeedPostCard from "../../components/FeedPostCard";
import RecommendedJobs from "../../components/RecommendedJobs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { RootState } from "../../store";
import { loadCandidateProfile } from "../../features/profile/profileSlice";
import { loadFeedPosts } from "../../features/posts/postsSlice";
import { loadRecommendedJobs } from "../../features/jobs/jobsSlice";

export default function Job() {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state: RootState) => state.profile);
  const postsState = useAppSelector((state: RootState) => state.posts);
  const jobsState = useAppSelector((state: RootState) => state.jobs);

  const userId = String(
    profileState.user?.id ?? profileState.user?._id ?? profileState.user?.userId ?? ""
  );

  useEffect(() => {
    dispatch(loadCandidateProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadFeedPosts());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(loadRecommendedJobs(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="space-y-6">
            <CandidateProfileCard
              user={profileState.user}
              profile={profileState.profile}
              applicationsCount={profileState.applicationsCount}
              publishedPostsCount={postsState.posts.length}
              savedJobsCount={profileState.savedJobsCount}
              isLoading={profileState.isLoading}
              error={profileState.error}
            />
          </aside>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Candidate home</p>
                <h1 className="mt-2 font-semibold text-slate-900 md:text-3xl">Your AI-powered feed</h1>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {postsState.posts.length} posts
              </div>
            </div>

            <CreatePostCard user={profileState.user} />

            {postsState.status === "loading" ? (
              <div className="space-y-4">
                {[1, 2].map((index) => (
                  <div key={index} className="h-64 rounded-[32px] bg-slate-100" />
                ))}
              </div>
            ) : postsState.posts.length === 0 ? (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                No feed posts yet. Share an update to start the conversation.
              </div>
            ) : (
              <div className="space-y-6">
                {postsState.posts.map((post) => (
                  <FeedPostCard key={String(post.id ?? post._id ?? post.content ?? Math.random())} post={post} />
                ))}
              </div>
            )}

            {postsState.error && (
              <div className="rounded-[32px] border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                {postsState.error}
              </div>
            )}

            <div className="xl:hidden">
              <RecommendedJobs jobs={jobsState.jobs} status={jobsState.status} error={jobsState.error} />
            </div>
          </section>

          <aside className="hidden xl:block space-y-6">
            <RecommendedJobs jobs={jobsState.jobs} status={jobsState.status} error={jobsState.error} />
          </aside>
        </div>
      </div>
    </div>
  );
}
