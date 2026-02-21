import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import authService, { type LoginResponse } from "../services/authService";
import type { CredentialResponse } from "@react-oauth/google";
import { updateUser as updateUserService } from "../services/userService";

type User = {
  _id: string;
  username: string;
  profileImage: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;
  updateUser: (fields: {
    username?: string;
    profileImage?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "travelconnect_tokens";
const USER_KEY = "travelconnect_user";

type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

const getStoredTokens = (): StoredTokens | null => {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

const storeTokens = (tokens: StoredTokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  return getStoredUser();
};

export const getCurrentUserId = (): string | null => {
  const user = getStoredUser();
  return user?._id ?? null;
};

const storeUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTokens = getStoredTokens();
    const storedUser = getStoredUser();

    if (storedTokens && storedUser) {
      setAccessToken(storedTokens.accessToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const setAuthState = (tokens: StoredTokens, userData: User) => {
    storeTokens(tokens);
    storeUser(userData);
    setAccessToken(tokens.accessToken);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const response: LoginResponse = await authService.login(email, password);

    const userData: User = {
      _id: response._id,
      username: response.username,
      profileImage: response.profileImage,
      email: email,
    };

    setAuthState(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      },
      userData,
    );
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    const response = await authService.register(email, username, password);

    const userData: User = {
      _id: response._id,
      username: response.username,
      profileImage: response.profileImage,
      email: email,
    };

    setAuthState(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      },
      userData,
    );
  };

  const logout = async () => {
    const tokens = getStoredTokens();
    if (tokens?.refreshToken) {
      try {
        await authService.logout(tokens.refreshToken);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    clearTokens();
    setAccessToken(null);
    setUser(null);
  };

  const updateUser = async (fields: {
    username?: string;
    profileImage?: string;
  }) => {
    const currentUser = getStoredUser();
    if (!currentUser) throw new Error("Not authenticated");
    const updated = await updateUserService(currentUser._id, fields);
    const newUser: User = { ...currentUser, ...updated };
    storeUser(newUser);
    setUser(newUser);
  };

  const googleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const response: LoginResponse =
        await authService.googleSignInSuccess(credentialResponse);

      const userData: User = {
        _id: response._id,
        username: response.username,
        profileImage: response.profileImage,
        email: response.email,
      };

      setAuthState(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        userData,
      );
    } catch (error) {
      console.error("Google Login error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        logout,
        googleLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
