import { useEffect, useState, useRef } from "react";
import { Send, Sparkles, ImageIcon, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../store";
import { createFeedPost, loadFeedPosts } from "../features/posts/postsSlice";
import { uploadPhoto } from "../services/uploadService";
import type { UserDto } from "../types/api";
import { useToast } from "./Toast/ToastProvider";

interface CreatePostCardProps {
  user: UserDto | null;
}

export default function CreatePostCard({ user }: CreatePostCardProps) {
  const dispatch = useAppDispatch();
  const { createStatus, createError } = useAppSelector((state: RootState) => state.posts);
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = content.trim().length > 0 && createStatus !== "loading";
  const toast = useToast();

  useEffect(() => {
    if (createStatus === "succeeded") {
      setSuccessMessage("Your post was published.");
      const timer = window.setTimeout(() => setSuccessMessage(""), 3000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [createStatus]);

  const resizeImageFile = async (file: File, maxSize = 1200, quality = 0.8) => {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(maxSize / bitmap.width, maxSize / bitmap.height, 1);
    if (ratio === 1) {
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Image resize failed"));
          }
        },
        file.type,
        quality
      );
    });
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleChooseImage = () => fileInputRef.current?.click();

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handlePublish = async () => {
    if (!canSubmit) return;
    try {
      const payload: any = { content: content.trim() };
      if (imageFile) {
        try {
          const fileToUpload = imageFile.size > 1600000 ? await resizeImageFile(imageFile) : imageFile;
          const uploadRes = await uploadPhoto(fileToUpload);
          const uploadedUrl = uploadRes?.data?.url ?? uploadRes?.data ?? uploadRes?.data?.data ?? null;
          if (typeof uploadedUrl === "string") {
            payload.imageUrl = uploadedUrl;
          }
        } catch (err) {
          // fallback: include small preview if upload failed (may still be large)
          if (imagePreview) payload.image = imagePreview;
        }
      }
      await dispatch(createFeedPost(payload)).unwrap();
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      dispatch(loadFeedPosts());
      toast.push("Post published", "success");
    } catch {
      // error handled by slice
    }
  };

  const handleSaveDraft = () => {
    try {
      const raw = localStorage.getItem("savedDrafts");
      const arr = raw ? JSON.parse(raw) : [];
      const entry = { id: `draft-${Date.now()}`, content, imagePreview, createdAt: new Date().toISOString() };
      arr.unshift(entry);
      localStorage.setItem("savedDrafts", JSON.stringify(arr));
      toast.push("Draft saved", "info");
    } catch {
      toast.push("Unable to save draft", "error");
    }
  };

  const authorName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Your profile";

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{authorName}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Post an update</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleChooseImage}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <ImageIcon className="h-4 w-4" />
            Add photo
          </button>
        </div>

        <textarea
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Tell the network what you're building or share a job opportunity..."
          className="min-h-[130px] w-full resize-none rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
        />

        {imagePreview && (
          <div className="relative mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
            <img src={imagePreview} alt="preview" className="h-52 w-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-slate-500">
            {createError ? (
              <p className="text-rose-600">{createError}</p>
            ) : successMessage ? (
              <p className="text-emerald-600">{successMessage}</p>
            ) : (
              <p>Your post will appear in the AI feed.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </section>
  );
}
