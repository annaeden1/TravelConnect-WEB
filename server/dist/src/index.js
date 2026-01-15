"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.dev" });
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const intApp = () => {
    return new Promise((resolve, reject) => {
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Assignment 2 Server API Documentation",
        }));
        app.get("/api-docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swagger_1.specs);
        });
        app.use("/post", postRoutes_1.default);
        app.use("/comment", commentRoutes_1.default);
        app.use("/user", userRoutes_1.default);
        app.use("/auth", authRoutes_1.default);
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            console.error("MONGODB_URI is not defined in the environment variables.");
            return reject(new Error("MONGODB_URI is not defined"));
        }
        mongoose_1.default
            .connect(dbUri)
            .then(() => resolve(app))
            .catch(reject);
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("Connected to MongoDB"));
    });
};
const PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
if (process.env.NODE_ENV !== "test") {
    intApp()
        .then((app) => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
        .catch((err) => {
        console.error("Failed to init app:", err);
        process.exit(1);
    });
}
exports.default = intApp;
//# sourceMappingURL=index.js.map