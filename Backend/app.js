import express from "express";

import dotenv from "dotenv";
import connectDB from "./src/config/db.config.js";
import shortUrlRoute from "./src/routes/shortUrlRoute.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the urlshortner");
});

//creating the short url

app.use("/api/create", shortUrlRoute);

//redirecting
app.use("/", shortUrlRoute);

//server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
