import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { RootState } from "../../store";
import FeedPostCard from "../../components/FeedPostCard";
import { loadFeedPosts } from "../../features/posts/postsSlice";

export default function Account() {
  const profileState = useAppSelector((state: RootState) => state.profile);
  const postsState = useAppSelector((state: RootState) => state.posts);

  const [tab, setTab] = useState<"overview" | "saved" | "liked">("overview");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    if (t === "saved" || t === "liked" || t === "overview") {
      setTab(t);
    }
  }, [location.search]);

  const dispatch = useAppDispatch();
  const savedIds = upsertLocalList("savedPosts");
  const likedIds = upsertLocalList("likedPosts");

  const savedPosts = postsState.posts.filter((p) => savedIds.includes(String(p.id ?? p._id ?? "")));
  const likedPosts = postsState.posts.filter((p) => likedIds.includes(String(p.id ?? p._id ?? "")));
  const activePosts = tab === "saved" ? savedPosts : tab === "liked" ? likedPosts : [];
  const featuredPost = activePosts[0];

  const featuredAuthor = featuredPost?.author ?? featuredPost?.user ?? featuredPost?.postedBy ?? {};
  const featuredAuthorName =
    featuredAuthor?.fullName ||
    [featuredAuthor?.firstName, featuredAuthor?.lastName].filter(Boolean).join(" ") ||
    featuredAuthor?.email ||
    "Candidate";
  const featuredImage = (featuredPost as any)?.imageUrl ?? (featuredPost as any)?.image ?? null;
  const featuredContent = featuredPost?.content ?? featuredPost?.text ?? featuredPost?.description ?? "";

  useEffect(() => {
    if (!postsState.posts.length) {
      dispatch(loadFeedPosts());
    }
  }, [dispatch, postsState.posts.length]);

  const fullName =
    profileState.user?.fullName || [profileState.user?.firstName, profileState.user?.lastName].filter(Boolean).join(" ") || profileState.user?.email || "You";

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-[1080px] space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-900/10 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border-2 border-white/20 bg-white/10 shadow-xl">
                {profileState.user?.avatar || profileState.user?.avatarUrl || profileState.user?.photo ? (
                  <img
                    src={profileState.user.avatar || profileState.user.avatarUrl || profileState.user.photo}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-3xl font-bold text-white/90">
                    {(fullName || "").charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Candidate profile</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">{fullName}</h1>
                <p className="mt-1 max-w-xl text-sm leading-7 text-slate-300">
                  {profileState.profile?.headline || profileState.profile?.title || "Build a beautiful portfolio, manage saved posts, and see your most liked AI career moments."}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-4 sm:max-w-md sm:grid-cols-3 lg:w-auto lg:grid-cols-3">
              <div className="rounded-[24px] bg-white/10 p-4 text-center backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Saved</p>
                <p className="mt-3 text-2xl font-semibold text-white">{savedPosts.length}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 text-center backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Liked</p>
                <p className="mt-3 text-2xl font-semibold text-white">{likedPosts.length}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 text-center backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Posts</p>
                <p className="mt-3 text-2xl font-semibold text-white">{postsState.posts.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Your account</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Personal dashboard</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTab("overview")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "overview" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("saved")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "saved" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Saved ({savedPosts.length})
              </button>
              <button
                onClick={() => setTab("liked")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "liked" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Liked ({likedPosts.length})
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
            {tab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-[28px] bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">About you</h3>
                  <p className="text-sm text-slate-600">{profileState.profile?.headline || "Write a short bio about your professional skills, interests, and what type of AI roles you’re looking for."}</p>
                  <div className="grid gap-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-500">Email</span>
                      <span>{profileState.user?.email || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-500">Location</span>
                      <span>{profileState.profile?.location || profileState.profile?.city || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-500">Specialization</span>
                      <span>{profileState.profile?.specialization || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-[28px] bg-gradient-to-br from-blue-600 to-sky-500 p-6 text-white shadow-lg">
                  <h3 className="text-lg font-semibold">Your profile summary</h3>
                  <p className="text-sm leading-7 text-slate-100">Keep your account dashboard strong by saving top posts, liking the content that inspires you, and sharing your own AI updates with the network.</p>
                  <div className="grid gap-3 pt-4 text-sm">
                    <div className="rounded-3xl bg-white/10 px-4 py-3">
                      <p className="text-slate-200">Saved publications</p>
                      <p className="text-2xl font-semibold text-white">{savedPosts.length}</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 px-4 py-3">
                      <p className="text-slate-200">Liked posts</p>
                      <p className="text-2xl font-semibold text-white">{likedPosts.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(tab === "saved" || tab === "liked") && (
              <div className="space-y-6">
                <div className="rounded-[32px] bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{tab === "saved" ? "Saved publications" : "Liked posts"}</p>
                      <h3 className="mt-3 text-2xl font-semibold leading-tight">
                        {tab === "saved" ? "Your curated collection" : "Your favorite moments"}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                        {tab === "saved"
                          ? "Keep your most inspiring job posts and career stories in one elegant place."
                          : "Review the ideas you liked most and return to them whenever you need inspiration."
                        }
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-white/10 px-4 py-4 text-center">
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Count</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{activePosts.length}</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 px-4 py-4 text-center">
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Posts</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{postsState.posts.length}</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 px-4 py-4 text-center">
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Saved by you</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{savedPosts.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {activePosts.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                    {tab === "saved"
                      ? "You haven’t saved any posts yet. Tap the bookmark icon on any post to keep it here."
                      : "No liked posts yet. Like something to see it here."
                    }
                  </div>
                ) : (
                  <div className="space-y-6">
                    {featuredPost && (
                      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
                        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                          {featuredImage ? (
                            <div className="relative bg-slate-100">
                              <img src={String(featuredImage)} alt="Featured post" className="h-full w-full object-cover" />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 text-white">
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Featured</p>
                                <h4 className="mt-2 text-xl font-semibold">{featuredAuthorName}</h4>
                              </div>
                            </div>
                          ) : (
                            <div className="flex min-h-[240px] items-center justify-center bg-slate-100 p-10 text-slate-500">
                              <span className="text-sm uppercase tracking-[0.32em]">Featured saved post</span>
                            </div>
                          )}

                          <div className="p-6">
                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Top pick</p>
                            <h4 className="mt-3 text-2xl font-semibold text-slate-900">{featuredAuthorName}</h4>
                            <p className="mt-4 text-sm leading-7 text-slate-700 line-clamp-4">{featuredContent || "A top publication from your collection captured here for quick access."}</p>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{featuredPost.createdAt ? new Date(featuredPost.createdAt).toLocaleDateString() : "Recent"}</span>
                              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{featuredPost.commentsCount ?? 0} comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {activePosts.slice(1).map((post) => (
                        <FeedPostCard key={String(post.id ?? post._id ?? Math.random())} post={post} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function upsertLocalList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
