import axiosRequest from "./axiosRequest";

export const createApplication = async (jobId: string, data?: any) => {
  try {
    return await axiosRequest.post(`/Application`, { jobId, ...data });
  } catch (error: any) {
    // fallback: persist locally
    try {
      const raw = localStorage.getItem("applications");
      const arr = raw ? JSON.parse(raw) : [];
      const entry = { id: `local-${Date.now()}`, jobId, data, createdAt: new Date().toISOString(), status: "pending" };
      arr.push(entry);
      localStorage.setItem("applications", JSON.stringify(arr));
      return { data: entry } as any;
    } catch (e) {
      throw error;
    }
  }
};
