import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPost, getFeedPosts, likePost } from "../../services/postService";
import type { PostDto } from "../../types/api";

export interface PostsState {
  posts: PostDto[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  likeStatus: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  error: string | null;
  createError: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  createStatus: "idle",
  likeStatus: {},
  error: null,
  createError: null,
};

export const loadFeedPosts = createAsyncThunk<PostDto[], void, { rejectValue: string }>(
  "posts/loadFeedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedPosts();
      return response.data?.data ?? response.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to load feed posts.");
    }
  },
);

export const createFeedPost = createAsyncThunk<PostDto, { content: string }, { rejectValue: string }>(
  "posts/createFeedPost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createPost(payload);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to publish post.");
    }
  },
);

export const likeFeedPost = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/likeFeedPost",
  async (postId, { rejectWithValue }) => {
    try {
      await likePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to like post.");
    }
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeedPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadFeedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(loadFeedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load feed posts.";
      })
      .addCase(createFeedPost.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createFeedPost.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (action.payload) {
          state.posts.unshift(action.payload);
        }
      })
      .addCase(createFeedPost.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to publish post.";
      })
      .addCase(likeFeedPost.pending, (state, action) => {
        state.likeStatus[action.meta.arg] = "loading";
      })
      .addCase(likeFeedPost.fulfilled, (state, action) => {
        state.likeStatus[action.payload] = "succeeded";
      })
      .addCase(likeFeedPost.rejected, (state, action) => {
        if (action.meta.arg) {
          state.likeStatus[action.meta.arg] = "failed";
        }
        state.error = action.payload || "Unable to like the post.";
      });
  },
});

export default postsSlice.reducer;
