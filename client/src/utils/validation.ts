export type ValidationResult = {
  isValid: boolean;
  message: string;
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  return { isValid: true, message: '' };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }

  return { isValid: true, message: '' };
};

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) return passwordResult;

  return { isValid: true, message: '' };
};

export const validateSignUpForm = (
  email: string,
  username: string,
  password: string
): ValidationResult => {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) return emailResult;

  const usernameResult = validateUsername(username);
  if (!usernameResult.isValid) return usernameResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) return passwordResult;

  return { isValid: true, message: '' };
};

export interface TripFormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  message: string;
}

export const validateTripForm = (
  formData: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    content: string;
  },
  totalImageCount: number
): TripFormValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;
  let message = "";

  if (!formData.destination?.trim()) {
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

  if (!formData.content?.trim()) {
    errors.content = "Content is required";
    isValid = false;
  }

  if (totalImageCount > 5) {
    message = "You cannot upload more than 5 images";
    isValid = false;
  } else if (!isValid && Object.keys(errors).length > 0) {
    message = "Please fix the form errors";
  }

  return { isValid, errors, message };
};
