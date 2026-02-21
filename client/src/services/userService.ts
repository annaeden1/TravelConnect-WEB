import api from "./api";

export const getUserDetails = async (
  userId: string,
): Promise<{ username: string; profileImage: string }> => {
  const data = (
    await api.get<{ username: string; profileImage: string }>(`/user/${userId}`)
  ).data;
  return data;
};

export const updateUser = async (
  userId: string,
  fields: { username?: string; profileImage?: string },
): Promise<{
  _id: string;
  username: string;
  profileImage: string;
  email: string;
}> => {
  const data = (
    await api.put<{
      _id: string;
      username: string;
      profileImage: string;
      email: string;
    }>(`/user/${userId}`, fields)
  ).data;
  return data;
};
