import axiosRequest from "./axiosRequest";

export const uploadPhoto = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  // Let the browser set the Content-Type including the boundary
  return axiosRequest.post("/Upload/photo", form);
};

export default { uploadPhoto };
