"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = require("../models/postModel");
const genericController_1 = __importDefault(require("./genericController"));
class postController extends genericController_1.default {
    constructor() {
        super(postModel_1.postModel);
    }
}
exports.default = new postController();
//# sourceMappingURL=postController.js.map