import { useState, useEffect } from "react";
import PostsList from "../components/posts/PostsList";
import { getAllPosts, searchPosts } from "../services/postService";
import type { Post } from "../utils/types/post.interface";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllPosts = async () => {
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchAllPosts().finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchAllPosts();
      return;
    }

    setSearching(true);
    try {
      const results = await searchPosts(searchTerm.trim());
      setPosts(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      fetchAllPosts();
    }
  };

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts... (press Enter)"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Paper>

      {/* Posts List */}
      <PostsList posts={posts} />
    </Box>
  );
};

export default Home;
