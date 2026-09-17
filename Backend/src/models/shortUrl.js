import mongoose from "mongoose";

const shortUrlScheme = new mongoose.Schema({
    originalUrl:{
        type : String,
        required : true,
    },
    shortUrl: {
        type : String,
        required : true,
        unique  :true,
        index : true,

    },
    clicks : {
        type : Number,
        required : true,
        default : 0,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        
    }
})
const short_URL = mongoose.model("shortUrl",shortUrlScheme);
export default short_URL;