import { Box, Typography, Stack, Avatar, CircularProgress } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Message } from "../../utils/types/chat";
import { ChatMessage } from "../chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: "1.5rem",
      }}
    >
      <Box sx={{ maxWidth: "43.75rem", mx: "auto" }}>
        {messages.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: "4rem" }}
          >
            <Avatar
              sx={{
                width: "5rem",
                height: "5rem",
                bgcolor: "#e0e0e0",
                mb: "1rem",
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: "2.5rem", color: "#9e9e9e" }} />
            </Avatar>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.secondary"
              sx={{ mb: "0.25rem" }}
            >
              Start a conversation
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Ask the AI anything about travel and get personalized advice
            </Typography>
          </Stack>
        ) : (
          <Stack spacing="1rem">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  p: "1rem",
                }}
              >
                <CircularProgress size={20} sx={{ color: "#0ea5e9" }} />
                <Typography variant="body2" color="text.secondary">
                  AI is thinking...
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessages;
