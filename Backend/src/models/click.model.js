import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
    index: true,
  },
  country: {
    type: String,
    default: "Unknown",
  },
  region: {
    type: String,
    default: "Unknown",
  },
  clickedAt: {
    type: Date,
    default: Date.now,
  },
});

clickSchema.index({ shortUrl: 1, clickedAt: 1 });

const Click = mongoose.model("Click", clickSchema);
export default Click;