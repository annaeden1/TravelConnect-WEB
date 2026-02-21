import multer from "multer";
import { mkdirSync } from "node:fs";
import { FILES_PATH } from "../routes/fileRouter";

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

export const upload = multer({ storage });
