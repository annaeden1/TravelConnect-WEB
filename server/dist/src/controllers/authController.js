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
exports.logout = exports.register = exports.login = exports.refreshToken = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendError = (res, message) => {
    res.status(400).json({ error: message });
};
const generateUserTokens = (userId) => {
    const secret = process.env.JWT_SECRET || "secretkey";
    const expiration = parseInt(process.env.JWT_EXPIRES_IN || "3600"); // 1 hour
    const refreshExpiration = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "86400"); // 24 hours
    const accessToken = jsonwebtoken_1.default.sign({ userId: userId, random: Math.random().toString() }, secret, { expiresIn: expiration });
    const jwtContent = {
        _id: userId,
        random: Math.random().toString(),
    };
    const refreshToken = jsonwebtoken_1.default.sign(jwtContent, secret, { expiresIn: refreshExpiration });
    return { accessToken, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, profileImage, password, username } = req.body;
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {
        const existingUser = yield userModel_1.userModel.exists({ email: req.body.email });
        if (existingUser !== null) {
            res.status(400).send({ error: "User with this email already exists" });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield userModel_1.userModel.create({ username: username, email: email, profileImage: profileImage, password: encryptedPassword });
        const userTokens = generateUserTokens(user._id.toString());
        user.refreshTokens = [userTokens.refreshToken];
        yield user.save();
        res.status(201).json(userTokens);
    }
    catch (error) {
        return sendError(res, "Registration failed");
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {
        const user = yield userModel_1.userModel.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid email or password");
        }
        const isVaildPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isVaildPassword) {
            return sendError(res, "Invalid email or password");
        }
        const userTokens = generateUserTokens(user._id.toString());
        user.refreshTokens.push(userTokens.refreshToken);
        yield user.save();
        res.status(200).send({
            username: user.username,
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            profileImage: user.profileImage,
            _id: user._id,
        });
    }
    catch (error) {
        return sendError(res, "Login failed");
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }
    try {
        const secret = process.env.JWT_SECRET || "secretkey";
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield userModel_1.userModel.findById(decoded._id);
        if (!user) {
            return sendError(res, "Invalid refresh token");
        }
        if (!user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            yield user.save();
            return sendError(res, "Invalid refresh token");
        }
        //generate new tokens
        const newGeneratedTokens = generateUserTokens(user._id.toString());
        user.refreshTokens.push(newGeneratedTokens.refreshToken);
        user.refreshTokens = user.refreshTokens.filter(currentRefreshToken => currentRefreshToken !== refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: newGeneratedTokens.accessToken,
            refreshToken: newGeneratedTokens.refreshToken,
            _id: user._id,
        });
    }
    catch (error) {
        return sendError(res, "Invalid refresh token");
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }
    try {
        const secret = process.env.JWT_SECRET || "secretkey";
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield userModel_1.userModel.findById(decoded._id);
        if (!user) {
            return sendError(res, "Invalid refresh token");
        }
        // Remove the refresh token from the user's refreshTokens array
        user.refreshTokens = user.refreshTokens.filter(currentRefreshToken => currentRefreshToken !== refreshToken);
        yield user.save();
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return sendError(res, "Invalid refresh token");
    }
});
exports.logout = logout;
//# sourceMappingURL=authController.js.map