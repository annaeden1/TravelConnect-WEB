"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    userCreatorID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
});
const postModel = mongoose_1.default.model("post", postSchema);
exports.postModel = postModel;
//# sourceMappingURL=postModel.js.map