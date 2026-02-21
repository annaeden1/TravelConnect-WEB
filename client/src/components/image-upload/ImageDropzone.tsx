import React, { useRef, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageDropzone = ({ onFilesSelected }: ImageDropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      component="div"
      onClick={onButtonClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      sx={{
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'grey.400',
        borderRadius: "0.5rem",
        p: "1rem",
        textAlign: 'center',
        bgcolor: dragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <Stack spacing={0.5} alignItems="center">
        <CloudUploadIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="body2" color="text.primary">
          Drag & Drop to Upload or Click to Browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Support multiple images
        </Typography>
      </Stack>
    </Box>
  );
};

export default ImageDropzone;
