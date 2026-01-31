import { Navigate } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ClientRoutes from "../utils/appRoutes";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ClientRoutes.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
