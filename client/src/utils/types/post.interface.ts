export interface Post {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  content: string;
  imageUrl?: string;
  photos?: string[];
  userCreatorID: string;
  userCreator: { username: string, profileImage: string };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}