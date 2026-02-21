import multer from "multer";
import express from "express";
import uploadFile from "../controllers/fileController";
import { authenticate } from "../middlewares/authMiddleware";
import { mkdirSync } from "node:fs";
import { FILES_PATH } from "../config/filePaths";


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

const router = express.Router();

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: string
 *                   format: uri
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticate, upload.single("file"), uploadFile);

export { router as filesRouter };
