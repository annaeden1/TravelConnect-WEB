import { useState } from "react";
import { Box } from "@mui/material";
import LoginHeader from "../components/login/LoginHeader";
import LoginForm from "../components/login/LoginForm";
import SignUpForm from "../components/login/SignUpForm";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <LoginHeader />
      {isSignUp ? (
        <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />
      ) : (
        <LoginForm onSwitchToSignUp={() => setIsSignUp(true)} />
      )}
    </Box>
  );
};

export default LoginPage;
