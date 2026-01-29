import { Box, Avatar, Typography, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Message } from "../../utils/types/chat";

const USER_BG_COLOR = "#e3f2fd";
const ASSISTANT_BG_COLOR = "white";
const USER_BORDER_COLOR = "#90caf9";
const ASSISTANT_BORDER_COLOR = "#e0e0e0";
const USER_AVATAR_COLOR = "#1976d2";
const ASSISTANT_AVATAR_COLOR = "#0ea5e9";

const USER_LABEL = "You";
const ASSISTANT_LABEL = "AI Assistant";

const PADDING = "1rem";
const BORDER_RADIUS = "0.75rem";
const GAP = "0.75rem";
const AVATAR_SIZE = "2.25rem";
const ICON_SIZE = "1.25rem";
const LABEL_MARGIN_BOTTOM = "0.25rem";
const TIMESTAMP_MARGIN_TOP = "0.5rem";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <Paper
      elevation={0}
      sx={{
        padding: PADDING,
        bgcolor: isUser ? USER_BG_COLOR : ASSISTANT_BG_COLOR,
        border: "1px solid",
        borderColor: isUser ? USER_BORDER_COLOR : ASSISTANT_BORDER_COLOR,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: GAP,
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? USER_AVATAR_COLOR : ASSISTANT_AVATAR_COLOR,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
        >
          {isUser ? (
            <PersonIcon sx={{ fontSize: ICON_SIZE }} />
          ) : (
            <AutoAwesomeIcon sx={{ fontSize: ICON_SIZE }} />
          )}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ marginBottom: LABEL_MARGIN_BOTTOM }}
          >
            {isUser ? USER_LABEL : ASSISTANT_LABEL}
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
            sx={{ display: "block", marginTop: TIMESTAMP_MARGIN_TOP }}
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
