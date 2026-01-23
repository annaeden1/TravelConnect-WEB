import { type Express } from "express";
import request from "supertest";

export type UserData = {
  _id?: string;
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  token?: string;
  refreshTokens: string[];
};

export const userData = {
    _id: "507f1f77bcf86cd799439014",
    username: "testuser",
    email: "test@test.com",
    password: "testpass",
    profileImage: "",
    token: "",
    refreshTokens: [""]
};

export const getLoggedInUser = async (app: Express): Promise<UserData> => {
    const email = userData.email;
    const password = userData.password;
    let response = await request(app).post("/auth/register").send(
        { "email": email, "password": password, "username": userData.username, "profileImage": userData.profileImage }
    );
    if (response.status !== 201) {
        response = await request(app).post("/auth/login").send(
            { "email": email, "password": password });
    }
    const loggedInUser: UserData = {
        _id: response.body._id,
        token: response.body.accessToken,
        email: email,
        password: password,
        username: userData.username,
        profileImage: userData.profileImage,
        refreshTokens: [response.body.refreshToken]
    };

    return loggedInUser;
}