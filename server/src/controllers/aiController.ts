import type { Request, Response } from "express";
import { ZodError } from "zod";
import { chatRequestSchema, type ChatResponse } from "../schemas/aiSchemas";
import aiService, { LLMServiceError } from "../services/aiService";

class AIController {
  async chat(req: Request, res: Response) {
    try {
      const validatedData = chatRequestSchema.parse(req.body);

      const responseText = await aiService.generateChatResponse(
        validatedData.message
      );

      const response: ChatResponse = {
        response: responseText,
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        return res.status(400).json({
          error: firstError.message,
        });
      }

      if (error instanceof LLMServiceError) {
        return res.status(error.statusCode).json({
          error: error.message,
          retryable: error.isRetryable,
        });
      }

      console.error("AI Chat Error:", error);
      return res.status(500).json({
        error: "An unexpected error occurred",
      });
    }
  }
}

export default new AIController();
