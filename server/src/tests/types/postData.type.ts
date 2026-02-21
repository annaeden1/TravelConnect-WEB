export type PostData = {
  _id?: string;
  content: string;
  destination: string;
  startDate: string | Date;
  endDate: string | Date;
  imageUrl?: string;
  userCreatorID: string;
  likes?: string[];
};