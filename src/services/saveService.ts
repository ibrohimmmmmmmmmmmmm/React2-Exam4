import axiosRequest from "./axiosRequest";

export const savePost = async (postId: string) => {
  try {
    const res = await axiosRequest.post(`/Post/${postId}/save`);
    // persist locally so client remembers saves across reloads
    try {
      const raw = localStorage.getItem("savedPosts");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(postId)) {
        arr.push(postId);
        localStorage.setItem("savedPosts", JSON.stringify(arr));
      }
    } catch {}
    return res;
  } catch (error: any) {
    if (error.response?.status === 404 || !error.response) {
      // fallback to localStorage
      try {
        const raw = localStorage.getItem("savedPosts");
        const arr: string[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(postId)) {
          arr.push(postId);
          localStorage.setItem("savedPosts", JSON.stringify(arr));
        }
        return { data: { saved: true } } as any;
      } catch (e) {
        throw error;
      }
    }
    throw error;
  }
};

export const unsavePost = async (postId: string) => {
  try {
    const res = await axiosRequest.post(`/Post/${postId}/unsave`);
    try {
      const raw = localStorage.getItem("savedPosts");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const idx = arr.indexOf(postId);
      if (idx !== -1) {
        arr.splice(idx, 1);
        localStorage.setItem("savedPosts", JSON.stringify(arr));
      }
    } catch {}
    return res;
  } catch (error: any) {
    if (error.response?.status === 404 || !error.response) {
      try {
        const raw = localStorage.getItem("savedPosts");
        const arr: string[] = raw ? JSON.parse(raw) : [];
        const idx = arr.indexOf(postId);
        if (idx !== -1) {
          arr.splice(idx, 1);
          localStorage.setItem("savedPosts", JSON.stringify(arr));
        }
        return { data: { saved: false } } as any;
      } catch (e) {
        throw error;
      }
    }
    throw error;
  }
};

// Try to probe backend for saved status. Returns { saved: boolean } or throws.
export const checkSavedStatus = async (postId: string) => {
  const endpoints = [
    `/Post/${postId}/saved`,
    `/Post/${postId}/isSaved`,
    `/Post/${postId}/status`,
    `/Post/${postId}`,
  ];
  for (const ep of endpoints) {
    try {
      const res = await axiosRequest.get(ep);
      const data = res?.data ?? res;
      // common shapes
      if (data?.saved === true || data?.saved === false) return { saved: !!data.saved };
      if (data?.isSaved === true || data?.isSaved === false) return { saved: !!data.isSaved };
      if (data?.data?.saved === true || data?.data?.saved === false) return { saved: !!data.data.saved };
      // fallback: if returned post includes array of savers length etc
      if (Array.isArray(data)) {
        // maybe it's a list of saved post ids
        return { saved: data.includes(postId) };
      }
    } catch (e) {
      // ignore 404s and try next
    }
  }
  throw new Error("No saved-status endpoint available");
};
