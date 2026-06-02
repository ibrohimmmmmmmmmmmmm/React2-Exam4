import axiosRequest from "./axiosRequest";

export const getFeedPosts = async () => axiosRequest.get("/Post/feed");
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
    return await axiosRequest.post(`/Post/${postId}/comment`, data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return await axiosRequest.post(`/Comment`, { postId, ...data });
    }
    throw error;
  }
};
