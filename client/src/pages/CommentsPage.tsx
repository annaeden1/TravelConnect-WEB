import { useEffect, useState } from "react";
import type { Comment } from "../utils/types/comment.interface";
import CommentsList from "../components/comments/CommentList";
import { useParams } from "react-router";
import {
  deleteComment,
  getAllCommentsOfPost,
} from "../services/commentService";
// import CommentInput from "../components/comments/CommentInput";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const { postId } = useParams<{ postId: string }>();

  const fetchComments = async () => {
    if (!postId) return;

    try {
      const fetchedComments = await getAllCommentsOfPost(postId ?? "");
      setComments(fetchedComments);
    } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setComments([]); 
        return;
      }
    }
    console.error(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId: string) => {
    const res = await deleteComment(commentId);
    if (res) {
      await fetchComments();
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      <ArrowBack onClick={handleBack} />
      <CommentsList comments={comments} onDelete={handleDelete} />
    </Box>
  );
};
{
  /* <CommentInput /> */
}
export default CommentsPage;
