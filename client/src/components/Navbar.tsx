import { useNavigate, useLocation, type NavigateFunction, type Location } from "react-router";
import {
  Box,
  Divider,
  Drawer,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import navItems from "../utils/types/navbarItems";

const Navbar = () => {
  const navigate : NavigateFunction = useNavigate();
  const location : Location = useLocation();

  const currentValue = navItems.findIndex(item => item.path === location.pathname);

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: "17.5rem", flexShrink: 0 }}>
      <Box sx={{ p: "0.5rem", textAlign: "center" }}>
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
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Tab
              key={item.path}
              icon={<IconComponent />}
              iconPosition="start"
              label={item.label}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                justifyContent: "flex-start",
                p: "0.75rem",
                m: "0.5rem",
                borderRadius: "0.5rem",
                minHeight: "3.5rem",
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
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default Navbar;