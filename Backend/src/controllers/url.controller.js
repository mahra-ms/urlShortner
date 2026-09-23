import ShortUrl from "../models/shortUrl.model.js";
import Click from "../models/click.model.js";
import { nanoid } from "nanoid";
import geoip from "geoip-lite";

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
      { returnDocument: "after"},
    );

    if (!url) {
      return res.status(404).send("Not Found");
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
    const geo = geoip.lookup(ip);

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

export const getClicksByCountry = async (req, res) => {
  try {
    const { id } = req.params;
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

export const getClicksOverTime = async(req,res) =>{
  try{
    const {id} = req.params;
    const{period = "week"} = req.query;
    const dateFormat = period === "month"? "%Y-%m" : "%Y-%U";

    const breakdown = await Click.aggregate([
       { $match: { shortUrl: id } },
       {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$clickedAt" } },
          count: { $sum: 1 },
        },
        },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success : true,
      period,
      data : breakdown.map((b) =>({
        period : b._id,
        clicks: b.count
      }))
    })
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ 
      message: "server error" 
    });
  }
}