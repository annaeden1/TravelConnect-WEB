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

  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

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
