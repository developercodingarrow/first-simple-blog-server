const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Hash OTP
const HashOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcrypt.hash(otp, 12);
  return {
    otp,
    encryptedOtp,
  };
};

const OtpURL = () => {
  const UrlToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(UrlToken)
    .digest("hex");

  return {
    UrlToken,
    hashedToken,
  };
};

//1) User Registration
exports.userRegisteraion = catchAsync(async (req, res, next) => {
  //1) Get Body Data
  const { name, email, password, passwordConfirm } = req.body;

  //2)  check the user input file isEmpity
  if ((!name || !email || !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }

  //3) Check user already exist or note
  const checkUser = await User.findOne({ email });

  //4) if user Not Register
  if (!checkUser) {
    //4.1) Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    const { UrlToken, hashedToken } = OtpURL();
    // 4.2) Create User IN DATA BASE
    const newUser = await User.create({
      name,
      email,
      password,
      otp: encryptedOtp,
      otpTimestamp: new Date(),
      otpgenerateToken: hashedToken,
      isVerified: false,
    });

    // 5) OTP verification URL for Client
    const otpverificationURL = `${req.protocal}:://${req.get(
      "host"
    )}/api/v1/users/verify-otp/${UrlToken}`;

    // 6) Send Email To user Email ID
    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1> <br>
                  click on this Link ${otpverificationURL} and Verify the OTP`,
    });

    res.status(200).json({
      status: "Success",
      apiFor: "register",
      otp,
      newUser,
      UrlToken,
    });
  } else if (checkUser.isVerified === true) {
    return next(new AppError("you have already account Please Login"));
  } else if (checkUser.isVerified === false) {
    // Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    const { UrlToken, hashedToken } = OtpURL();

    // save in data base again
    checkUser.otpgenerateToken = hashedToken;
    checkUser.otp = encryptedOtp;
    await checkUser.save({ validateBeforeSave: false });

    const otpverificationURL = `http:://${req.get(
      "host"
    )}/api/v1/saranshrealtorsindia/users/verify-otp/${UrlToken}`;

    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1> <br>
                  click on this Link ${otpverificationURL} and Verify the OTP`,
    });

    res.status(200).json({
      status: "Success",
      apiFor: "register",
      otp,
      UrlToken,
      message: "Registration Successfull",
    });
  }
});
