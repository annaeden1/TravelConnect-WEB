import type { Message } from "../utils/types/chat";
import api from "./api";

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
  const { data } = await api.post<ChatResponse>("/ai/chat", {
    message: userMessage,
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
