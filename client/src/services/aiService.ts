import type { Message } from "../utils/types/chat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const sendMessageToAI = async (
  userMessage: string,
): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  const data = await response.json();

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
