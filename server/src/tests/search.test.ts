import request from "supertest";
import intApp from "../index";
import { Express } from "express";
import { postModel } from "../models/postModel";
import { getLoggedInUser, UserData } from "./types/userData";

let loginUser: UserData;
let app: Express;

const searchTestPosts = [
  {
    content: "Amazing trip to Tokyo, loved the sushi and temples",
    userCreatorID: "507f1f77bcf86cd799439011",
  },
  {
    content: "Exploring the streets of Kyoto, beautiful shrines everywhere",
    userCreatorID: "507f1f77bcf86cd799439011",
  },
  {
    content: "Beach vacation in Bali, Indonesia was incredible",
    userCreatorID: "507f1f77bcf86cd799439012",
  },
  {
    content: "Road trip across Italy, Rome and Florence are must-see",
    userCreatorID: "507f1f77bcf86cd799439012",
  },
  {
    content: "Hiking in the Swiss Alps, breathtaking views",
    userCreatorID: "507f1f77bcf86cd799439013",
  },
];

beforeAll(async () => {
  app = await intApp();
  loginUser = await getLoggedInUser(app);
});

beforeEach(async () => {
  await postModel.deleteMany({});
  for (const post of searchTestPosts) {
    await postModel.create(post);
  }
});

afterAll(async () => {
  await postModel.deleteMany({});
});

// Increase timeout for all tests since Gemini API calls can be slow
jest.setTimeout(15000);

describe("Search API Endpoint", () => {
  describe("POST /post/search", () => {
    test("should return posts matching a keyword", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ query: "Tokyo" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("query", "Tokyo");
      expect(res.body).toHaveProperty("results");
      expect(res.body.results.length).toBeGreaterThanOrEqual(1);

      const contents = res.body.results.map((p: any) => p.content);
      expect(contents.some((c: string) => c.includes("Tokyo"))).toBe(true);
    });

    test("should return results structure with query field", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ query: "Italy Rome" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("query", "Italy Rome");
      expect(res.body).toHaveProperty("results");
      expect(Array.isArray(res.body.results)).toBe(true);
    });

    test("should return 400 if query is missing", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "query field is required");
    });

    test("should return 400 if query is empty string", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ query: "   " });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "query cannot be empty");
    });

    test("should return 400 if query is not a string", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ query: 123 });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "query must be a string");
    });

    test("should return 401 without authorization", async () => {
      const res = await request(app)
        .post("/post/search")
        .send({ query: "Tokyo" });

      expect(res.statusCode).toEqual(401);
    });

    test("should find posts with case-insensitive search", async () => {
      const res = await request(app)
        .post("/post/search")
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ query: "bali" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.results.length).toBeGreaterThanOrEqual(1);

      const contents = res.body.results.map((p: any) => p.content);
      expect(contents.some((c: string) => c.toLowerCase().includes("bali"))).toBe(true);
    });
  });
});
