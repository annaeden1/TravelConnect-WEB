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

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInputValue("");
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading || hasUserMessage) return;

    let sessionId = currentSessionId;

    if (!sessionId) {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
      };
      setChatSessions((prev) => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    const userMessage = createUserMessage(inputValue);
    const messageText = inputValue;
    setInputValue("");
    setIsLoading(true);

    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedMessages = [...session.messages, userMessage];
          return {
            ...session,
            messages: updatedMessages,
            title:
              session.title === "New Chat"
                ? messageText.slice(0, 30) +
                  (messageText.length > 30 ? "..." : "")
                : session.title,
          };
        }
        return session;
      })
    );

    try {
      const response = await sendMessageToAI(messageText);
      setChatSessions((prev) =>
        prev.map((session) => {
          if (session.id === sessionId) {
            return {
              ...session,
              messages: [...session.messages, response],
            };
          }
          return session;
        })
      );
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
