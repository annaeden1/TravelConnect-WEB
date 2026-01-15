import mongoose from "mongoose";

interface IComment {
  _id: mongoose.Types.ObjectId,
  description: String,
  relatedPostID: mongoose.Types.ObjectId,
  userCreatorID: mongoose.Types.ObjectId
}

const commentSchema = new mongoose.Schema<IComment>({
  description: {
    type: String,
    required: true,
  },
  relatedPostID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userCreatorID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const commentModel = mongoose.model("comment", commentSchema);

export { commentModel , type IComment };
