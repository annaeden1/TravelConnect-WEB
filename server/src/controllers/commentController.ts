import { commentModel, type IComment } from "../models/commentModel";
import genericController from "./genericController";
import type { Request, Response } from "express";

class commentController extends genericController<IComment> {
  constructor() {
    super(commentModel);
  }
}

export default new commentController();
