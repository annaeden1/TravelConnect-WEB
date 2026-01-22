import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./components/pages/HomePage";
import AIAssistant from "./components/pages/AIAssistantPage";
import CreatePost from "./components/pages/CreatePostPage";
import Profile from "./components/pages/ProfilePage";
import ClientRoutes from "./utils/appRoutes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index path={ClientRoutes.HOME} element={<Home />} />
          <Route path={ClientRoutes.AI} element={<AIAssistant />} />
          <Route path={ClientRoutes.POST} element={<CreatePost />} />
          <Route path={ClientRoutes.PROFILE} element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
