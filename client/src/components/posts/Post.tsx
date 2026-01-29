import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
  Stack
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useEffect, useState } from "react";
import { getAllComentsOfPost } from "../../services/postService";
import { handleLike } from "../../services/postService";
import { type Post } from "../../utils/types/post.interface";

const PostComponent = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

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
      const result = await handleLike(post._id, post.userCreatorID); // Replace with actual user ID
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
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
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
    </Box>
  );
};

export default PostComponent;