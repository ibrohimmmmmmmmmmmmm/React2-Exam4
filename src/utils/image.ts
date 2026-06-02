export function getImageUrl(value?: string | null): string | null {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  // already absolute or data url
  if (/^https?:\/\//i.test(v) || /^data:/i.test(v)) return v;

  // use VITE_IMAGE_BASE_URL if provided
  const base = (import.meta.env.VITE_IMAGE_BASE_URL as string) || "";
  const cleanedBase = base.replace(/\/$/, "");
  const cleanedPath = v.replace(/^\//, "");
  if (cleanedBase) return `${cleanedBase}/${cleanedPath}`;
  return v;
}

export default { getImageUrl };
