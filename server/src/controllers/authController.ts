import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const sendError = (res: Response, message: string) => {
    res.status(400).json({ error: message });
}

type Tokens = {
    accessToken: string;
    refreshToken: string;
}

const generateUserTokens = (userId: string): Tokens => {
    const secret: string = process.env.JWT_SECRET || "secretkey";
    const expiration: number = parseInt(process.env.JWT_EXPIRES_IN || "3600"); // 1 hour
    const refreshExpiration: number = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "86400"); // 24 hours
    const accessToken = jwt.sign(
        { userId: userId, random: Math.random().toString() },
        secret,
        { expiresIn: expiration }
    );

    const jwtContent: JwtPayload = {
        _id: userId,
        random: Math.random().toString(),
    };

    const refreshToken = jwt.sign(
        jwtContent,
        secret,
        { expiresIn: refreshExpiration }
    );

    return { accessToken, refreshToken };

}
 const register = async (req: Request, res: Response) => {
    const { email, profileImage, password, username } = req.body;

    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {
        const existingUser = await userModel.exists({email: req.body.email});

        if (existingUser !== null) {
            res.status(400).send({ error: "User with this email already exists" });
            return;
        }


        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({ username: username, email: email, profileImage: profileImage, password: encryptedPassword });

        const userTokens = generateUserTokens(user._id.toString());

        user.refreshTokens = [userTokens.refreshToken];
        await user.save();

        res.status(201).json(userTokens);
    } catch (error) {
        return sendError(res, "Registration failed");
    }
};

 const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid email or password");
        }

        const isVaildPassword = await bcrypt.compare(password, user.password);
        if (!isVaildPassword) {
            return sendError(res, "Invalid email or password");
        }

        const userTokens = generateUserTokens(user._id.toString());
        
        user.refreshTokens.push(userTokens.refreshToken);
        await user.save();
        
        res.status(200).send({
            username: user.username,
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            profileImage: user.profileImage,
            _id: user._id,
        });
    } catch (error) {
        return sendError(res, "Login failed");
    }
};

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }

    try {
        const secret: string = process.env.JWT_SECRET || "secretkey";
        const decoded: any = jwt.verify(refreshToken, secret);

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return sendError(res, "Invalid refresh token");
        }

        if (!user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            await user.save();
            return sendError(res, "Invalid refresh token");
        }

        //generate new tokens
        const newGeneratedTokens = generateUserTokens(user._id.toString());
        user.refreshTokens.push(newGeneratedTokens.refreshToken);
        user.refreshTokens = user.refreshTokens.filter(currentRefreshToken => currentRefreshToken !== refreshToken);
        await user.save();

        res.status(200).send({
          accessToken: newGeneratedTokens.accessToken,
          refreshToken: newGeneratedTokens.refreshToken,
          _id: user._id,
    });
    } catch (error) {
        return sendError(res, "Invalid refresh token");
    }
};

 const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }

    try {
        const secret: string = process.env.JWT_SECRET || "secretkey";
        const decoded: any = jwt.verify(refreshToken, secret);

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return sendError(res, "Invalid refresh token");
        }

        // Remove the refresh token from the user's refreshTokens array
        user.refreshTokens = user.refreshTokens.filter(currentRefreshToken => currentRefreshToken !== refreshToken);
        await user.save();

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return sendError(res, "Invalid refresh token");
    }
};

export { refreshToken, login, register, logout };