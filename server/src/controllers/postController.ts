import { Types } from "mongoose";
import { postModel, type IPost } from "../models/postModel";
import genericController from "./genericController";
import type { Request, Response } from "express";
import { FILES_PATH } from "../routes/fileRouter";

class postController extends genericController<IPost> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response) {
    try {
      const obj = req.body;
      const files = req.files as Express.Multer.File[];
      
      const base = `${req.protocol}://${req.get("host")}`;
      const photos: string[] = [];
      
      if (files && files.length > 0) {
        files.forEach(file => {
          photos.push(`${base}/${FILES_PATH}${file.filename}`);
        });
      }

      obj.photos = photos;
      
      if (photos.length > 0) {
        // Set the primary imageUrl for backwards compatibility
        obj.imageUrl = photos[0];
      }
      
      const response = await this.model.create(obj);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
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
