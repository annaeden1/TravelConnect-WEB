import { Box, Button, Paper, Typography } from "@mui/material";
import PostsList from "../components/posts/PostsList";
import { useEffect, useState } from "react";
import type { Post } from "../utils/types/post.interface";
import { getPostsByUserId } from "../services/postService";
import { getCurrentUserId, useAuth } from "../context/AuthContext";
import { Logout } from "@mui/icons-material"

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const fetchedPosts = await getPostsByUserId(userId);
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6">Loading posts...</Typography>
      </Box>
    );
  }

    if (posts.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No posts found
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Button onClick={handleLogout}><Logout /></Button>
      <h2>My Posts</h2>
      <PostsList posts={posts} />
    </div>
  );
};

export default Profile;
