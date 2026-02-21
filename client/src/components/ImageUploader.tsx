import { Box, Alert } from '@mui/material';
import ImageDropzone from './image-upload/ImageDropzone';
import ImagePreviewList, { type ImagePreviewItem } from './image-upload/ImagePreviewList';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: File[];
  existingImages?: string[];
  onExistingImagesChange?: (images: string[]) => void;
}

const ImageUploader = ({ onImagesSelected, selectedImages, existingImages = [], onExistingImagesChange }: ImageUploaderProps) => {

  const handleFilesSelected = (files: File[]) => {
    // Append the new files to the already selected ones
    const updatedFiles = [...selectedImages, ...files];
    onImagesSelected(updatedFiles);
  };

  const totalImages = selectedImages.length + existingImages.length;
  // Helper validation simulation for UI purposes
  const isError = totalImages > 5;

  const combinedImages: ImagePreviewItem[] = [...existingImages, ...selectedImages];

  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      if (onExistingImagesChange) {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        onExistingImagesChange(newExisting);
      }
    } else {
      const fileIndex = index - existingImages.length;
      const updatedFiles = selectedImages.filter((_, i) => i !== fileIndex);
      onImagesSelected(updatedFiles);
    }
  };

  return (
    <Box>
      <ImageDropzone onFilesSelected={handleFilesSelected} />

      {isError && (
        <Alert severity="error" sx={{ mt: "1rem" }}>
          You have selected more than 5 images limit. Please remove some images.
        </Alert>
      )}

      <ImagePreviewList 
        selectedImages={combinedImages}
        onRemoveImage={handleRemoveImage} 
      />
    </Box>
  );
};

export default ImageUploader;
