import { Box, TextField, Button, Paper, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  isDisabled,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "white",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: "1.5rem",
          bgcolor: "white",
        }}
      >
        <Box sx={{ maxWidth: "43.75rem", mx: "auto" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={
              isDisabled
                ? "Message sent. Start a new chat to ask another question."
                : "Ask about travel destinations, itineraries, tips..."
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isDisabled}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: isDisabled ? "#f0f0f0" : "#f5f5f5",
                borderRadius: "0.5rem",
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={onSubmit}
            disabled={isLoading || !value.trim() || isDisabled}
            endIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{
              mt: "0.75rem",
              bgcolor: "#0ea5e9",
              "&:hover": { bgcolor: "#0284c7" },
              borderRadius: "0.5rem",
              textTransform: "none",
              py: "0.6rem",
            }}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </Box>
      </Paper>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2rem",
          background:
            "linear-gradient(to bottom, white 0%, rgba(250, 250, 250, 0) 100%)",
          pointerEvents: "none",
          zIndex: 1,
          transform: "translateY(100%)",
        }}
      />
    </Box>
  );
};

export default ChatInput;
