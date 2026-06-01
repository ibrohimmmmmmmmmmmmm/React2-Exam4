import axiosRequest from "./axiosRequest";

export const getRecommendedJobs = async (userId: string) => axiosRequest.get(`/JobMatching/recommended-jobs/${userId}`);
export const getJobById = async (jobId: string) => axiosRequest.get(`/Job/${jobId}`);
export const getPagedJobs = async () => axiosRequest.get(`/Job/paged`);
