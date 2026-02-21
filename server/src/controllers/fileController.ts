import { Request, Response } from "express";
export const FILES_PATH = "public/";

export const getFileUrl = (req: Request, filename: string) =>
  `${req.protocol}://${req.get("host")}/${FILES_PATH}${filename}`;

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
  }

  const file = req.file as Express.Multer.File;
  res.status(200).send({ url: getFileUrl(req, file.filename) });
};
export default uploadFile;
