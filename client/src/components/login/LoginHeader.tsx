import { Avatar, Box, Stack, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";

const LoginHeader = () => {
  return (
    <Box
      sx={{
        width: "50%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0077b6 0%, #023e8a 50%, #03045e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        },
      }}
    >
      {/* Logo Avatar */}
      <Avatar
        sx={{
          width: "6rem",
          height: "6rem",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(0.5rem)",
          border: "0.2rem solid rgba(255, 255, 255, 0.3)",
          mb: "2rem",
          boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.2)",
        }}
      >
        <FlightIcon sx={{ fontSize: "3rem", color: "#ffffff" }} />
      </Avatar>

      {/* Title and Subtitle */}
      <Stack spacing={1} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            textShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.2)",
          }}
        >
          TravelConnect
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            fontWeight: 400,
            maxWidth: "20rem",
          }}
        >
          Discover the world, one journey at a time
        </Typography>
      </Stack>

      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          bottom: "2rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",
              backgroundColor: i === 0 ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoginHeader;
