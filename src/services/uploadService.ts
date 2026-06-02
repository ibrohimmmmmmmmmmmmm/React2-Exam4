import axiosRequest from "./axiosRequest";
import type { AxiosProgressEvent } from "axios";

export const uploadPhoto = async (file: File, onProgress?: (percent: number) => void) => {
  const form = new FormData();
  form.append("file", file);
  // Let the browser set the Content-Type including the boundary
  return axiosRequest.post("/Upload/photo", form, {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      try {
        if (!onProgress) return;
        const loaded = (progressEvent && (progressEvent.loaded as number)) || 0;
        const total = (progressEvent && (progressEvent.total as number)) || 0;
        if (!total) return;
        const percentCompleted = Math.round((loaded * 100) / total);
        onProgress(percentCompleted);
      } catch {}
    },
  });
};

export default { uploadPhoto };
