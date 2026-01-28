import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AIAssistant from "./pages/AIAssistantPage";
import CreatePost from "./pages/CreatePostPage";
import Profile from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ClientRoutes from "./utils/appRoutes";
import { AuthProvider } from "./context/AuthContext";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === ClientRoutes.LOGIN;

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route index path={ClientRoutes.HOME} element={<Home />} />
        <Route path={ClientRoutes.AI} element={<AIAssistant />} />
        <Route path={ClientRoutes.POST} element={<CreatePost />} />
        <Route path={ClientRoutes.PROFILE} element={<Profile />} />
        <Route path={ClientRoutes.LOGIN} element={<LoginPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

