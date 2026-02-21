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
import ImageUploader from '../ImageUploader';

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
}

const EditPostModal = ({ open, onClose, post, onPostUpdated }: EditPostModalProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: post.destination || '', 
    startDate: post.startDate ? post.startDate.split('T')[0] : '', 
    endDate: post.endDate ? post.endDate.split('T')[0] : '', 
    content: post.content,
  });
  
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    post.photos && post.photos.length > 0 
      ? post.photos 
      : (post.imageUrl ? [post.imageUrl] : [])
  );
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

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
    
    if (existingPhotos.length + newPhotos.length > 5) {
      setError('You cannot have more than 5 images in a post');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('content', formData.content);
      
      if (formData.destination) submitData.append('destination', formData.destination);
      if (formData.startDate) submitData.append('startDate', formData.startDate);
      if (formData.endDate) submitData.append('endDate', formData.endDate);

      // Append existing photos (URLs to keep)
      existingPhotos.forEach((photoUrl) => {
        submitData.append('existingPhotos', photoUrl);
      });

      // Append new photos
      newPhotos.forEach((file) => {
        submitData.append('photos', file);
      });

      const updatedPostData = await updatePost(post._id, submitData);
      
      onPostUpdated(updatedPostData);
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
        
        <TripForm 
          data={formData} 
          onChange={handleFormChange}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
            Photos (Max 5)
          </Typography>
          <ImageUploader 
            existingImages={existingPhotos}
            onExistingImagesChange={setExistingPhotos}
            selectedImages={newPhotos}
            onImagesSelected={setNewPhotos}
          />
        </Box>

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
