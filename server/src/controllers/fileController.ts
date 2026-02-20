import { Request, Response } from "express";
import { FILES_PATH } from "../routes/fileRouter"

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
  }

  const base = `${req.protocol}://${req.get("host")}`;

  const file = req.file as Express.Multer.File;
  const fileUrl = `${base}/${FILES_PATH}${file.filename}`;

  res.status(200).send({ url: fileUrl });
};
export default uploadFile;
