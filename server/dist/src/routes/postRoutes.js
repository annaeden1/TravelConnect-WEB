"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */
/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.post("/", postController_1.default.create.bind(postController_1.default));
/**
 * @swagger
 * /post/{_id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:_id", postController_1.default.delete.bind(postController_1.default));
/**
 * @swagger
 * /post/{_id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:_id", postController_1.default.update.bind(postController_1.default));
/**
 * @swagger
 * /post:
 *   get:
 *     summary: Retrieve all posts or filter posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userCreatorID
 *         schema:
 *           type: string
 *         description: Filter posts by user creator ID
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.get("/", postController_1.default.get.bind(postController_1.default));
/**
 * @swagger
 * /post/{_id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/:_id", postController_1.default.getById.bind(postController_1.default));
exports.default = router;
//# sourceMappingURL=postRoutes.js.map