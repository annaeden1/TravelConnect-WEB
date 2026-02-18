export interface Comment {
  _id: string;
  relatedPostID: string;
  userCreatorID: string;
  description: string;
  userCreator: { username: string; profileImage: string };
}