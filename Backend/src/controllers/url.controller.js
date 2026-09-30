import crypto from "crypto";
import ShortUrl from "../models/shortUrl.model.js";
import Click from "../models/click.model.js";
import { nanoid } from "nanoid";
import geoip from "geoip-lite";

const BASE_URL = process.env.APP_URL;

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Returns the URL only if it belongs to the logged-in user
async function findOwnedUrl(shortId, userId) {
  return ShortUrl.findOne({ shortUrl: shortId, owner: userId });
}

function isAllowedUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ---------- CREATE (public; owner set if logged in) ----------
export async function createShorturl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    if (typeof url !== "string" || !isAllowedUrl(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    const ownerId = req.user?.id || null;

    // Only dedupe for logged-in users. Anonymous users always get a fresh link,
    // because the claim token can only be shown once, at creation time.
    if (ownerId) {
      const existing = await ShortUrl.findOne({
        originalUrl: url,
        owner: ownerId,
      });
      if (existing) {
        return res.status(200).json({
          success: true,
          shortUrl: `${BASE_URL}/${existing.shortUrl}`,
        });
      }
    }

    // Anonymous links get a secret claim token (only its hash is stored)
    const claimToken = ownerId ? null : crypto.randomBytes(16).toString("hex");
    const claimTokenHash = claimToken ? hashToken(claimToken) : undefined;

    for (let attempt = 0; attempt < 3; attempt++) {
      const shortID = nanoid(7);
      try {
        await ShortUrl.create({
          originalUrl: url,
          shortUrl: shortID,
          owner: ownerId,
          claimTokenHash,
        });

        return res.status(201).json({
          success: true,
          shortUrl: `${BASE_URL}/${shortID}`,
          ...(claimToken && { claimToken }), // only for anonymous links
        });
      } catch (err) {
        if (err.code === 11000) continue;
        throw err;
      }
    }

    return res
      .status(500)
      .json({ message: "Unable to generate a unique short URL, try again" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to create short URL" });
  }
}

// ---------- REDIRECT (public) ----------
export const getMyUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await ShortUrl.findOneAndUpdate(
      { shortUrl: id },
      { $inc: { clicks: 1 } },
      { returnDocument: "after" },
    );

    if (!url) {
      return res.status(404).send("Not Found");
    }

    const geo = geoip.lookup(req.ip);

    Click.create({
      shortUrl: id,
      country: geo?.country || "Unknown",
      region: geo?.region || "Unknown",
    }).catch((err) => console.error("Click logging failed:", err));

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

// ---------- CLAIM an anonymous link (login required) ----------
export const claimUrl = async (req, res) => {
  try {
    const { shortId, claimToken } = req.body;
    if (typeof shortId !== "string" || typeof claimToken !== "string") {
      return res
        .status(400)
        .json({ message: "shortId and claimToken are required" });
    }

    // Filter only matches a link that is still unowned AND has the right token
    const url = await ShortUrl.findOneAndUpdate(
      { shortUrl: shortId, owner: null, claimTokenHash: hashToken(claimToken) },
      { $set: { owner: req.user.id }, $unset: { claimTokenHash: 1 } },
      { returnDocument: "after" },
    );

    if (!url) {
      return res
        .status(404)
        .json({ message: "Link not found or already claimed" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Link added to your account" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to claim link" });
  }
};

// ---------- LIST my links (login required) ----------
export const getMyUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      data: urls.map((u) => ({
        originalUrl: u.originalUrl,
        shortUrl: `${BASE_URL}/${u.shortUrl}`,
        clicks: u.clicks,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

// ---------- ANALYTICS (login required, owner only) ----------
export const getUrlStats = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await findOwnedUrl(id, req.user.id);
    if (!url) {
      return res.status(404).json({ message: "short url not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl: `${BASE_URL}/${url.shortUrl}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getClicksByCountry = async (req, res) => {
  try {
    const { id } = req.params; // read id BEFORE using it
    const owned = await findOwnedUrl(id, req.user.id);
    if (!owned) {
      return res.status(404).json({ message: "short url not found" });
    }

    const breakdown = await Click.aggregate([
      { $match: { shortUrl: id } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: breakdown.map((b) => ({
        country: b._id,
        clicks: b.count,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getClicksOverTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = "day" } = req.query;

    const validPeriods = {
      day: "%Y-%m-%d", // e.g. 2026-09-24
      week: "%G-W%V", // e.g. 2026-W39 (ISO week)
      month: "%Y-%m", // e.g. 2026-09
    };
    if (!validPeriods[period]) {
      return res.status(400).json({
        message: `Invalid period. Use one of: ${Object.keys(validPeriods).join(", ")}`,
      });
    }

    const owned = await findOwnedUrl(id, req.user.id);
    if (!owned) {
      return res.status(404).json({ message: "short url not found" });
    }

    const breakdown = await Click.aggregate([
      { $match: { shortUrl: id } },
      {
        $group: {
          _id: {
            $dateToString: { format: validPeriods[period], date: "$clickedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      period,
      data: breakdown.map((b) => ({
        period: b._id,
        clicks: b.count,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};