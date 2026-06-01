import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../store";
import { createFeedPost, loadFeedPosts } from "../features/posts/postsSlice";
import type { UserDto } from "../types/api";

interface CreatePostCardProps {
  user: UserDto | null;
}

export default function CreatePostCard({ user }: CreatePostCardProps) {
  const dispatch = useAppDispatch();
  const { createStatus, createError } = useAppSelector((state: RootState) => state.posts);
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = content.trim().length > 0 && createStatus !== "loading";

  useEffect(() => {
    if (createStatus === "succeeded") {
      setSuccessMessage("Your post was published.");
      const timer = window.setTimeout(() => setSuccessMessage(""), 3000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [createStatus]);

  const handlePublish = async () => {
    if (!canSubmit) return;
    try {
      await dispatch(createFeedPost({ content: content.trim() })).unwrap();
      setContent("");
      dispatch(loadFeedPosts());
    } catch {
      // error is handled by slice state
    }
  };

  const authorName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Your profile";

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Share your latest update</p>
            <p className="text-sm text-slate-500">{authorName}, tell your network what you’re building.</p>
          </div>
        </div>

        <textarea
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your experience, achievements, skills, certifications, projects or career updates..."
          className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />

        {createError && (
          <p className="text-sm text-rose-600">{createError}</p>
        )}

        {successMessage && (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Your post will appear in the candidate feed.</p>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>
    </section>
  );
}
