import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  getFeedPosts,
  getPostComments,
  createPostComment as createPostCommentService,
  likePost,
} from "../../services/postService";
import type { CommentDto, PostDto } from "../../types/api";

export interface PostsState {
  posts: PostDto[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  likeStatus: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  commentsStatus: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  createCommentStatus: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  commentsByPost: Record<string, CommentDto[]>;
  error: string | null;
  createError: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  createStatus: "idle",
  likeStatus: {},
  commentsStatus: {},
  createCommentStatus: {},
  commentsByPost: {},
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

export const loadPostComments = createAsyncThunk<CommentDto[], string, { rejectValue: string }>(
  "posts/loadPostComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getPostComments(postId);
      return response.data?.data ?? response.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to load comments.");
    }
  },
);

export const addFeedComment = createAsyncThunk<{
  postId: string;
  comment: CommentDto;
},
  { postId: string; content: string },
  { rejectValue: string }
>(
  "posts/addFeedComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await createPostCommentService(postId, { content });
      const comment = response.data?.data ?? response.data;
      return { postId, comment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to add comment.");
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
        const postId = action.payload;
        state.likeStatus[postId] = "succeeded";
        const post = state.posts.find((item) => String(item.id ?? item._id) === postId);
        if (post) {
          if (typeof post.likeCount === "number") {
            post.likeCount += 1;
          } else if (typeof post.likes === "number") {
            post.likes += 1;
          } else {
            post.likeCount = 1;
          }
        }
      })
      .addCase(likeFeedPost.rejected, (state, action) => {
        if (action.meta.arg) {
          state.likeStatus[action.meta.arg] = "failed";
        }
        state.error = action.payload || "Unable to like the post.";
      })
      .addCase(loadPostComments.pending, (state, action) => {
        state.commentsStatus[action.meta.arg] = "loading";
        state.error = null;
      })
      .addCase(loadPostComments.fulfilled, (state, action) => {
        state.commentsStatus[action.meta.arg] = "succeeded";
        const postId = action.meta.arg;
        state.commentsByPost[postId] = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(loadPostComments.rejected, (state, action) => {
        state.commentsStatus[action.meta.arg] = "failed";
        state.error = action.payload || "Failed to load comments.";
      })
      .addCase(addFeedComment.pending, (state, action) => {
        state.createCommentStatus[action.meta.arg.postId] = "loading";
        state.error = null;
      })
      .addCase(addFeedComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.createCommentStatus[postId] = "succeeded";
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }
        state.commentsByPost[postId].push(comment);
        const post = state.posts.find((item) => String(item.id ?? item._id) === postId);
        if (post) {
          if (typeof post.commentsCount === "number") {
            post.commentsCount += 1;
          } else {
            post.commentsCount = 1;
          }
        }
      })
      .addCase(addFeedComment.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        state.createCommentStatus[postId] = "failed";
        state.error = action.payload || "Unable to add comment.";
      });
  },
});

export default postsSlice.reducer;
