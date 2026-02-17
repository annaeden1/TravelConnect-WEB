export interface Post {
  _id: string;
  content: string;
  imageUrl?: string;
  userCreatorID: string;
  userCreator: { username: string, profileImage: string };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}