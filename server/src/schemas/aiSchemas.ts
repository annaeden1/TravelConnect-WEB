import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string({ error: "Message must be a string" })
    .min(1, { message: "Message cannot be empty" })
    .max(4000, { message: "Message is too long (max 4000 characters)" }),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  response: string;
  timestamp: string;
}
