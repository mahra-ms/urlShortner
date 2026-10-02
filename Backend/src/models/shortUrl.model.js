import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    claimTokenHash: {
      type: String,
      default: undefined,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

shortUrlSchema.index(
  { owner: 1, originalUrl: 1 },
  { unique: true, partialFilterExpression: { owner: { $type: "objectId" } } },
);
const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
