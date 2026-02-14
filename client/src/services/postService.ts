import api from "./api";

export interface TripPostData {
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  photos: File[];
}

export const createTripPost = async (data: FormData): Promise<any> => {
  const response = await api.post("/post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
