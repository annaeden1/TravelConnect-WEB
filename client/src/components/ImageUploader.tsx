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
    // Forward the files to the parent component
    onImagesSelected(files);
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
        onRemoveImage={() => {
          // Remove logic omitted for now as per original component
        }} 
      />
    </Box>
  );
};

export default ImageUploader;
