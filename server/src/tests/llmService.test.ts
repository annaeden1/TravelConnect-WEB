import LlmService from "../services/llmService";
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@google/generative-ai");

describe("LLM Service Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("API Key Fallback", () => {
    it("should use fallback parsing if Gemini API key is not configured", async () => {
      delete process.env.GEMINI_API_KEY;

      const result = await LlmService.parseSearchQuery("Find me photos of Paris");

      expect(result.originalQuery).toBe("Find me photos of Paris");
      expect(result.hasImage).toBe(true);
      expect(result.contentKeywords).toContain("paris");
      // "photos" is not a stopword in fallback parsing, so it's included as a keyword.
      expect(result.contentKeywords).toContain("photos");
    });
  });

  describe("Gemini Parsing Functionality", () => {
    let mockGenerateContent: jest.Mock;

    beforeEach(() => {
      process.env.GEMINI_API_KEY = "test_key";
      mockGenerateContent = jest.fn();

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent,
        }),
      }));
    });

    it("should parse valid JSON returned by Gemini, merging with original valid query words", async () => {
      const mockJsonResponse = `
      \`\`\`json
      {
        "contentKeywords": ["france", "eiffel", "tower"],
        "hasImage": false,
        "sortByLikes": true
      }
      \`\`\`
      `;

      mockGenerateContent.mockResolvedValue({
        response: { text: () => mockJsonResponse }
      });

      const result = await LlmService.parseSearchQuery("popular posts about Paris and France");

      // Verify the JSON values
      expect(result.hasImage).toBe(false);
      expect(result.sortByLikes).toBe(true);

      // Verify that contentKeywords contains both Gemini keywords (france, eiffel, tower)
      // and valid words from original query (popular, paris, france)
      expect(result.contentKeywords).toContain("france");
      expect(result.contentKeywords).toContain("eiffel");
      expect(result.contentKeywords).toContain("tower");
      expect(result.contentKeywords).toContain("popular");
      expect(result.contentKeywords).toContain("paris");

      // Should exclude words <= 2 length ("and") and stopwords ("about", "posts")
      expect(result.contentKeywords).not.toContain("about");
      expect(result.contentKeywords).not.toContain("posts");
      expect(result.contentKeywords).not.toContain("and");
    });

    it("should handle Gemini responding with empty JSON fields gracefully", async () => {
      const mockJsonResponse = `{}`;
      
      mockGenerateContent.mockResolvedValue({
        response: { text: () => mockJsonResponse }
      });

      const result = await LlmService.parseSearchQuery("japan travel log");
      
      // Should fallback to parsing keywords from original query
      expect(result.contentKeywords).toContain("japan");
      expect(result.contentKeywords).toContain("travel");
      expect(result.contentKeywords).toContain("log");
      expect(result.hasImage).toBeUndefined();
      expect(result.sortByLikes).toBeUndefined();
    });

    it("should handle invalid/non-JSON response from Gemini using fallback", async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => "I couldn't parse that into JSON. Sorry." }
      });

      const result = await LlmService.parseSearchQuery("top photos in Italy");
      
      // Falls back to fallbackParsing logic
      expect(result.hasImage).toBe(true);
      expect(result.sortByLikes).toBe(true);
      expect(result.contentKeywords).toContain("italy");
    });

    it("should handle a thrown error from Gemini by catching and using fallback parsing", async () => {
      mockGenerateContent.mockRejectedValue(new Error("Network Error"));

      const result = await LlmService.parseSearchQuery("trending pictures of London");

      // Uses fallback parsing successfully
      expect(result.hasImage).toBe(true);
      expect(result.sortByLikes).toBe(true);
      expect(result.contentKeywords).toContain("london");
    });
  });

  describe("Fallback Parsing Rules", () => {
    it("should set hasImage accurately", () => {
      const tests = [
        { query: "pictures of nature", expectImage: true },
        { query: "photo albums", expectImage: true },
        { query: "my favorite image", expectImage: true },
        { query: "regular text post", expectImage: undefined }
      ];

      for (const t of tests) {
        // use private method but casting to any for testing
        const result = (LlmService as any).fallbackParsing(t.query);
        expect(result.hasImage).toBe(t.expectImage);
      }
    });

    it("should set sortByLikes accurately", () => {
      const tests = [
        { query: "popular places", expectLikes: true },
        { query: "trending today", expectLikes: true },
        { query: "best locations", expectLikes: true },
        { query: "most liked spots", expectLikes: true },
        { query: "new places", expectLikes: undefined }
      ];

      for (const t of tests) {
        const result = (LlmService as any).fallbackParsing(t.query);
        expect(result.sortByLikes).toBe(t.expectLikes);
      }
    });

    it("should correctly handle capitalization, short words, and stopwords in fallback", () => {
      const result = (LlmService as any).fallbackParsing("Get all the posts ABOUT new york CITY by me");
      
      expect(result.contentKeywords).toContain("new");
      expect(result.contentKeywords).toContain("york");
      expect(result.contentKeywords).toContain("city");

      // Verify omitted elements
      expect(result.contentKeywords).not.toContain("get"); // stopword
      expect(result.contentKeywords).not.toContain("all"); // stopword
      expect(result.contentKeywords).not.toContain("the"); // stopword
      expect(result.contentKeywords).not.toContain("posts"); // stopword
      expect(result.contentKeywords).not.toContain("about"); // stopword
      expect(result.contentKeywords).not.toContain("by"); // word < 3 length and stopword
      expect(result.contentKeywords).not.toContain("me"); // word < 3 length and stopword
    });
  });
});
