import axiosRequest from "./axiosRequest";

export const savePost = async (postId: string) => {
  try {
    return await axiosRequest.post(`/Post/${postId}/save`);
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
    return await axiosRequest.post(`/Post/${postId}/unsave`);
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
