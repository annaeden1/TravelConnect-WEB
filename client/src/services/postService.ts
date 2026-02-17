import api from "./api";

export interface TripPostData {
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  photos: File[];
}

export const createTripPost = async (data: TripPostData & { userCreatorID: string }): Promise<any> => {
  const response = await api.post("/post", data);
  return response.data;
};
