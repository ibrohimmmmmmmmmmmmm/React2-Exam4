import axiosRequest from "./axiosRequest";

export const getFeedPosts = async () => {
  try {
    return await axiosRequest.get("/Post/feed");
  } catch (error: any) {
    // fallback to generic posts endpoint
    return await axiosRequest.get("/Post");
  }
};
export const createPost = async (data: { content: string }) => axiosRequest.post("/Post", data);
export const likePost = async (postId: string) => axiosRequest.post(`/Post/${postId}/like`);

export const getPostComments = async (postId: string) => {
  try {
    return await axiosRequest.get(`/Post/${postId}/comments`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return await axiosRequest.get(`/Post/${postId}/comment`);
    }
    throw error;
  }
};

export const createPostComment = async (postId: string, data: { content: string }) => {
  try {
    // backend expects plural 'comments' endpoint
    return await axiosRequest.post(`/Post/${postId}/comments`, data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      // try singular or fallback
      try {
        return await axiosRequest.post(`/Post/${postId}/comment`, data);
      } catch (e: any) {
        if (e.response?.status === 404) {
          return await axiosRequest.post(`/Comment`, { postId, ...data });
        }
        throw e;
      }
    }
    throw error;
  }
};
