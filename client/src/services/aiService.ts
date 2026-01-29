import type { Message } from "../utils/types/chat";
import apiClient from "./apiClient";

interface ChatResponse {
  response: string;
  timestamp: string;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const sendMessageToAI = async (
  userMessage: string
): Promise<Message> => {
  const data = await apiClient<ChatResponse>("/ai/chat", {
    method: "POST",
    body: { message: userMessage },
  });

  return {
    id: generateId(),
    role: "assistant",
    content: data.response,
    timestamp: new Date(data.timestamp),
  };
};

export const createUserMessage = (content: string): Message => {
  return {
    id: generateId(),
    role: "user",
    content,
    timestamp: new Date(),
  };
};
