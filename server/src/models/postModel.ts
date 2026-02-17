import mongoose from "mongoose";

interface IPost {
  _id: mongoose.Types.ObjectId;
  destination: string;
  startDate: Date;
  endDate: Date;
  description: string;
  photos?: string[];
  userCreatorID: mongoose.Types.ObjectId;
}

const postSchema = new mongoose.Schema<IPost>({
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    default: [],
  },
  userCreatorID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const postModel = mongoose.model("post", postSchema);
export { postModel, type IPost };