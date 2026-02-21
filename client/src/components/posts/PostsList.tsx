import { Box, Stack, Typography, Paper } from "@mui/material";
import PostComponent from "./Post";
import type { Post } from "../../utils/types/post.interface";

interface PostsListProps {
  posts: Post[];
  onDelete?: (postId: string) => void;
  onUpdate?: (updatedPost: Post) => void;
}

const PostsList = ({ posts, onDelete, onUpdate } : PostsListProps) => {
  if (posts.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No posts found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
        <Stack spacing="1rem">
            {posts.map((post) => (
              <PostComponent 
                key={post._id} 
                post={post} 
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
        </Stack>
    </Box>
  )
}

export default PostsList;