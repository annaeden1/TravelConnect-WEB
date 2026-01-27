import request from "supertest";
import intApp from "../index";
import { Express } from "express";

// Enable mock mode for testing
process.env.LLM_MOCK_MODE = "true";

let app: Express;

beforeAll(async () => {
  app = await intApp();
});

describe("AI API Endpoints", () => {
  describe("POST /ai/chat", () => {
    test("should return AI response for valid message", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: "What are the best places to visit in Japan?" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("response");
      expect(res.body).toHaveProperty("timestamp");
      expect(typeof res.body.response).toBe("string");
      expect(typeof res.body.timestamp).toBe("string");
    });

    test("should return 400 when message is missing", async () => {
      const res = await request(app).post("/ai/chat").send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("string");
    });

    test("should return 400 when message is empty string", async () => {
      const res = await request(app).post("/ai/chat").send({ message: "" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("empty");
    });

    test("should return 400 when message is not a string", async () => {
      const res = await request(app).post("/ai/chat").send({ message: 123 });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("string");
    });

    test("should return 400 when message is null", async () => {
      const res = await request(app).post("/ai/chat").send({ message: null });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });

    test("should return 400 when message is an array", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: ["hello", "world"] });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });

    test("should return 400 when message is an object", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: { text: "hello" } });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });

    test("should return 400 when message exceeds max length", async () => {
      const longMessage = "a".repeat(4001);
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: longMessage });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("too long");
    });

    test("should handle valid long messages", async () => {
      const longMessage = "Tell me about travel ".repeat(100);
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: longMessage });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("response");
    });

    test("should return timestamp in ISO format", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: "Hello" });

      expect(res.statusCode).toEqual(200);
      const timestamp = new Date(res.body.timestamp);
      expect(timestamp.toISOString()).toBe(res.body.timestamp);
    });
  });

  describe("Content Type", () => {
    test("should accept application/json content type", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .set("Content-Type", "application/json")
        .send({ message: "Hello" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("response");
    });
  });

  describe("Mock Mode", () => {
    test("should return a mock response in mock mode", async () => {
      const res = await request(app)
        .post("/ai/chat")
        .send({ message: "Tell me about beaches" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("response");
      // Mock responses contain travel-related content
      expect(res.body.response.length).toBeGreaterThan(0);
    });
  });
});
