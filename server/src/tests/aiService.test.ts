import request from "supertest";
import aiService from "../services/aiService";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock the GoogleGenerativeAI SDK completely
jest.mock("@google/generative-ai");

describe("AI Service Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clone env before each test
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore env after all tests
    process.env = originalEnv;
  });

  describe("getGenAI and Configuration", () => {
    it("should throw an error if API key is not configured and not in mock mode", async () => {
      delete process.env.GEMINI_API_KEY;
      process.env.LLM_MOCK_MODE = "false";

      await expect(aiService.generateChatResponse("Hello"))
        .rejects
        .toThrow("Gemini API key not configured");
    });

    it("should use mock mode when LLM_MOCK_MODE is true", async () => {
      process.env.LLM_MOCK_MODE = "true";
      const response = await aiService.generateChatResponse("Hello");
      
      expect(typeof response).toBe("string");
      expect(response.length).toBeGreaterThan(0);
      expect(aiService.isMockMode()).toBe(true);
    });
  });

  describe("generateChatResponse via GenerativeAI", () => {
    let mockGenerateContent: jest.Mock;

    beforeEach(() => {
      process.env.GEMINI_API_KEY = "test_key";
      process.env.LLM_MOCK_MODE = "false";

      mockGenerateContent = jest.fn();
      
      // Setup the mocked GoogleGenerativeAI implementation
      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent,
        }),
      }));
    });

    it("should return valid response from Gemini", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => "This is a test AI response."
        }
      });

      const response = await aiService.generateChatResponse("Hi there");
      
      expect(response).toBe("This is a test AI response.");
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it("should handle Rate Limit errors (429)", async () => {
      mockGenerateContent.mockRejectedValue(new Error("Rate limit exceeded"));

      try {
        await aiService.generateChatResponse("Hi there");
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.name).toBe("LLMServiceError");
        expect(error.statusCode).toBe(429);
        expect(error.message).toContain("Rate limit exceeded");
        expect(error.isRetryable).toBe(true);
      }
    });

    it("should handle quota errors as Rate Limit (429)", async () => {
      mockGenerateContent.mockRejectedValue(new Error("You have exceeded your quota"));

      try {
        await aiService.generateChatResponse("Hi there");
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.statusCode).toBe(429);
      }
    });

    it("should handle specific Service Unavailable errors (502/503)", async () => {
      mockGenerateContent.mockRejectedValue(new Error("The service is currently unavailable"));

      try {
        await aiService.generateChatResponse("Hi there");
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.statusCode).toBe(502);
        expect(error.message).toContain("AI service is temporarily unavailable");
      }
    });

    it("should handle specific safety blocked errors (400)", async () => {
      mockGenerateContent.mockRejectedValue(new Error("The request was blocked due to safety concerns"));

      try {
        await aiService.generateChatResponse("Hi there");
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain("blocked due to content policy");
        expect(error.isRetryable).toBe(false);
      }
    });

    it("should handle generic/unknown errors with 502", async () => {
      mockGenerateContent.mockRejectedValue(new Error("Some random parsing exception"));

      try {
        await aiService.generateChatResponse("Hi there");
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.statusCode).toBe(502);
        expect(error.message).toContain("Failed to generate AI response");
        expect(error.isRetryable).toBe(true);
      }
    });

    it("should handle non-Error throwables with generic 502", async () => {
      mockGenerateContent.mockRejectedValue("String error instead of Error object");

      try {
        await aiService.generateChatResponse("Hi there");
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.statusCode).toBe(502);
        expect(error.message).toContain("Failed to generate AI response");
      }
    });
  });
});
