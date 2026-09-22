import ShortUrl from "../models/shortUrl.model.js";
import { nanoid } from "nanoid";

export async function createShorturl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    const existing = await ShortUrl.findOne({ originalUrl: url });
    if (existing) {
      return res.status(200).json({
        success: true,
        shortUrl: `${process.env.APP_URL}${existing.shortUrl}`,
      });
    }

    const shortID = nanoid(7);

    const newShortUrl = await ShortUrl.create({
      originalUrl: url,
      shortUrl: shortID,
    });

    return res.status(201).json({
      success: true,
      shortUrl: `${process.env.APP_URL}${shortID}`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create short URL",
    });
  }
}

export const getMyUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await ShortUrl.findOneAndUpdate(
      { shortUrl: id },
      { $inc: { clicks: 1 } },
      { new: true },
    );

    if (!url) {
      return res.status(404).send("Not Found");
    }

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    return res.status(500).send("Server error");
  }
};

export const getUrlStats = async (req, res) => {
    
  try {
    
    const { id } = req.params;
    const url = await ShortUrl.findOne({ shortUrl: id });
    if (!url) {
      return res.status(404).json({
        message: "short url not found",
      });
    }
    res.status(200).send({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.APP_URL}${url.shortUrl}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("server error");
  }
};
