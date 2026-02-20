import api from "./api";

export const uploadFile = async (
  file: FormData,
): Promise<string> => {
  return (await api.post("/file", file)).data;
};