import "./App.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import AppContent from "./components/AppContent";

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
