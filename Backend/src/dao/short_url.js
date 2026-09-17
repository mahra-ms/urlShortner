import short_URL from "../models/shortUrl.js";
export const saveUrl = async (shortUrl, longUrl, userId) => {
  const newUrl = new short_URL({
    originalUrl: longUrl,
    shortUrl: shortUrl,
  });
  if (userId) {
    newUrl.user_id = userId;
  }
  await newUrl.save();
};

export const getShortUrl = async (id) => {
  return await short_URL.findOneAndUpdate(
    { shortUrl: id },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" }
  );
};
