import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageDropzone = ({ onFilesSelected }: ImageDropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);


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
  };

  return (
    <Box
      component="div"
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
      <Stack spacing={0.5} alignItems="center">
        <CloudUploadIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="body2" color="text.primary">
          Drag & Drop to Upload
        </Typography>
        <Typography variant="caption" color="text.secondary">
          (Upload disabled)
        </Typography>
      </Stack>
    </Box>
  );
};

export default ImageDropzone;
