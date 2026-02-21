import api from "./api";

export const uploadFile = async (file: FormData): Promise<string> => {
  const response = await api.post<{ url: string }>("/file", file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.url;
};
