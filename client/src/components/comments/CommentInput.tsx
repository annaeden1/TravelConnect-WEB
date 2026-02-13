import { Box, TextField, Button, Avatar, Paper } from "@mui/material";
import { useState } from "react";
import { getCurrentUser } from "../../context/AuthContext";
import { createComment } from "../../services/commentService";

interface CommentInputProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentInput = ({ postId, onCommentAdded }: CommentInputProps) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getCurrentUser();

  const handlePostComment = async () => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({
        userCreatorID: user?._id || "",
        relatedPostID: postId,
        description: text,
      });

      setText("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderTop: "0.0625rem solid",
        borderColor: "divider",
        p: "1rem",
        boxSizing: "border-box",
        mt: "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: "0.5rem",
          borderRadius: "1rem",
          bgcolor: "action.hover",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ width: "2rem", height: "2rem", bgcolor: "primary.main" }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Add a comment..."
              variant="standard"
              value={text}
              onChange={(e) => setText(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "0.9rem" },
              }}
            />
          </Box>

          <Button
            variant="contained"
            size="small"
            disabled={!text.trim() || isSubmitting}
            onClick={handlePostComment}
            sx={{
              borderRadius: "1rem",
              px: "1.25rem",
              textTransform: "none",
              fontWeight: "bold",
              minWidth: "fit-content",
            }}
          >
            {isSubmitting ? "..." : "Post"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CommentInput;
