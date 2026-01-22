import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Request, Response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are an AI Travel Assistant for TravelConnect.
Your role is to help users plan trips, suggest destinations, provide travel tips,
recommend accommodations and activities, and answer any travel-related questions.
Be friendly, helpful, and provide practical advice. Keep responses concise but informative.

IMPORTANT: Do not use any markdown formatting in your responses. No bold (**), no italics (*),
no headers (#), no bullet points (-), no numbered lists. Write in plain text only, using natural
paragraphs and sentences. If you need to list items, write them in a flowing sentence or
separate them with commas.`;

class AIController {
  async chat(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: message },
      ]);

      const response = result.response.text();

      return res.status(200).json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      return res.status(500).json({ error: "Failed to generate AI response" });
    }
  }
}

export default new AIController();
