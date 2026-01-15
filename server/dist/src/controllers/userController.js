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
const userModel_1 = require("../models/userModel");
const genericController_1 = __importDefault(require("./genericController"));
class UserController extends genericController_1.default {
    constructor() {
        super(userModel_1.userModel);
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params._id;
            const { email, password, username, profileImage } = req.body;
            try {
                if (!id) {
                    return res.status(400).json({ error: "ID parameter is missing" });
                }
                if (email) {
                    const existingUser = yield userModel_1.userModel.findOne({
                        email,
                        _id: { $ne: id },
                    });
                    if (existingUser) {
                        return res.status(400).json({ error: "Email is already in use" });
                    }
                }
                const updatedUser = yield userModel_1.userModel
                    .findByIdAndUpdate(id, { email, password, username, profileImage }, { new: true, runValidators: true })
                    .select("-password");
                if (!updatedUser) {
                    return res.status(404).json({ error: `User not found with id ${id}` });
                }
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({
                    error: error instanceof Error ? error.message : "An unknown error occurred",
                });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map