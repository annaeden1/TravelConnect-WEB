import { useState } from "react";
import { type TripFormData } from "../components/TripForm";
import { createTripPost } from "../services/postService";
import { getCurrentUserId } from "../context/AuthContext";

export const useCreateTripPost = () => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    startDate: "",
    endDate: "",
    content: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleFormChange = (newData: TripFormData) => {
    setFormData(newData);
    const changedField = Object.keys(newData).find(
      (key) =>
        newData[key as keyof TripFormData] !==
        formData[key as keyof TripFormData],
    );

    if (changedField && validationErrors[changedField]) {
      setValidationErrors((prev) => {
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
      errors.destination = "Destination is required";
      isValid = false;
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
      isValid = false;
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
      isValid = false;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      errors.endDate = "End date must be after start date";
      isValid = false;
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
      isValid = false;
    }

    if (selectedImages.length > 5) {
      setError("You cannot upload more than 5 images");
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
      const userId = getCurrentUserId();
      if (!userId) {
        setError("You must be logged in to create a post.");
        return;
      }

      await createTripPost({
        ...formData,
        photos: selectedImages,
        userCreatorID: userId,
      });
      setSuccess(true);
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        content: "",
      });
      setSelectedImages([]);
    } catch (err) {
      setError("Failed to create trip post. Please try again.");
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
    submitPost,
  };
};
