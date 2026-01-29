import { Types } from "mongoose";
import { postModel, type IPost } from "../models/postModel";
import genericController from "./genericController";
import type { Request, Response } from "express";

class postController extends genericController<IPost> {
  constructor() {
    super(postModel);
  }

  async handleLike(req: Request, res: Response) {
    const { _id: postId } = req.params;
    const { userId } = req.body;

    try {
      const post = await this.model.findById(postId);
      if (!post) {
        return res.status(404).json({ error: `Post with id ${postId} not found` });
      }

      const userLiked = post.likes?.includes(userId) ?? false;
      const userObjectId = Types.ObjectId.createFromHexString(String(userId));
      const updateOp = userLiked ? { $pull: { likes: userObjectId } } : { $push: { likes: userObjectId } };
      const updatedPost = await this.model.findByIdAndUpdate(postId, updateOp, { new: true });
      res.status(200).json({ likesCount: updatedPost?.likes?.length || 0 });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
}

export default new postController();
