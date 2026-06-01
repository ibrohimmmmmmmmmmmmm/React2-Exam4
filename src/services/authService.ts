// services/authService.ts
import axiosRequest from "./axiosRequest";

export const login = async (data : any) => {
  return await axiosRequest.post("/auth/login", data);
};

export const register = async (data : any) => {
  return await axiosRequest.post("/auth/register", data);
};