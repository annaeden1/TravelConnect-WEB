import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./components/pages/HomePage";
import AIAssistant from "./components/pages/AIAssistantPage";
import CreatePost from "./components/pages/CreatePostPage";
import Profile from "./components/pages/ProfilePage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index path="/home" element={<Home />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
