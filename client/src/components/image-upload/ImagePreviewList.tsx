import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type ImagePreviewItem = File | string;

interface ImagePreviewListProps {
  selectedImages: ImagePreviewItem[];
  onRemoveImage?: (index: number) => void;
}

const ImagePreviewList = ({ selectedImages, onRemoveImage }: ImagePreviewListProps) => {
  if (selectedImages.length === 0) return null;

  return (
    <Box sx={{ mt: "1.5rem" }}> 
      <Typography variant="subtitle2" gutterBottom>
        Selected Images ({selectedImages.length})
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: "1rem" }}>
        {selectedImages.map((item, index) => {
          const isFile = item instanceof File;
          const src = isFile ? URL.createObjectURL(item as File) : (item as string);
          // Simple key fallback
          const key = isFile ? `${(item as File).name}-${index}` : `${src}-${index}`;

          return (
            <Box 
              key={key}
              sx={{ 
                width: { xs: 'calc(50% - 0.5rem)', sm: 'calc(33.33% - 0.5rem)', md: 'calc(25% - 0.5rem)' },
                flexGrow: 0,
                flexShrink: 0
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: "0.5rem",
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Preview ${index}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveImage) {
                      onRemoveImage(index);
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ImagePreviewList;
