import axiosRequest from "./axiosRequest";

export interface Conversation {
  id: number;
  participantId?: number;
  participantName?: string;
  participantAvatar?: string;
  lastMessage?: string;
  updatedAt?: string;
  // Fallback for generic DTOs
  [key: string]: any;
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  senderId?: number;
  createdAt: string;
  [key: string]: any;
}

export const chatService = {
  getAllOrganizations: async () => {
    const response = await axiosRequest.get(`/Organization?_t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" }
    });
    return response.data;
  },

  getConversations: async () => {
    const response = await axiosRequest.get(`/Conversation?_t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" }
    });
    return response.data;
  },

  createConversation: async (participantId: number) => {
    const response = await axiosRequest.post("/Conversation", { otherUserId: participantId });
    return response.data;
  },

  deleteConversation: async (id: number) => {
    const response = await axiosRequest.delete(`/Conversation/${id}`);
    return response.data;
  },

  getMessages: async (conversationId: number) => {
    const response = await axiosRequest.get(`/Message/by-conversation/${conversationId}?_t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" }
    });
    return response.data;
  },

  sendMessage: async (data: { conversationId: number; content: string; receiverId?: number }) => {
    const response = await axiosRequest.post("/Message", data);
    return response.data;
  },

  deleteMessage: async (id: number) => {
    const response = await axiosRequest.delete(`/Message/${id}`);
    return response.data;
  },
};
