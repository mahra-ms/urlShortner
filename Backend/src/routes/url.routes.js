import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createShorturl, getUrlStats} from "../controllers/url.controller.js";

const router = Router();
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per window
  message: { message: "Too many links created, try again later" },
});


router.post("/",createLimiter, createShorturl)
router.get("/stats/:id",getUrlStats);



export default router;