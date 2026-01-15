import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - no header" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - no token" });
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jwt.verify(token, secret) as { _id: string };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
};