import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import { Home, AIAssistant, CreatePost, Profile, LoginPage } from "../pages";
import ClientRoutes from "../utils/appRoutes";

const AppContent = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path={ClientRoutes.LOGIN} element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route
            path={ClientRoutes.HOME}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={ClientRoutes.AI}
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path={ClientRoutes.POST}
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path={ClientRoutes.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to={ClientRoutes.HOME} replace />} />
        <Route path="*" element={<Navigate to={ClientRoutes.HOME} replace />} />
      </Routes>
    </>
  );
};

export default AppContent;
