import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface ChatSession {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

const ChatSidebar = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
}: ChatSidebarProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "17.5rem",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
      }}
    >
      <Box sx={{ p: "1rem" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            bgcolor: "#0ea5e9",
            "&:hover": { bgcolor: "#0284c7" },
            borderRadius: "0.5rem",
            textTransform: "none",
            py: "0.75rem",
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: "1rem", py: "0.5rem", display: "block" }}
        >
          Chat History
        </Typography>
        <List dense>
          {sessions.map((session) => (
            <ListItemButton
              key={session.id}
              selected={session.id === currentSessionId}
              onClick={() => onSelectSession(session.id)}
              sx={{
                mx: "0.5rem",
                borderRadius: "0.25rem",
                "&.Mui-selected": {
                  bgcolor: "#e0f2fe",
                  "&:hover": { bgcolor: "#bae6fd" },
                },
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: "1.125rem",
                  mr: "0.75rem",
                  color: "text.secondary",
                }}
              />
              <ListItemText
                primary={session.title}
                slotProps={{
                  primary: {
                    noWrap: true,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ChatSidebar;
