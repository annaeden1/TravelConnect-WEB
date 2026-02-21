import type { Request } from "express";

export const FILES_PATH = "public/";

export const getFileUrl = (req: Request, filename: string) =>
  `${req.protocol}://${req.get("host")}/${FILES_PATH}${filename}`;
