import { nanoid } from "nanoid";
import { saveUrl } from "../dao/short_url.js";


export const  createShortUrlService =async(url)=>{
    const shortURL = nanoid(7);

    await saveUrl(shortURL,url)
    return shortURL
    
}
export const  createShortUrlServiceWithUser =async(url,userId)=>{
    const shortURL = nanoid(7);
    
    await saveUrl(shortURL,url,userId)
    return shortURL
    
}