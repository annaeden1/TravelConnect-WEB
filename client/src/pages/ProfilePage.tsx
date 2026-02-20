import { Box, Button, Paper, Typography } from "@mui/material";
import PostsList from "../components/posts/PostsList";
import { useEffect, useState, useRef } from "react";
import type { Post } from "../utils/types/post.interface";
import { getPostsByUserId } from "../services/postService";
import { getCurrentUserId, useAuth } from "../context/AuthContext";
import { Logout } from "@mui/icons-material";
import avatar from "../assets/avatar.jpg";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { uploadFile } from "../services/fileService";
import { toast } from "react-toastify";

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
      toast.error("Could not logout");
    }
  };

  const imageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setProfileImageSrc(file[0]);
    }
  };

  const handleImageSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadPhoto = async (photo: File | undefined) => {
    const formData = new FormData();
    if (photo) {
      try {
        formData.append("file", photo);
        return await uploadFile(formData);
      } catch (error) {
        console.log(error);
        toast.error("Could not upload file");
      }
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const fetchedPosts = await getPostsByUserId(userId);
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
    // const photoUrl = await uploadPhoto(profileImageSrc);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6">Loading posts...</Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No posts found
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Button onClick={handleLogout}>
        <Logout />
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img
          src={profileImageSrc ? URL.createObjectURL(profileImageSrc) : avatar}
          alt="Profile"
          width="50"
          height="50"
        />
        <Button onClick={handleImageSelection}>
          <CameraAltIcon
            sx={{ color: "black", fontSize: "1.5rem", alignSelf: "center" }}
          />
        </Button>
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        id="profileImage"
        name="profileImage"
        accept="image/*"
        onChange={imageSelected}
        style={{ display: "none" }}
      />
      <h2>My Posts</h2>
      <PostsList posts={posts} />
    </div>
  );
};

export default Profile;
