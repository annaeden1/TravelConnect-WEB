import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
