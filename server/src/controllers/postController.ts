import { Types } from "mongoose";
import { postModel, type IPost } from "../models/postModel";
import genericController from "./genericController";
import type { Request, Response } from "express";
import { FILES_PATH } from "../routes/fileRouter";
import llmService from "../services/llmService";
import searchService from "../services/searchService";

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
        files.forEach((file) => {
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
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  // Post search method
  async searchPosts(req: Request, res: Response) {
    const { query } = req.body;

    // Validate request body
    if (query === undefined || query === null) {
      return res.status(400).json({ message: "query field is required" });
    }

    if (typeof query !== "string") {
      return res.status(400).json({ message: "query must be a string" });
    }

    if (query.trim() === "") {
      return res.status(400).json({ message: "query cannot be empty" });
    }

    try {
      // Parse the query using LLM service
      const parsedQuery = await llmService.parseSearchQuery(query);

      // Search posts using the parsed query
      let results: any[] = [];

      try {
        results = await searchService.searchPosts(parsedQuery);
      } catch (searchError) {
        console.warn(
          "Advanced search failed, falling back to simple search:",
          searchError,
        );
        // Fallback to simple text search
        results = await searchService.simpleTextSearch(query.trim());
      }

      res.status(200).json({
        query: query,
        results: results,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error searching posts" });
    }
  }

  async handleLike(req: Request, res: Response) {
    const { _id: postId } = req.params;
    const { userId } = req.body;

    try {
      const post = await this.model.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ error: `Post with id ${postId} not found` });
      }

      const userLiked = post.likes?.includes(userId) ?? false;
      const userObjectId = Types.ObjectId.createFromHexString(String(userId));
      const updateOp = userLiked
        ? { $pull: { likes: userObjectId } }
        : { $push: { likes: userObjectId } };
      const updatedPost = await this.model.findByIdAndUpdate(postId, updateOp, {
        new: true,
      });
      res.status(200).json({ likesCount: updatedPost?.likes?.length || 0 });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
}

export default new postController();
