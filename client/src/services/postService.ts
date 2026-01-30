import type { Post } from "../utils/types/post.interface";
import apiClient from "./apiClient";

export const getAllPosts = async (): Promise<Post[]> => {
  const data = await apiClient<Post[]>("/post/", {
    method: "GET",
  });

  const posts: Post[] = await convertPostsData(data);

  return posts;
};

export const getAllComentsOfPost = async (postId: string): Promise<number> => {
  const data = await apiClient<any[]>(`/comment?relatedPostID=${postId}`, {
    method: "GET",
  });

  return data.length;
};

export const getUserDetails = async (userId: string): Promise<{ username: string, profileImage: string }> => {
    const data = await apiClient<{ username: string, profileImage: string }>(`/user/${userId}`, {
      method: "GET",
    });

    return data;
};

export const handleLike = async (postId: string, userId: string): Promise<{ likesCount: number }> => {
  return await apiClient<{ likesCount: number }>(`/post/handle-like/${postId}`, {
    method: "POST",
    body: { userId }
  });
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  const userPosts =  await apiClient<Post[]>(`/post?userCreatorID=${userId}`, {
    method: "GET",
  });

  const posts: Post[] = await convertPostsData(userPosts);

  return posts;
};

async function convertPostsData (posts: any): Promise<Post[]> {
    const convertedPosts: Post[] = await Promise.all(
    posts.map(async (post: any) => {
      const userCreator = await getUserDetails(post.userCreatorID);

      return {
        _id: post._id,
        content: post.content,
        userCreatorID: post.userCreatorID,
        imageUrl: post.imageUrl,
        userCreator,
        likesCount: 0,
        isLiked: false,
      };
    })
  );

  return convertedPosts;
}