// services/authService.ts
import axiosRequest from "./axiosRequest";

export const login = async (data : any) => {
  return await axiosRequest.post("/Auth/login", data);
};

export const register = async (data : any) => {
  return await axiosRequest.post("/Auth/register", data);
};