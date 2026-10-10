import "dotenv/config";
import express from "express";

import connectDb from "./config/db.js";
import urlRoutes from "./routes/url.routes.js";
import { getMyUrl } from "./controllers/url.controller.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";


const requiredEnv = ["MONGO_URI", "APP_URL", "PORT", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, cb) => {
      
      cb(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  message: "Too many requests",
});
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", urlRoutes);
app.get("/:id", redirectLimiter, getMyUrl);



app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT;
await connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

