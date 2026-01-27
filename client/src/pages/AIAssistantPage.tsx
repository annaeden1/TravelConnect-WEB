import { useState } from "react";
import { Box, Typography, Stack, Avatar, AppBar, Toolbar } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { toast } from "react-toastify";
import type { Message } from "../utils/types/chat";
import { sendMessageToAI, createUserMessage } from "../services/aiService";
import { ChatSidebar, ChatInput, ChatMessages } from "../components/ai";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const AIAssistant = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);
  const hasUserMessage = currentSession && currentSession.messages.length > 0;

  const generateSessionTitle = (message: string): string => {
    return message.slice(0, 30) + (message.length > 30 ? "..." : "");
  };

  const createNewSession = (title: string): ChatSession => {
    return {
      id: crypto.randomUUID(),
      title,
      messages: [],
      createdAt: new Date(),
    };
  };

  const ensureSessionExists = (message: string): string => {
    if (currentSessionId) {
      return currentSessionId;
    }

    const newSession = createNewSession(generateSessionTitle(message));
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const addUserMessageToSession = (
    sessionId: string,
    userMessage: Message,
    messageText: string,
  ) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage],
            title:
              session.title === "New Chat"
                ? generateSessionTitle(messageText)
                : session.title,
          };
        }
        return session;
      }),
    );
  };

  const addAIResponseToSession = (sessionId: string, response: Message) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, response],
          };
        }
        return session;
      }),
    );
  };

  const handleNewChat = () => {
    const newSession = createNewSession("New Chat");
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInputValue("");
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading || hasUserMessage) return;

    const sessionId = ensureSessionExists(inputValue);
    const userMessage = createUserMessage(inputValue);
    const messageText = inputValue;

    setInputValue("");
    setIsLoading(true);

    addUserMessageToSession(sessionId, userMessage, messageText);

    try {
      const response = await sendMessageToAI(messageText);
      addAIResponseToSession(sessionId, response);
    } catch {
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fafafa",
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0ea5e9" }}>
        <Toolbar>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              marginRight: "0.75rem",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "white" }} />
          </Avatar>
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="white">
              AI Travel Assistant
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.85)">
              Get personalized travel advice
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ChatSidebar
          sessions={chatSessions}
          currentSessionId={currentSessionId}
          onNewChat={handleNewChat}
          onSelectSession={setCurrentSessionId}
        />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDisabled={!!hasUserMessage}
          />

          <ChatMessages
            messages={currentSession?.messages ?? []}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AIAssistant;
