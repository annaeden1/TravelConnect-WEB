import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatMessage from "./ChatMessage";
import type { Message } from "../../utils/types/chat";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  loadingText?: string;
  title?: string;
  userIcon?: ReactNode;
  assistantIcon?: ReactNode;
  userLabel?: string;
  assistantLabel?: string;
  userBgColor?: string;
  assistantBgColor?: string;
  userAvatarColor?: string;
  assistantAvatarColor?: string;
  loadingColor?: string;
}

const ChatMessageList = ({
  messages,
  isLoading,
  loadingText = "AI is thinking...",
  title = "Responses",
  userIcon = <PersonIcon sx={{ fontSize: "1.25rem" }} />,
  assistantIcon = <AutoAwesomeIcon sx={{ fontSize: "1.25rem" }} />,
  userLabel = "You",
  assistantLabel = "AI Assistant",
  userBgColor,
  assistantBgColor,
  userAvatarColor,
  assistantAvatarColor,
  loadingColor = "#0ea5e9",
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "1rem" }}>
        {title}
      </Typography>

      <Stack spacing={2}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            userIcon={userIcon}
            assistantIcon={assistantIcon}
            userLabel={userLabel}
            assistantLabel={assistantLabel}
            userBgColor={userBgColor}
            assistantBgColor={assistantBgColor}
            userAvatarColor={userAvatarColor}
            assistantAvatarColor={assistantAvatarColor}
          />
        ))}

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
            }}
          >
            <CircularProgress size={20} sx={{ color: loadingColor }} />
            <Typography variant="body2" color="text.secondary">
              {loadingText}
            </Typography>
          </Box>
        )}
      </Stack>

      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessageList;
