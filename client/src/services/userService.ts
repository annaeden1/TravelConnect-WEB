import api from "./api";

export const getUserDetails = async (userId: string): Promise<{ username: string, profileImage: string }> => {
    const data = (await api.get<{ username: string, profileImage: string }>(`/user/${userId}`)).data;

    return data;
};