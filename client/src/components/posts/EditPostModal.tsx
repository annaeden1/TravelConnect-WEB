import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import TripForm, { type TripFormData } from '../TripForm';
import { updatePost } from '../../services/postService';
import type { Post } from '../../utils/types/post.interface';

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
}

const EditPostModal = ({ open, onClose, post, onPostUpdated }: EditPostModalProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: post.content.split('\n')[0] || '', // Using a simplified extraction, ideally this should be part of the Post interface. We'll reuse the TripForm but content is the only sure thing on Post right now.
    startDate: '', // We don't have this on the Post interface right now. Will just leave empty or extract from content for now.
    endDate: '', // We don't have this on the Post interface right now.
    content: post.content,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (newData: TripFormData) => {
    setFormData(newData);
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPostData = {
        content: formData.content,
        // Backend put route accepts these but they aren't on Post interface currently. Sending them anyway as they are in the schema.
        ...(formData.destination ? { destination: formData.destination } : {}),
        ...(formData.startDate ? { startDate: formData.startDate } : {}),
        ...(formData.endDate ? { endDate: formData.endDate } : {}),
      };

      await updatePost(post._id, updatedPostData);
      
      onPostUpdated({
        ...post,
        content: formData.content
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={{ mb: 2 }}>
           <Typography variant="body2" color="text.secondary" gutterBottom>
              Note: You can only edit the text content of your post. Photos cannot be changed after creation.
           </Typography>
        </Box>

        <TripForm 
          data={formData} 
          onChange={handleFormChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;
