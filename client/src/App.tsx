import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/HomePage";
import AIAssistant from "./pages/AIAssistantPage";
import CreatePost from "./pages/CreatePostPage";
import Profile from "./pages/ProfilePage";
import ClientRoutes from "./utils/appRoutes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index path={ClientRoutes.HOME} element={<Home />} />
            <Route path={ClientRoutes.AI} element={<AIAssistant />} />
            <Route path={ClientRoutes.POST} element={<CreatePost />} />
            <Route path={ClientRoutes.PROFILE} element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
