import { Request, Response } from "express";
import { FILES_PATH, getFileUrl } from "../config/filePaths";

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
  }

  const file = req.file as Express.Multer.File;
  res.status(200).send({ url: getFileUrl(req, file.filename) });
};
export default uploadFile;
