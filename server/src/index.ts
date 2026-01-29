import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: ".env.dev" });
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import { specs, swaggerUi } from "./swagger";

const app = express();

const intApp = () => {
  return new Promise<Express>((resolve, reject) => {
    // Enable CORS for client requests
    app.use(cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true    }));
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Assignment 2 Server API Documentation",
      })
    );

    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
    });

    app.use("/post", postRoutes);
    app.use("/comment", commentRoutes);
    app.use("/user", userRoutes);
    app.use("/auth", authRoutes);
    app.use("/ai", aiRoutes);

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      return reject(new Error("MONGODB_URI is not defined"));
    }

    mongoose
      .connect(dbUri)
      .then(() => resolve(app))
      .catch(reject);

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to MongoDB"));
  });
};

const PORT = Number(process.env.PORT ?? 3000);
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

export default intApp;
