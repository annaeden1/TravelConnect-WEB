import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PostsList from "../components/posts/PostsList";
import { useEffect, useState, useRef } from "react";
import type { Post } from "../utils/types/post.interface";
import { getPostsByUserId } from "../services/postService";
import { getCurrentUserId, useAuth } from "../context/AuthContext";
import { Edit, Save, Cancel } from "@mui/icons-material";
import avatar from "../assets/avatar.jpg";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { uploadFile } from "../services/fileService";
import { toast } from "react-toastify";
import { validateUsername } from "../utils/validation";
import axios from "axios";

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profileImageSrc, setProfileImageSrc] = useState<File | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user?.username) {
      setUsernameInput(user.username);
    }
  }, [user?.username]);

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
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setPosts([]);
            return;
          }
        }
        console.error(
          err instanceof Error ? err.message : "Failed to fetch posts",
        );
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  const imageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) setProfileImageSrc(file[0]);
  };

  const handleImageSelection = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const uploadPhoto = async (photo: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", photo);
    try {
      return await uploadFile(formData);
    } catch {
      toast.error("Could not upload photo");
    }
  };

  const handleEdit = () => {
    setUsernameInput(user?.username ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUsernameInput(user?.username ?? "");
    setProfileImageSrc(undefined);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const validation = validateUsername(usernameInput);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    setIsSaving(true);
    try {
      let photoUrl = user?.profileImage;

      if (profileImageSrc) {
        const uploaded = await uploadPhoto(profileImageSrc);
        if (uploaded) photoUrl = uploaded;
      }

      await updateUser({
        username: usernameInput.trim(),
        profileImage: photoUrl,
      });
      toast.success("Profile updated!");
      setIsEditing(false);
      setProfileImageSrc(undefined);
    } catch {
      toast.error("Could not update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post)
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography variant="h6">Loading posts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const avatarSrc = profileImageSrc
    ? URL.createObjectURL(profileImageSrc)
    : user?.profileImage || avatar;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          borderRadius: 3,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            component="img"
            src={avatarSrc}
            alt="Profile"
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />
          {isEditing && (
            <IconButton
              onClick={handleImageSelection}
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "grey.300",
                "&:hover": { backgroundColor: "grey.100" },
              }}
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          )}
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
        {isEditing ? (
          <TextField
            label="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            size="small"
            autoFocus
            sx={{ width: 220 }}
          />
        ) : (
          <Typography variant="h6" fontWeight={600}>
            {user?.username ?? "—"}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Box display="flex" gap={1}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={
                  isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Save />
                  )
                }
                onClick={handleSave}
                disabled={isSaving}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        My Posts
      </Typography>
      {posts.length === 0 ? (
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
      ) : (
        <PostsList 
          posts={posts} 
          onDelete={handlePostDeleted}
          onUpdate={handlePostUpdated}
        />
      )}
    </Box>
  );
};

export default Profile;
