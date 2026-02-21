import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { type Comment as IComment } from "../../utils/types/comment.interface";
import { updateComment } from "../../services/commentService";
import { Delete } from "@mui/icons-material";
import { getCurrentUser } from "../../context/AuthContext";
import { validateComments } from "../../utils/validation";
import { toast } from "react-toastify";

interface CommentProps {
  comment: IComment;
  onDelete: (commentId: string) => void;
}

const Comment = ({ comment, onDelete }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    comment.description,
  );
  const [description, setDescription] = useState(comment.description);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedDescription(description);
  };

  const handleSave = async () => {
    const validation = validateComments(editedDescription);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    } else {
      setDescription(editedDescription);
    }
    setIsEditing(false);
    await updateComment(comment._id, { description: editedDescription });
  };

  const isCreaterOfComment =
    comment.userCreator.username === getCurrentUser()?.username;

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 2,
        mb: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {comment.userCreator.profileImage ? (
            <img
              src={comment.userCreator.profileImage}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="profile"
            />
          ) : (
            comment.userCreator.username.charAt(0).toUpperCase()
          )}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {comment.userCreator.username}
        </Typography>
      </Box>
      {/* Content Area */}
      <Box sx={{ px: 2 }}>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          <Typography variant="body2">{description}</Typography>
        )}
      </Box>
      {/* Actions Area - Only shown if User is Creator */}
      {isCreaterOfComment && (
        <Box sx={{ display: "flex", gap: 1, mt: 2, px: 2 }}>
          {isEditing ? (
            <Button onClick={handleSave} variant="contained" size="small">
              Save
            </Button>
          ) : (
            <Button onClick={handleEditToggle} variant="outlined" size="small">
              Edit
            </Button>
          )}
          <Button
            onClick={() => onDelete(comment._id)}
            variant="outlined"
            color="error"
            size="small"
          >
            <Delete />
          </Button>
        </Box>
      )}{" "}
      {/* Removed the semicolon that was here! */}
    </Box>
  );
};

export default Comment;
