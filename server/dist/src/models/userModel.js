"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
const userModel = mongoose_1.default.model("user", userSchema);
exports.userModel = userModel;
//# sourceMappingURL=userModel.js.map