const mongoose = require("mongoose");

const mainBannerSchema = new mongoose.Schema(
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
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const MainBanner = mongoose.model("MainBanner", mainBannerSchema);

module.exports = MainBanner;
