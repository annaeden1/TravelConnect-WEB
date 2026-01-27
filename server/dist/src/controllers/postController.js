"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postModel_1 = require("../models/postModel");
const genericController_1 = __importDefault(require("./genericController"));
class postController extends genericController_1.default {
    constructor() {
        super(postModel_1.postModel);
    }
    handleLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { _id: postId } = req.params;
            const { userId } = req.body;
            try {
                const post = yield this.model.findById(postId);
                if (!post) {
                    return res.status(404).json({ error: `Post with id ${postId} not found` });
                }
                const userLiked = (_b = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.includes(userId)) !== null && _b !== void 0 ? _b : false;
                const userObjectId = mongoose_1.Types.ObjectId.createFromHexString(String(userId));
                const updateOp = userLiked ? { $pull: { likes: userObjectId } } : { $push: { likes: userObjectId } };
                const updatedPost = yield this.model.findByIdAndUpdate(postId, updateOp, { new: true });
                res.status(200).json({ likesCount: ((_c = updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.likes) === null || _c === void 0 ? void 0 : _c.length) || 0 });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "An unknown error occurred",
                });
            }
        });
    }
}
exports.default = new postController();
//# sourceMappingURL=postController.js.map