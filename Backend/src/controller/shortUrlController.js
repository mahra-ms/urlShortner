import { getShortUrl } from "../dao/short_url.js";
import { createShortUrlService } from "../services/shortUrlService.js";

export const createShortUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).send("URL is required");
    }
    const shortURL = await createShortUrlService(url)
    res.send(process.env.APP_URL+shortURL);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
};

export const redirectShortUrl =  async (req, res) => {
  try {
    const { id } = req.params;
    
    const url = await getShortUrl(id);
    
    if (url) 
        res.redirect(url.originalUrl);
    else 
        res.status(404).send("not found");

  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
}