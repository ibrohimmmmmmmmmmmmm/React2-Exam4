import axiosRequest from "./axiosRequest";

export interface NetworkUser {
  id: number;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  // Other properties based on actual API
}

export const networkService = {
  getDirectory: async (): Promise<NetworkUser[]> => {
    try {
      const response = await axiosRequest.get("/User/directory");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch directory:", error);
      throw error;
    }
  },
};
