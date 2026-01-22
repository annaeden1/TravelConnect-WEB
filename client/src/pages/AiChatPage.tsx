import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Stack,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import type { Message } from "../types/chat";
import { sendMessageToAI, createUserMessage } from "../services/aiService";
import { ChatMessage } from "../components/chat";

const AiChatPage = () => {
  const [userMessage, setUserMessage] = useState<Message | null>(null);
  const [aiResponse, setAiResponse] = useState<Message | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage = createUserMessage(inputValue);
    setUserMessage(newUserMessage);
    setAiResponse(null);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(inputValue);
      setAiResponse(response);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
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

      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4rem",
            background:
              "linear-gradient(to top, #fafafa 0%, rgba(250, 250, 250, 0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            paddingBottom: "4rem",
            "&::-webkit-scrollbar": {
              width: "0.5rem",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c0c0c0",
              borderRadius: "0.25rem",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#a0a0a0",
            },
            "&::-webkit-scrollbar-button": {
              display: "none",
            },
          }}
        >
          <Container maxWidth="md" sx={{ paddingY: "2rem" }}>
            {!userMessage ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ paddingY: "4rem" }}
              >
                <Avatar
                  sx={{
                    width: "5rem",
                    height: "5rem",
                    bgcolor: "#e0e0e0",
                    marginBottom: "1.5rem",
                  }}
                >
                  <AutoAwesomeIcon
                    sx={{ fontSize: "2.5rem", color: "#9e9e9e" }}
                  />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ marginBottom: "0.5rem" }}
                >
                  No responses yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Ask the AI anything about travel and your response will appear
                  here
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold">
                  Response
                </Typography>
                <ChatMessage message={userMessage} />
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "1rem",
                    }}
                  >
                    <CircularProgress size={20} sx={{ color: "#0ea5e9" }} />
                    <Typography variant="body2" color="text.secondary">
                      AI is thinking...
                    </Typography>
                  </Box>
                ) : (
                  aiResponse && <ChatMessage message={aiResponse} />
                )}
              </Stack>
            )}
          </Container>
        </Box>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "1rem",
            borderRadius: "1.5rem",
            bgcolor: "white",
            width: "100%",
            maxWidth: "52rem",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask about travel destinations, itineraries, tips..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  borderRadius: "1rem",
                },
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              sx={{
                bgcolor: "#0ea5e9",
                minWidth: "3rem",
                height: "3rem",
                borderRadius: "50%",
                "&:hover": {
                  bgcolor: "#0284c7",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AiChatPage;
