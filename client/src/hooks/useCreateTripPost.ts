import { useState } from 'react';
import { type TripFormData } from '../components/TripForm';
import { createTripPost } from '../services/postService';

export const useCreateTripPost = () => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFormChange = (newData: TripFormData) => {
    setFormData(newData);
    // Clear validation error for the modified field
    const changedField = Object.keys(newData).find(
      key => newData[key as keyof TripFormData] !== formData[key as keyof TripFormData]
    );

    if (changedField && validationErrors[changedField]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[changedField];
        return newErrors;
      });
    }
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
      isValid = false;
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
      isValid = false;
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (selectedImages.length > 5) {
      setError('You cannot upload more than 5 images');
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const submitPost = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('destination', formData.destination);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('description', formData.description);
      
      selectedImages.forEach((image) => {
        data.append('photos', image);
      });

      await createTripPost(data);
      setSuccess(true);
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        description: '',
      });
      setSelectedImages([]);
    } catch (err) {
      setError('Failed to create trip post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    selectedImages,
    loading,
    error,
    success,
    validationErrors,
    handleFormChange,
    handleImagesSelected,
    submitPost
  };
};
