import api from "./api";
import { getCurrentUserId } from "../context/AuthContext";
import type { Post } from "../utils/types/post.interface";
import { getUserDetails } from "./userService";

export interface TripPostData {
  destination: string;
  startDate: string;
  endDate: string;
  content: string;
  photos: File[];
}

export const createTripPost = async (data: TripPostData & { userCreatorID: string }): Promise<any> => {
  const formData = new FormData();
  formData.append("destination", data.destination);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("content", data.content);
  formData.append("userCreatorID", data.userCreatorID);

  data.photos.forEach((file) => {
    formData.append("photos", file);
  });

  const response = await api.post("/post", formData);
  
  return response.data;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const data = (await api.get<Post[]>("/post/")).data;

  const posts: Post[] = await convertPostsData(data);

  return posts;
};

export const getAllComentsOfPost = async (postId: string): Promise<number> => {
  const data = (await api.get<any[]>(`/comment?relatedPostID=${postId}`)).data;

  return data.length;
};

export const handleLike = async (postId: string, userId: string): Promise<{ likesCount: number }> => {
  return (await api.post<{ likesCount: number }>(`/post/handle-like/${postId}`, {userId})).data;
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  const response = await api.post<{ query: string; results: any[] }>("/post/search", { query });
  const posts: Post[] = await convertPostsData(response.data.results);
  return posts;
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  const userPosts =  await api.get<Post[]>(`/post?userCreatorID=${userId}`);

  const posts: Post[] = await convertPostsData(userPosts.data);
  return posts;
};

async function convertPostsData (posts: any): Promise<Post[]> {
    const convertedPosts: Post[] = await Promise.all(
    posts.map(async (post: any) => {
      const userCreator = await getUserDetails(post.userCreatorID);
      const isLiked = post.likes.includes(getCurrentUserId());

      return {
        _id: post._id,
        content: post.content,
        userCreatorID: post.userCreatorID,
        imageUrl: post.imageUrl || (post.photos && post.photos.length > 0 ? post.photos[0] : undefined),
        userCreator,
        likesCount: post.likes.length || 0,
        isLiked: isLiked || false,
      };
    })
  );

  return convertedPosts;
}
