import { postModel, type IPost } from "../models/postModel";
import genericController from "./genericController";

class postController extends genericController<IPost> {
  constructor() {
    super(postModel);
  }
}

export default new postController();
