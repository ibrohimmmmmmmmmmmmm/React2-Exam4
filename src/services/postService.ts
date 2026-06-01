import axiosRequest from "./axiosRequest";

export const getFeedPosts = async () => axiosRequest.get("/Post/feed");
export const createPost = async (data: { content: string }) => axiosRequest.post("/Post", data);
export const likePost = async (postId: string) => axiosRequest.post(`/Post/${postId}/like`);
