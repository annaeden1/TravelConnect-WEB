import { Box, Stack, Typography, Paper } from "@mui/material";
import Comment from "./Comment";
import type { Comment as IComment} from "../../utils/types/comment.interface";

interface CommentsListProps {
  comments: IComment[];
  onDelete: (commentId: string) => void;
}

const CommentsList = ({ comments, onDelete }: CommentsListProps) => {
  if (comments.length === 0) {
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
          No comments found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
        <Stack spacing="1rem">
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} onDelete={onDelete} />
            ))}
        </Stack>
    </Box>
  )
}

export default CommentsList;