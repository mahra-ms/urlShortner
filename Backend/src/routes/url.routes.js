import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createShorturl,
  claimUrl,            
  getClicksByCountry,
  getClicksOverTime,
  getUrlStats,
  getMyUrls,
  deleteUrl, 
} from "../controllers/url.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many links created, try again later" },
});
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, try again later" },
});

router.post("/", createLimiter, optionalAuth, createShorturl);
router.post("/claim", readLimiter, requireAuth, claimUrl); 
router.get("/my-urls", readLimiter, requireAuth, getMyUrls);
router.delete("/:id", readLimiter, requireAuth, deleteUrl);   
router.get("/stats/:id", readLimiter, requireAuth, getUrlStats);
router.get("/stats/:id/geo", readLimiter, requireAuth, getClicksByCountry);
router.get("/stats/:id/timeseries", readLimiter, requireAuth, getClicksOverTime);

export default router;