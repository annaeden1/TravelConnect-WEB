import type { Comment } from "../utils/types/comment.interface";
import api from "./api";
import { getUserDetails } from "./userService";

export const getAllCommentsOfPost = async (
  postId: string,
): Promise<Comment[]> => {
  const data = (await api.get<Comment[]>(`/comment?relatedPostID=${postId}`)).data;

  return await convertComments(data);
};

export const createComment = async (commentData: {
  description: string;
  relatedPostID: string;
  userCreatorID: string;
}): Promise<Comment> => {
  const data = (await api.post<Comment>("/comment/", commentData)).data;

  return data;
};

export const deleteComment = async (
  commentId: string,
): Promise<{ message: string }> => {
  const data = (await api.delete<{ message: string }>(`/comment/${commentId}`)).data;

  return data;
};

export const updateComment = async (
  commentId: string,
  updatedData: {
    description?: string;
  },
): Promise<Comment> => {
  const data = (await api.put<Comment>(`/comment/${commentId}`, updatedData)).data;

  return data;
};

const convertComments = async (data: any): Promise<Comment[]> => {
  const convertedComments: Comment[] = await Promise.all(
    data.map(async (comment: any) => {
      const userCreator = await getUserDetails(comment.userCreatorID);

      return {
        _id: comment._id,
        relatedPostID: comment.relatedPostID,
        userCreatorID: comment.userCreatorID,
        description: comment.description,
        userCreator: userCreator,
      };
    }),
  );

  return convertedComments as Comment[];
};
