import multer from "multer";
import express from "express";
import uploadFile from "../controllers/fileController";
import { mkdirSync } from "node:fs";
import { authenticate } from "../middlewares/authMiddleware";

const FILES_PATH = "public/";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirSync(FILES_PATH, { recursive: true });
    cb(null, FILES_PATH);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

router.post("/", authenticate, upload.single("file"), uploadFile);

export { router as filesRouter };
