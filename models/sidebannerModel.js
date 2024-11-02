const mongoose = require("mongoose");

const sideBannerSchema = new mongoose.Schema(
  {
    bannerImg: {
      url: {
        type: String,
        default: "main-banner.png",
      },
      altText: {
        type: String,
        default: "main-banner",
      },
    },
    bannerLink: {
      type: String,
      default: "https://www.google.com/",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const SideBanner = mongoose.model("SideBanner", sideBannerSchema);

module.exports = SideBanner;
