import { MessageSquare, Share2, ThumbsUp, UserCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../store";
import { likeFeedPost } from "../features/posts/postsSlice";
import type { PostDto } from "../types/api";

interface FeedPostCardProps {
  post: PostDto;
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
  const dispatch = useAppDispatch();
  const likeStatus = useAppSelector((state: RootState) => state.posts.likeStatus[post.id ?? post._id ?? ""]);

  const author = post.author ?? post.user ?? post.postedBy ?? {};
  const authorName =
    author.fullName || [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email || "Candidate";

  const content = post.content ?? post.text ?? post.description ?? "";
  const createdAt = post.createdAt ?? (post as any).created_at ?? "";

  const handleLike = () => {
    const postId = String(post.id ?? post._id ?? "");
    if (postId) {
      dispatch(likeFeedPost(postId));
    }
  };

  return (
    <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
          {author.avatar || author.avatarUrl || author.photo ? (
            <img
              src={author.avatar || author.avatarUrl || author.photo}
              alt={authorName}
              className="h-full w-full rounded-3xl object-cover"
            />
          ) : (
            <UserCircle2 className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{authorName}</h3>
              <p className="text-sm text-slate-500">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Just now"}
              </p>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{content}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <button
          type="button"
          onClick={handleLike}
          disabled={!post.id && !post._id}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ThumbsUp className="h-4 w-4" />
          Like
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100"
          disabled
        >
          <MessageSquare className="h-4 w-4" />
          Comment
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100"
          disabled
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {likeStatus === "loading" && (
        <p className="mt-3 text-sm text-slate-500">Liking post…</p>
      )}
    </article>
  );
}
