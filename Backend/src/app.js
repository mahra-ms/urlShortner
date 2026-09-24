import dotenv from "dotenv";
import express from "express";

import connectDb from "./config/db.js";
import urlRoutes from "./routes/url.routes.js";
import { getMyUrl } from "./controllers/url.controller.js";

dotenv.config();

const requiredEnv = ["MONGO_URI", "APP_URL", "PORT"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1", urlRoutes);
app.get("/:id", getMyUrl);

// NEW: catch-all 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// NEW: centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT;
await connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
