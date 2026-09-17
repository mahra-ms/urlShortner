import express from "express";
import { createShortUrl, redirectShortUrl } from "../controller/shortUrlController.js";
const router = express.Router();


router.post("/",createShortUrl)
router.get("/:id",redirectShortUrl)

export default router
