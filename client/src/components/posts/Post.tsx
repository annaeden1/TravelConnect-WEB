import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getAllComentsOfPost, deletePost } from "../../services/postService";
import { handleLike } from "../../services/postService";
import { type Post } from "../../utils/types/post.interface";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../../context/AuthContext";
import EditPostModal from "./EditPostModal";

interface PostComponentProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: (updatedPost: Post) => void;
}

const PostComponent = ({ post, onDelete, onUpdate }: PostComponentProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = getCurrentUserId() === post.userCreatorID;
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const navigate = useNavigate();
  
  const handleCommentClick = () => {
    navigate(`/comments/${post._id}`);
  };

  useEffect(() => {
      const fetchCommentsCount = async () => {
        try {
          const fetchedCommentsCount = await getAllComentsOfPost(post._id);
          setCommentsCount(fetchedCommentsCount);
        } catch (err) {
          console.error(err instanceof Error ? err.message : "Failed to fetch comments");
        }
      };  
      fetchCommentsCount();
  }, []);

  const handleLikes = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const result = await handleLike(post._id, userId);
      setLikesCount(result.likesCount);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      py: 1
    }}>
      <Card sx={{
        maxWidth: 600,
        width: '100%',
        borderRadius: 2,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
        }
      }}>
        {/* Post Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {post.userCreator.profileImage ? (
                <img src={post.userCreator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                post.userCreator.username.charAt(0).toUpperCase()
              )}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {post.userCreator.username}
            </Typography>
          </Box>
          
          {isCreator && (
            <Box>
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleEditClick}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>


        {/* Post Image */}
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={post.imageUrl}
            alt="Post image"
            sx={{
              objectFit: 'cover',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          />
        )}

        {/* Post Content */}
        <CardContent sx={{ pb: 1 }}>
          {post.destination && (
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary" gutterBottom>
              📍 {post.destination}
            </Typography>
          )}
          {(post.startDate || post.endDate) && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              🗓️ {post.startDate ? new Date(post.startDate).toLocaleDateString() : 'N/A'} - {post.endDate ? new Date(post.endDate).toLocaleDateString() : 'N/A'}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, mt: 1, whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
        </CardContent>

        {/* Action Buttons */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleLikes}
              disabled={isLoading}
              sx={{
                color: isLiked ? 'error.main' : 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likesCount}
            </Typography>

            <IconButton
              onClick={handleCommentClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {commentsCount}
            </Typography>
          </Stack>
        </Box>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {editModalOpen && (
        <EditPostModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={post}
          onPostUpdated={(updatedPost) => {
            if (onUpdate) onUpdate(updatedPost);
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default PostComponent;