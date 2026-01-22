import { useNavigate, useLocation } from "react-router";
import {
  Box,
  Divider,
  Drawer,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ClientRoutes from "../utils/appRoutes";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: ClientRoutes.HOME, icon: <HomeOutlinedIcon /> },
    { label: "AI Assistant", path: ClientRoutes.AI, icon: <ChatBubbleOutlineOutlinedIcon /> },
    { label: "Create Post", path: ClientRoutes.POST, icon: <AddBoxOutlinedIcon /> },
    { label: "Profile", path: ClientRoutes.PROFILE, icon: <PersonOutlineOutlinedIcon /> },
  ];

  const currentValue = navItems.findIndex(item => item.path === location.pathname);

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 280, flexShrink: 0 }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          TravelConnect
        </Typography>
      </Box>
      <Divider />
      <Tabs
        orientation="vertical"
        value={currentValue === -1 ? 0 : currentValue}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{
          width: "100%",
          "& .MuiTabs-indicator": { display: "none" },
        }}
      >
        {navItems.map((item) => (
          <Tab
            key={item.path}
            icon={item.icon}
            iconPosition="start"
            label={item.label}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              justifyContent: "flex-start",
              p: 1,
              m: 0.5,
              borderRadius: 3,
              backgroundColor: "transparent",
              transition: "all 0.3s ease",
              color: "#000000ff", 
              "&.Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#ffffff",
                fontWeight: "bold",
              }
            }}
          />
        ))}
      </Tabs>
    </Drawer>
  );
};

export default Navbar;