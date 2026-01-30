import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = AuthTokens & {
  username: string;
  profileImage: string;
  _id: string;
};

export type RegisterResponse = AuthTokens;

export type ApiError = {
  error: string;
};

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError && error.response?.data?.error) {
    return error.response.data.error;
  }
  return fallback;
};

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await authApi.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  },

  async register(email: string, username: string, password: string): Promise<RegisterResponse> {
    try {
      const { data } = await authApi.post<RegisterResponse>('/auth/register', {
        email,
        username,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await authApi.post('/auth/logout', { refreshToken });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Logout failed'));
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens & { _id: string }> {
    try {
      const { data } = await authApi.post<AuthTokens & { _id: string }>('/auth/refresh-token', {
        refreshToken,
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Token refresh failed'));
    }
  },
};

export default authService;
