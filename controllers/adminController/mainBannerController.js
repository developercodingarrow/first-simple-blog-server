const MainBanner = require("../../models/mainBannerModel");
const Factory = require("../../utils/handlerFactory");
const catchAsync = require("../../utils/catchAsync");

exports.getMainBanner = catchAsync(async (req, res, next) => {
  const doc = await MainBanner.find().sort({ createdAt: -1 });

  res.cookie("mainBanner", JSON.stringify(doc), {
    httpOnly: false, // Ensure it's not accessible via JavaScript
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
  });
  res.status(200).json({
    status: "success",
    result: doc,
  });
});

exports.publishBanner = catchAsync(async (req, res, next) => {
  const image = req.files[0].filename;

  const doc = await MainBanner.create({
    bannerImg: {
      url: image,
      altText: req.files[0].originalname,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Publsih your image succesfully",
    result: doc,
  });
});

exports.updateBannerUrl = catchAsync(async (req, res, next) => {
  const { _id, bannerLink } = req.body;

  const banner = await MainBanner.findByIdAndUpdate(_id, { bannerLink });

  res.status(200).json({
    status: "success",
    message: "url update sucesfully",
  });
});
