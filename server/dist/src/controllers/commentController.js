"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentModel_1 = require("../models/commentModel");
const genericController_1 = __importDefault(require("./genericController"));
class commentController extends genericController_1.default {
    constructor() {
        super(commentModel_1.commentModel);
    }
}
exports.default = new commentController();
//# sourceMappingURL=commentController.js.map