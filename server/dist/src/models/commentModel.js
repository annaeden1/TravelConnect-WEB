"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: true,
    },
    relatedPostID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    userCreatorID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
});
const commentModel = mongoose_1.default.model("comment", commentSchema);
exports.commentModel = commentModel;
//# sourceMappingURL=commentModel.js.map