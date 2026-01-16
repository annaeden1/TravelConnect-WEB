import request from "supertest";
import intApp from "../index";
import { userModel } from "../models/userModel";
import { Express } from "express";
import { getLoggedInUser, UserData } from "./types/userData";

let loginUser: UserData;
const testData: UserData[] = [
  {
    username: "John Doeeeee",
    email: "john@example.com",
    password: "password123",
    profileImage: "",
    token: "",
    refreshTokens: [""]
  },
  {
    username: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    profileImage: "",
    token: "",
    refreshTokens: [""]
  },
  {
    username: "Alice Johnson",
    email: "alice@example.com",
    password: "password789",
    profileImage: "",
    token: "",
    refreshTokens: [""]
  },
];

let app: Express;

beforeAll(async () => {
  app = await intApp();
  loginUser = await getLoggedInUser(app);
});

beforeEach(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await userModel.deleteMany({});
});

describe("User API Endpoints", () => {
  test("should create a new user", async () => {
    for (const data of testData) {
      const res = await request(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(data);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id"); // Mongoose usually returns '_id', not 'id'
      expect(res.body.username).toBe(data.username);
      expect(res.body.email).toBe(data.email);
    }
  });

  test("should retrieve all users", async () => {
    for (const data of testData) {
      await request(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(data);
    }
    const res = await request(app).get("/user").set("Authorization", "Bearer " + loginUser.token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(testData.length);
  });

  test("should retrieve a user by ID", async () => {
    const createRes = await request(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
    const userId = createRes.body._id;
    const res = await request(app).get(`/user/${userId}`).set("Authorization", "Bearer " + loginUser.token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe(testData[0].username);
    expect(res.body.email).toBe(testData[0].email);
  });

  test("should update a user by ID", async () => {
    const createRes = await request(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
    const userId = createRes.body._id;
    const updatedData = {
      username: "Updated Name",
      email: "updated@example.com",
    };
    const res = await request(app).put(`/user/${userId}`).set("Authorization", "Bearer " + loginUser.token).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe(updatedData.username);
    expect(res.body.email).toBe(updatedData.email);
  });
});
