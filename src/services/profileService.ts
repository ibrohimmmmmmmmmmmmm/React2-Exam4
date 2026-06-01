import axiosRequest from "./axiosRequest";

export const fetchCurrentUser = async () => axiosRequest.get("/User/me");
export const fetchProfileByUserId = async (userId: string) => axiosRequest.get(`/Profile/by-user/${userId}`);
export const fetchJobApplicationsByUser = async (userId: string) => axiosRequest.get(`/JobApplication/by-user/${userId}`);
