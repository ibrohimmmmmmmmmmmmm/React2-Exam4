import { Heart, MessageSquare, Share2, ThumbsUp, UserCircle2, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../store";
import { addFeedComment, likeFeedPost, loadPostComments, addLocalComment, EMPTY_COMMENTS } from "../features/posts/postsSlice";
import type { PostDto } from "../types/api";
import { savePost, unsavePost, checkSavedStatus } from "../services/saveService";
import { getImageUrl } from "../utils/image";
import { useToast } from "./Toast/ToastProvider";

interface FeedPostCardProps {
  post: PostDto;
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
  const dispatch = useAppDispatch();
  const postId = String(post.id ?? post._id ?? "");
  const likeStatus = useAppSelector((state: RootState) => state.posts.likeStatus[postId]);
  const comments = useAppSelector((state: RootState) => state.posts.commentsByPost[postId] ?? EMPTY_COMMENTS);
  const commentsStatus = useAppSelector((state: RootState) => state.posts.commentsStatus[postId] ?? "idle");
  const commentCreateStatus = useAppSelector((state: RootState) => state.posts.createCommentStatus[postId] ?? "idle");
  const profileUser = useAppSelector((state: RootState) => state.profile.user);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const toast = useToast();
  const [savingAnim, setSavingAnim] = useState(false);

  const author = post.author ?? post.user ?? post.postedBy ?? {};
  const authorName =
    author.fullName || [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email || "Candidate";

  const content = post.content ?? post.text ?? post.description ?? "";
  const createdAt = post.createdAt ?? (post as any).created_at ?? "";
  const resolveImage = (p: any): string | null => {
    if (!p) return null;
    const candidates = [
      p.imageUrl,
      p.image,
      p.photo,
      p.photoUrl,
      p.image_url,
      p.media,
      p.mediaUrl,
      p.attachments,
      p.files,
      p.photos,
    ];

    for (const c of candidates) {
      if (!c) continue;
      if (typeof c === "string" && c.trim()) return c;
      if (typeof c === "object") {
        if (Array.isArray(c) && c.length) {
          const first = c[0];
          if (typeof first === "string") return first;
          if (first?.url) return first.url;
          if (first?.path) return first.path;
        }
        if (c.url) return c.url;
        if (c.path) return c.path;
      }
    }

    return null;
  };

  const image = resolveImage(post as any);
  const imageSrc = image ? getImageUrl(image) ?? image : null;

  const handleLike = () => {
    if (postId) {
      dispatch(likeFeedPost(postId));
      try {
        const raw = localStorage.getItem("likedPosts");
        const arr: string[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(postId)) {
          arr.push(postId);
          localStorage.setItem("likedPosts", JSON.stringify(arr));
        }
      } catch {}
      toast.push("You liked the post", "success");
    }
  };

  const handleToggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !postId) return;
    try {
      setCommentError(null);
      await dispatch(addFeedComment({ postId, content: commentText.trim() })).unwrap();
      setCommentText("");
      toast.push("Comment posted", "success");
    } catch (error: any) {
      const msg = error?.message || error || "Unable to post comment.";
      setCommentError(msg);
      toast.push(msg, "error");
      // optimistic local fallback
      try {
        const fallback = {
          id: `local-${Date.now()}`,
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          author: { fullName: profileUser?.fullName || profileUser?.email || "You" },
        };
        dispatch(addLocalComment({ postId, comment: fallback }));
        setCommentText("");
        toast.push("Comment added locally", "info");
      } catch {}
    }
  };

  useEffect(() => {
    if (commentsOpen && comments.length === 0 && postId) {
      dispatch(loadPostComments(postId));
    }
  }, [commentsOpen, comments.length, dispatch, postId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedPosts");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      setSaved(arr.includes(postId));
    } catch {
      setSaved(false);
    }
  }, [postId]);

  const toggleSave = () => {
    (async () => {
      try {
        if (!saved) {
          await savePost(postId);
          setSaved(true);
          setSavingAnim(true);
          // show undo toast
          toast.push("Saved to your list", "success", "Undo", async () => {
            try {
              await unsavePost(postId);
              setSaved(false);
            } catch {
              // fallback local
              const raw = localStorage.getItem("savedPosts");
              const arr: string[] = raw ? JSON.parse(raw) : [];
              const idx = arr.indexOf(postId);
              if (idx !== -1) {
                arr.splice(idx, 1);
                localStorage.setItem("savedPosts", JSON.stringify(arr));
                setSaved(false);
              }
            }
          });
          window.setTimeout(() => setSavingAnim(false), 450);
        } else {
            await unsavePost(postId);
            setSaved(false);
            setSavingAnim(true);
            toast.push("Removed from saved", "info");
            // start polling backend to confirm removal (attempts every 3s up to 5 tries)
            (async function pollRemoval() {
              const attempts = 5;
              const interval = 3000;
              for (let i = 0; i < attempts; i++) {
                try {
                  const status = await checkSavedStatus(postId);
                  if (status && status.saved === false) {
                    toast.push("Unsaved synced with server", "success");
                    break;
                  }
                } catch (e) {
                  // no endpoint available; rely on local state
                  break;
                }
                // wait
                await new Promise((r) => setTimeout(r, interval));
              }
            })();
            window.setTimeout(() => setSavingAnim(false), 450);
        }
      } catch (e) {
        // fallback local toggle
        try {
          const raw = localStorage.getItem("savedPosts");
          const arr: string[] = raw ? JSON.parse(raw) : [];
          const idx = arr.indexOf(postId);
          if (idx === -1) {
            arr.push(postId);
            localStorage.setItem("savedPosts", JSON.stringify(arr));
            setSaved(true);
            setSavingAnim(true);
            toast.push("Saved to your list", "success", "Undo", () => {
              const raw2 = localStorage.getItem("savedPosts");
              const arr2: string[] = raw2 ? JSON.parse(raw2) : [];
              const idx2 = arr2.indexOf(postId);
              if (idx2 !== -1) {
                arr2.splice(idx2, 1);
                localStorage.setItem("savedPosts", JSON.stringify(arr2));
                setSaved(false);
              }
            });
            window.setTimeout(() => setSavingAnim(false), 450);
          } else {
            arr.splice(idx, 1);
            localStorage.setItem("savedPosts", JSON.stringify(arr));
            setSaved(false);
            setSavingAnim(true);
            toast.push("Removed from saved", "info");
            window.setTimeout(() => setSavingAnim(false), 450);
          }
        } catch {}
      }
    })();
  };

  return (
    <article className="relative rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
      {/* Saved badge overlay */}
      {saved && (
        <div className="absolute right-4 top-4 z-40 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
          <Bookmark className="h-4 w-4 text-blue-600" />
          Saved
        </div>
      )}
      <header className="flex items-center gap-4 rounded-t-[32px] bg-slate-50 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 overflow-hidden">
          {(author.avatar || author.avatarUrl || (author.photo as string)) ? (
            <img
              src={getImageUrl(author.avatar || author.avatarUrl || (author.photo as string)) ?? (author.avatar || author.avatarUrl || (author.photo as string))}
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-7 w-7" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{authorName}</h3>
          <p className="text-xs text-slate-500">
            {createdAt
              ? new Date(createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Just now"}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Network
        </span>
      </header>

          {imageSrc && (
        <div className="relative overflow-hidden rounded-b-[32px] bg-slate-100">
          <img
            src={String(imageSrc)}
            alt="post image"
            loading="lazy"
            className="w-full max-h-[520px] object-cover"
          />
          {/* shine/pulse overlay when saved */}
          {savingAnim && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/0 mix-blend-screen animate-pulse" />
              <div className="relative h-24 w-24 rounded-full bg-white/20 shadow-xl animate-ping" />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 p-5">
        <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{content}</p>

        <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Heart className="h-4 w-4" />
              </span>
              <span className="font-semibold text-slate-900">{(post as any).likeCount ?? (post as any).likes ?? 0} likes</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="font-semibold text-slate-900">{post.commentsCount ?? comments.length ?? 0} comments</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleLike}
              disabled={!postId}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
            >
              <ThumbsUp className="h-4 w-4 text-blue-600" />
              Like
            </button>
            <button
              type="button"
              onClick={handleToggleComments}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <MessageSquare className="h-4 w-4 text-slate-600" />
              Comment
            </button>
              <button
                type="button"
                onClick={toggleSave}
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 ${saved ? "ring-1 ring-blue-100" : ""}`}
              >
                {saved ? (
                  // filled bookmark SVG
                  <svg className={`h-4 w-4 ${savingAnim ? "scale-110" : ""} transition-transform duration-200`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5304 5.61406 21.8325 6.03345 21.4982L12 16.618L17.9666 21.4982C18.386 21.8325 19 21.5304 19 21V3C19 2.44772 18.5523 2 18 2H6Z" />
                  </svg>
                ) : (
                  <Bookmark className={`h-4 w-4 ${savingAnim ? "scale-110" : ""} transition-transform duration-200`} />
                )}
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                disabled
              >
                <Share2 className="h-4 w-4 text-slate-600" />
                Share
              </button>
          </div>
        </div>

        {likeStatus === "loading" && <p className="text-sm text-slate-500">Updating reactions…</p>}

        {commentsOpen && (
          <div className="mt-5 rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Post comments</p>
                <p className="text-sm text-slate-500">Everyone can read and add replies in real time.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                {comments.length} shown
              </span>
            </div>

            {commentsStatus === "loading" ? (
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="h-20 rounded-[28px] bg-slate-50 p-4 shadow-sm" />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No comments yet. Be first to share your thought.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const commentAuthor = comment.author ?? comment.user ?? comment.postedBy ?? {};
                  const commentAuthorName =
                    commentAuthor.fullName || [commentAuthor.firstName, commentAuthor.lastName].filter(Boolean).join(" ") || commentAuthor.email || "Anonymous";
                  return (
                    <div key={String(comment.id ?? comment._id ?? comment.createdAt ?? Math.random())} className="rounded-[28px] border border-slate-100 bg-slate-50 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                          <UserCircle2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{commentAuthorName}</span>
                            <span className="text-xs text-slate-500">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Now"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{comment.content ?? comment.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm text-slate-600">Add a comment everyone can see.</div>
              {commentError && <p className="mb-3 text-sm text-rose-600">{commentError}</p>}
              <textarea
                rows={3}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a message..."
                className="w-full resize-none rounded-[28px] border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Your reply will appear for everyone in the network.</p>
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || commentCreateStatus === "loading"}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Post comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
