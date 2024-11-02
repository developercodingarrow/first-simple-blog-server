const SideBanner = require("../../models/sidebannerModel");
const Factory = require("../../utils/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const fs = require("fs").promises; // Use fs.promises to handle async operations
const path = require("path");

const testpath = path.resolve(__dirname, "../../../client/public/sideBanner");
console.log("Resolved Path:", testpath);

exports.getSideBanner = catchAsync(async (req, res, next) => {
  const doc = await SideBanner.find().sort({ createdAt: -1 });

  res.cookie("sideBanner", JSON.stringify(doc), {
    httpOnly: false, // Ensure it's not accessible via JavaScript
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
  });
  res.status(200).json({
    status: "success",
    result: doc,
  });
});

exports.publishSideBanner = catchAsync(async (req, res, next) => {
  try {
    const image = req.files[0].filename;

    // Step 1: Create the new banner first
    const newBanner = await SideBanner.create({
      bannerImg: {
        url: image,
        altText: req.files[0].originalname,
      },
    });

    // Step 2: After successful creation, delete all other banners except the new one
    const oldBanners = await SideBanner.find({ _id: { $ne: newBanner._id } }); // Find all banners except the new one
    if (oldBanners.length > 0) {
      // Log old banners to be deleted from the database
      console.log("Old banners to be deleted:", oldBanners);

      // Loop through and delete each old banner document from the database
      await Promise.all(
        oldBanners.map(async (banner) => {
          // Delete the banner document from the database
          await SideBanner.findByIdAndDelete(banner._id);
        })
      );
    }

    // Step 3: Respond to the client with the new banner
    res.status(200).json({
      status: "success",
      message: "Published your image successfully",
      result: newBanner,
    });
  } catch (err) {
    // Handle the error and send an appropriate response
    return next(
      new AppError("Something went wrong, banner was not published", 500)
    );
  }
});

exports.updateBannerUrl = catchAsync(async (req, res, next) => {
  const { _id, bannerLink } = req.body;

  const banner = await SideBanner.findByIdAndUpdate(_id, { bannerLink });

  res.status(200).json({
    status: "success",
    message: "url update sucesfully",
  });
});
