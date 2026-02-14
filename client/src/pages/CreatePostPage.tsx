import { Typography, Button, Box, CircularProgress, Alert, Stack, AppBar, Toolbar, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TripForm from '../components/TripForm';
import ImageUploader from '../components/ImageUploader';
import { useCreateTripPost } from '../hooks/useCreateTripPost';

const CreatePostPage = () => {
  const {
    formData,
    selectedImages,
    loading,
    error,
    success,
    validationErrors,
    handleFormChange,
    handleImagesSelected,
    submitPost
  } = useCreateTripPost();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fafafa",
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0ea5e9" }}>
        <Toolbar>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              marginRight: "0.75rem",
            }}
          >
            <AddPhotoAlternateIcon sx={{ color: "white" }} />
          </Avatar>
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="white">
              Create Trip Post
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.85)">
              Share your travel plans with the community
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Box sx={{ maxWidth: "sm", mx: "auto" }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>Trip post created successfully!</Alert>}

          <Stack spacing={2}>
            <TripForm 
              data={formData} 
              onChange={handleFormChange} 
              errors={validationErrors}
            />

            <Box>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
                Photos (Max 5)
              </Typography>
              <ImageUploader 
                onImagesSelected={handleImagesSelected} 
                selectedImages={selectedImages}
              />
            </Box>

            <Button
              variant="contained"
              size="medium"
              fullWidth
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon fontSize="small" />}
              onClick={submitPost}
              disabled={loading}
              sx={{ 
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
            >
              {loading ? 'Sharing...' : 'Share Trip'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostPage;