import request from "supertest";
import intApp from "../index";
import { userModel } from "../models/userModel";
import { Express } from "express";
import { UserData } from "./types/userData";

const testData: UserData[] = [
  {
    username: "John Doeeeee",
    email: "john@example.com",
    password: "password123",
    profileImage: "http://example.com/image.jpg",
    token: "",
    refreshTokens: [""]
  },
  {
    username: "Jane Smith",
    email: "jane@example.com",
    profileImage: "http://example2.com/image.jpg",
    password: "password456",
    token: "",
    refreshTokens: [""]
  },
  {
    username: "Alice Johnson",
    email: "alice@example.com",
    password: "password789",
    profileImage: "http://example3.com/image.jpg",
    token: "",
    refreshTokens: [""]
  },
];

let app: Express;

beforeAll(async () => {
  app = await intApp();
});

beforeEach(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await userModel.deleteMany({});
});

describe("Auth API Endpoints", () => {

  describe("User Registration", () => {
      test("register a new user", async () => {
        const res = await request(app).post("/auth/register").send({
          username: testData[1].username,
          email: testData[1].email,
          profileImage: testData[1].profileImage,
          password: testData[1].password
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
      });

      test("should not register a user with existing email", async () => {
        const createRes = await request(app).post("/auth/register").send({
          username: testData[2].username,
          email: testData[2].email,
          password: testData[2].password
        });
        expect(createRes.statusCode).toEqual(201);

        const res = await request(app).post("/auth/register").send({
          username: "Another Name",
          email: testData[2].email,
          password: "anotherpassword"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error", "User with this email already exists");
      });

      test("should not register a user without email or password", async () => {
        const res = await request(app).post("/auth/register").send({
          username: "No Email User",
          profileImage: "http://noemail.com/image.jpg"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error", "Email and password are required");
      });

      test("should register a user without profile image", async () => {
        const res = await request(app).post("/auth/register").send({
          username: testData[2].username,
          email: testData[2].email,
          password: testData[2].password
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
      });

      test("should not register a user with missing password", async () => {
        const res = await request(app).post("/auth/register").send({
          username: "No Password User",
          email: "nopassword@example.com",
          profileImage: "http://nopassword.com/image.jpg"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error", "Email and password are required");
      });

      test("should not register a user with missing email", async () => {
        const res = await request(app).post("/auth/register").send({
          username: "No Email User",
          password: "somepassword",
          profileImage: "http://noemail.com/image.jpg"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error", "Email and password are required");
      });
  });

  describe("User Login", () => {
    test("should login a user", async () => {
      const createRes = await request(app).post("/auth/register").send(testData[0]);
      expect(createRes.statusCode).toEqual(201);
      const loginRes = await request(app).post("/auth/login").send({
        email: testData[0].email,
        password: testData[0].password
      });
      expect(loginRes.statusCode).toEqual(200);
      expect(loginRes.body).toHaveProperty("accessToken");
      expect(loginRes.body).toHaveProperty("refreshToken");
      expect(loginRes.body.username).toBe(testData[0].username);
      expect(loginRes.body.profileImage).toBe(testData[0].profileImage);
    });

    test("should not login with invalid credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "@example.com",
        password: "wrongpassword"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });

    test("should not login a user without email or password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "",
        password: ""
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    test("should not login a non-existing user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com", 
        password: "somepassword"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });

    test("should not login a user with wrong password", async () => {
      const createRes = await request(app).post("/auth/register").send({
        username: testData[0].username,
        email: testData[0].email,
        profileImage: testData[0].profileImage,
        password: testData[0].password
      });
      expect(createRes.statusCode).toEqual(201);
      const res = await request(app).post("/auth/login").send({
        email: testData[0].email,
        password: "wrongpassword"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });

    test("should not login a user without password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "<EMAIL>",
        password: ""
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    test("should not login a user without email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "",  
        password: "somepassword"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email and password are required");
    });
  });

  describe("Logout", () => {
    test("should logout a user", async () => {
      const createRes = await request(app).post("/auth/register").send({
        username: testData[0].username,
        email: testData[0].email,
        profileImage: testData[0].profileImage,
        password: testData[0].password
      });
      expect(createRes.statusCode).toEqual(201);
      const logoutRes = await request(app).post("/auth/logout").send({
        refreshToken: createRes.body.refreshToken
      });
      expect(logoutRes.statusCode).toEqual(200);
      expect(logoutRes.body).toHaveProperty("message", "Logged out successfully");
    });

    test("should not logout a user without refresh token", async () => {
      const res = await request(app).post("/auth/logout").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Refresh token is required");
    });

    test("should not logout with invalid refresh token", async () => {
      const res = await request(app).post("/auth/logout").send({
        refreshToken: "invalidtoken"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid refresh token");
    });
  });

  describe("Refresh Token", () => {
    test("should refresh token", async () => {
      const createRes = await request(app).post("/auth/register").send({
        username: testData[1].username, 
        email: testData[1].email,
        profileImage: testData[1].profileImage,
        password: testData[1].password
      });
      expect(createRes.statusCode).toEqual(201);
      const refreshRes = await request(app).post("/auth/refresh-token").send({
        refreshToken: createRes.body.refreshToken
      });
      expect(refreshRes.statusCode).toEqual(200);
      expect(refreshRes.body).toHaveProperty("accessToken");
      expect(refreshRes.body).toHaveProperty("refreshToken");
    });

    test("should not refresh token with invalid token", async () => {
      const res = await request(app).post("/auth/refresh-token").send({
        refreshToken: "invalidtoken"
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid refresh token");
    });

    test("should not refresh token without refresh token", async () => {
      const res = await request(app).post("/auth/refresh-token").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Refresh token is required");
    });
  });
});