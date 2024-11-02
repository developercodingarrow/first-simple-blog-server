const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../config.env") });
const multer = require("multer");
const fs = require("fs");

// Function to create Multer storage
const createMulterStorage = (destination, context) => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(destination));
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${context}-${Date.now()}-${file.originalname}`);
    },
  });
  return multerStorage;
};

// Function to create Multer upload middleware
const createMulterUpload = (
  storage,
  fieldName,
  isMultiple = true,
  maxCount = 10
) => {
  const upload = isMultiple
    ? multer({ storage: storage }).array(fieldName, maxCount)
    : multer({ storage: storage }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error("Multer Error Details:", err); // Log any multer-related errors with details
        return res
          .status(400)
          .json({ message: "File upload error", error: err.message });
      }

      next();
    });
  };
};

const clientPublicPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../../new-first-simple-blog-front-end/public") // Production folder
    : path.join(__dirname, "../../client/public"); // Development folder

// Blog Thumblin Storage
const blogThumblinStorage = createMulterStorage(
  `${clientPublicPath}/blogthumblin`,
  "blog-thumblin"
);

const blogThumbilUpload = createMulterUpload(
  blogThumblinStorage,
  "blogThumblin",
  true
);

// BLOGTHUMBLIN MIDELWEAR
exports.blogThumblinMidelwear = blogThumbilUpload;

// USER IMAGE STORAGE

const userImgStorage = createMulterStorage(
  `${clientPublicPath}/usersProfileImg`,
  "user-profile"
);

const userImgUpload = createMulterUpload(userImgStorage, "userImg", true);

// USERIMG MIDELWEAR
exports.userImgMidelwear = userImgUpload;

const mainbannerStorage = createMulterStorage(
  `${clientPublicPath}/mainbanner`,
  "main-banner"
);

const mainbannerUpload = createMulterUpload(
  mainbannerStorage,
  "bannerImg",
  true
);

exports.mainBannerMidelwear = mainbannerUpload;

const sidebannerStorage = createMulterStorage(
  `${clientPublicPath}/sideBanner`,
  "side-banner"
);

const sidebannerUpload = createMulterUpload(
  sidebannerStorage,
  "bannerImg",
  true
);

exports.sideBannerMidelwear = sidebannerUpload;
