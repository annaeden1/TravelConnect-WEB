import { Box, Avatar, Typography, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Message, ChatStylingProps } from "../../utils/types/chat";

interface ChatMessageProps extends ChatStylingProps {
  message: Message;
}

const ChatMessage = ({
  message,
  userIcon = <PersonIcon sx={{ fontSize: "1.25rem" }} />,
  assistantIcon = <AutoAwesomeIcon sx={{ fontSize: "1.25rem" }} />,
  userLabel = "You",
  assistantLabel = "AI Assistant",
  userBgColor = "#e3f2fd",
  assistantBgColor = "white",
  userAvatarColor = "#1976d2",
  assistantAvatarColor = "#0ea5e9",
}: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <Paper
      elevation={0}
      sx={{
        padding: "1rem",
        bgcolor: isUser ? userBgColor : assistantBgColor,
        border: "1px solid",
        borderColor: isUser ? "#90caf9" : "#e0e0e0",
        borderRadius: "0.75rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? userAvatarColor : assistantAvatarColor,
            width: "2.25rem",
            height: "2.25rem",
          }}
        >
          {isUser ? userIcon : assistantIcon}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ marginBottom: "0.25rem" }}
          >
            {isUser ? userLabel : assistantLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {message.content}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", marginTop: "0.5rem" }}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatMessage;
