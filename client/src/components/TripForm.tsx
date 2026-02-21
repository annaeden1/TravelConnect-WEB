import React from 'react';
import { TextField, Stack, Box } from '@mui/material';

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  content: string;
}

interface TripFormProps {
  data: TripFormData;
  onChange: (data: TripFormData) => void;
  errors?: Record<string, string>;
}

const TripForm = ({ data, onChange, errors = {} }: TripFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack spacing={2}>
        <TextField
          size="small"
          required
          fullWidth
          id="destination"
          name="destination"
          label="Destination"
          variant="outlined"
          value={data.destination || ''}
          onChange={handleChange}
          error={!!errors.destination}
          helperText={errors.destination}
          placeholder="e.g., Kyoto, Japan"
        />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            size="small"
            required
            fullWidth
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            value={data.startDate || ''}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputBase-input::-webkit-calendar-picker-indicator': {
                filter: 'grayscale(1) brightness(0)', // Force black
              }
            }}
          />
          <TextField
            size="small"
            required
            fullWidth
            id="endDate"
            name="endDate"
            label="End Date"
            type="date"
            variant="outlined"
            value={data.endDate || ''}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputBase-input::-webkit-calendar-picker-indicator': {
                 filter: 'grayscale(1) brightness(0)', // Force black
              }
            }}
          />
        </Box>

        <TextField
          size="small"
          required
          fullWidth
          id="content"
          name="content"
          label="Content"
          variant="outlined"
          multiline
          rows={3}
          value={data.content || ''}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          placeholder="Tell us about your trip plan..."
        />
      </Stack>
    </Box>
  );
};

export default TripForm;
