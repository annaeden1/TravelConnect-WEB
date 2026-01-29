import express from "express";
import aiController from "../controllers/aiController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI Travel Assistant endpoints
 */

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Send a message to the AI Travel Assistant
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message to the AI
 *                 example: "What are the best places to visit in Japan?"
 *     responses:
 *       200:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: The AI's response
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Response timestamp
 *       400:
 *         description: Message is required
 *       500:
 *         description: Failed to generate AI response
 */
router.post("/chat", aiController.chat.bind(aiController));

export default router;
