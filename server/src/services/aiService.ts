import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an AI Travel Assistant for TravelConnect.
Your role is to help users plan trips, suggest destinations, provide travel tips,
recommend accommodations and activities, and answer any travel-related questions.
Be friendly, helpful, and provide practical advice. Keep responses concise but informative.

IMPORTANT: Do not use any markdown formatting in your responses. No bold (**), no italics (*),
no headers (#), no bullet points (-), no numbered lists. Write in plain text only, using natural
paragraphs and sentences. If you need to list items, write them in a flowing sentence or
separate them with commas.

If the question is not related to travel, politely redirect the user to ask travel-related questions.`;

const MOCK_RESPONSES = [
  "I'd recommend visiting Tokyo in spring for the cherry blossoms. The weather is mild and the city is beautiful with pink flowers everywhere. Don't miss the Ueno Park and Meguro River for the best viewing spots.",
  "For a beach vacation, consider Bali, Indonesia. It offers beautiful beaches, rich culture, delicious food, and affordable accommodations. The best time to visit is during the dry season from April to October.",
  "When packing for a trip, always bring layers, comfortable walking shoes, and a portable charger. Keep important documents in your carry-on and make digital copies as backup.",
  "Barcelona is a fantastic city for food lovers. Try the local tapas, visit La Boqueria market, and don't miss the paella by the beach. The Gothic Quarter has many authentic restaurants.",
  "For budget travel, consider staying in hostels, eating where locals eat, using public transportation, and visiting free attractions. Many museums have free entry days.",
];

export class LLMServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = "LLMServiceError";
  }
}

class AIService {
  private getGenAI(): GoogleGenerativeAI | null {
    if (process.env.GEMINI_API_KEY) {
      return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
  }

  private isMockModeEnabled(): boolean {
    return process.env.LLM_MOCK_MODE === "true";
  }

  private getMockResponse(): string {
    const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
    return MOCK_RESPONSES[randomIndex];
  }

  async generateChatResponse(message: string): Promise<string> {
    // Mock mode for testing/development (checked at runtime)
    if (this.isMockModeEnabled()) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getMockResponse();
    }

    // Validate API key is configured
    const genAI = this.getGenAI();
    if (!process.env.GEMINI_API_KEY || !genAI) {
      throw new LLMServiceError(
        "Gemini API key not configured",
        500,
        false
      );
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: message },
      ]);

      const response = result.response.text();
      return response;
    } catch (error: unknown) {
      // Handle specific error types
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Rate limiting (429)
        if (
          errorMessage.includes("rate limit") ||
          errorMessage.includes("quota") ||
          errorMessage.includes("too many requests")
        ) {
          throw new LLMServiceError(
            "Rate limit exceeded. Please try again later.",
            429,
            true
          );
        }

        // Service unavailable (502/503)
        if (
          errorMessage.includes("unavailable") ||
          errorMessage.includes("service error") ||
          errorMessage.includes("internal error")
        ) {
          throw new LLMServiceError(
            "AI service is temporarily unavailable",
            502,
            true
          );
        }

        // Safety/content filtering
        if (
          errorMessage.includes("safety") ||
          errorMessage.includes("blocked")
        ) {
          throw new LLMServiceError(
            "The request was blocked due to content policy",
            400,
            false
          );
        }
      }

      // Generic LLM failure
      throw new LLMServiceError(
        "Failed to generate AI response",
        502,
        true
      );
    }
  }

  isMockMode(): boolean {
    return this.isMockModeEnabled();
  }
}

export default new AIService();
