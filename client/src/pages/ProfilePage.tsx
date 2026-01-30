import { Box, Typography } from "@mui/material";
import PostsList from "../components/posts/PostsList";
import { useEffect, useState } from "react";
import type { Post } from "../utils/types/post.interface";
import { getPostsByUserId } from "../services/postService";

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const fetchedPosts = await getPostsByUserId("69590fea8974fd6b36147084"); // Replace with actual user ID
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6">Loading posts...</Typography>
      </Box>
    );
  }

  if (error) { 
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <h2>My Posts</h2>
        <PostsList posts={posts} />
    </div>
  );
};

export default Profile;