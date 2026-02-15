import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, CircularProgress, Divider, Stack, TextField, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ClientRoutes from "../../utils/appRoutes";
import { validateSignUpForm } from "../../utils/validation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const textFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    backgroundColor: "#f8f9fa",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0077b6",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0077b6",
    },
  },
};

type SignUpFormProps = {
  onSwitchToLogin: () => void;
};

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const validation = validateSignUpForm(email, username, password);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      await register(email, username, password);
      toast.success("Account created successfully!");
      navigate(ClientRoutes.HOME);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      if (errorMessage.toLowerCase().includes("email")) {
        setEmailError(errorMessage);
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignInSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      toast.success("Welcome!");
      navigate(ClientRoutes.HOME);
    } catch (error) {
      console.error("Google Sign In error:", error);
      toast.error("Google Sign In failed");
    }
  };

  const onGoogleSignInError = () => {
    toast.error("Google Sign In failed");
  };

  return (
    <Box
      sx={{
        width: "50%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "3rem",
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: "22rem" }}>
        <Box sx={{ mb: "1rem" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e", mb: "0.5rem" }}>
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Join TravelConnect today
          </Typography>
        </Box>

        <form onSubmit={handleSignUp}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              sx={textFieldSx}
            />

            <TextField
              label="Username"
              type="text"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              sx={textFieldSx}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              sx={textFieldSx}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                backgroundColor: "#0077b6",
                borderRadius: "0.75rem",
                py: "0.875rem",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 0.25rem 1rem rgba(0, 119, 182, 0.3)",
                "&:hover": {
                  backgroundColor: "#005f8d",
                  boxShadow: "0 0.5rem 1.5rem rgba(0, 119, 182, 0.4)",
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </Stack>
        </form>

        <Button
          variant="outlined"
          fullWidth
          onClick={onSwitchToLogin}
          disabled={isLoading}
          sx={{
            borderColor: "#0077b6",
            color: "#0077b6",
            borderRadius: "0.75rem",
            py: "0.875rem",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderWidth: "0.125rem",
            "&:hover": {
              borderColor: "#005f8d",
              backgroundColor: "rgba(0, 119, 182, 0.04)",
              borderWidth: "0.125rem",
            },
          }}
        >
          Back to Login
        </Button>

        <Divider sx={{ my: "0.5rem" }}>
          <Typography variant="body2" sx={{ color: "text.secondary", px: "1rem" }}>
            or
          </Typography>
        </Divider>
        <GoogleLogin onSuccess={onGoogleSignInSuccess} onError={onGoogleSignInError} />
      </Stack>
    </Box>
  );
};

export default SignUpForm;
