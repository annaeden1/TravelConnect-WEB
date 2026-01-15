import mongoose from "mongoose";

interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  profileImage: string;
  password: string;
  refreshTokens: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
  }
});

const userModel = mongoose.model("user", userSchema);
export { userModel, type IUser };
