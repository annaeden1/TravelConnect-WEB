import React from 'react';
import { Box, Alert } from '@mui/material';
import ImageDropzone from './image-upload/ImageDropzone';
import ImagePreviewList from './image-upload/ImagePreviewList';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: File[];
}

const ImageUploader = ({ onImagesSelected, selectedImages }: ImageUploaderProps) => {

  const handleFilesSelected = (files: File[]) => {
    // Append the new files to the already selected ones
    const updatedFiles = [...selectedImages, ...files];
    onImagesSelected(updatedFiles);
  };

  // Helper validation simulation for UI purposes
  const isError = selectedImages.length > 5;

  return (
    <Box>
      <ImageDropzone onFilesSelected={handleFilesSelected} />

      {isError && (
        <Alert severity="error" sx={{ mt: "1rem" }}>
          You have selected more than 5 images. Please remove some images.
        </Alert>
      )}

      <ImagePreviewList 
        selectedImages={selectedImages}
        onRemoveImage={(index) => {
          const updatedFiles = selectedImages.filter((_, i) => i !== index);
          onImagesSelected(updatedFiles);
        }} 
      />
    </Box>
  );
};

export default ImageUploader;
