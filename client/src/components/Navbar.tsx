import { useNavigate, useLocation, type NavigateFunction, type Location } from "react-router";
import {
  Box,
  Divider,
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
    <Box
      component="nav"
      sx={{
        width: "17.5rem",
        flexShrink: 0,
        height: "100vh",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: "0.5rem", textAlign: "center", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0ea5e9" }}>
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
                  backgroundColor: "#0ea5e9",
                  color: "#ffffff",
                  fontWeight: "bold",
                }
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default Navbar;