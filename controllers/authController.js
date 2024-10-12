const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

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

// jwt tooken function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 36000,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
  };

  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;
  res.cookie("jwt", token, cookiesOptions);

  res.status(statusCode).json({
    status: "success",
    apiFor: "Login",
    token,
    message: "login succes fully",
    user, // user ki sari details  send nahi karni
  });
};

//---1) USER REGISTRATION
exports.userRegisteraion = catchAsync(async (req, res, next) => {
  //1) GET DATA FROM BODY
  const { name, email, password, passwordConfirm } = req.body;
  //2)CHECK THE USER FIELD IS EMPTY
  if ((!name || !email || !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed", 400));
  }
  //3) CHECK USER ALREADY REGISTER
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
      authBy: "form",
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
      status: "success",
      apiFor: "register",
      UrlToken,
      message: "OTP Sent Sucessfully check your mail",
      otp, // otp send nahi karna
      newUser, // new user send nahi karna
    });
  } else if (checkUser.isVerified === true) {
    return next(new AppError("you have already account Please Login", 401));
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
      status: "success",
      apiFor: "register",
      otp,
      UrlToken,
      message: "OTP Sent Sucessfully check your mail",
    });
  }
});

//---2) Verify OTP and activate user's account
exports.verifyOtp = catchAsync(async (req, res, next) => {
  //1) Get user based on the UrlToken
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // 2) Get the user by hashedToken
  const user = await User.findOne({ otpgenerateToken: hashedToken });

  //3) Verify OTP and expiration time
  const currentTime = new Date();

  if (
    (await bcrypt.compare(req.body.otp, user.otp)) &&
    currentTime.getTime() - user.otpTimestamp.getTime() <= 6000000
  ) {
    user.otp = undefined;
    user.otpgenerateToken = undefined;
    user.isVerified = true;

    await user.save();

    res.status(200).json({
      status: "success",
      apiFor: "optverification",
      message: "your Registration sucesfully",
    });
  } else {
    return next(new AppError("Invalid OTP or expired. Please try again.", 404));
  }
});

//---3) forgot password
exports.forgatePassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check empity input filed
  if (!email) {
    return next(new AppError("Please Provide Required filed"));
  }
  // Check user is exist on our data base
  const user = await User.findOne({ email });
  console.log(user.email);
  if (!user) {
    return next(
      new AppError(
        "There is no account with this mail please register first by this mail"
      )
    );
  }
  // Generate Url Token and HasedToken
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user Email

  const forgotePasswordURL = `http:://${req.get(
    "host"
  )}/api/v1/users/saranshrealtorsindia/reset-password/${resetToken}`;
  await sendEmail({
    email: user.email,
    subject: "Reset Password ",
    message: `<h1>for Reste Your password click on this link ${forgotePasswordURL} and  Reset Your Password  <h1> `,
  });

  res.status(200).json({
    status: "success",
    apiFor: "forgatePassword",
    message: "Reset link sent sucuufully on your mail",
    user,
    resetToken,
  });
});

//---4) Reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the UrlToken
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Get the user by hashedToken
  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    // PasswordResetExpires: { $gt: Date.now() },
  });

  //if user not found check user
  if (!user) {
    return next(
      new AppError(
        "password Verification is Invalid or Time Exired Try Again",
        401
      )
    );
  }

  user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;

  // Save the user new password
  await user.save();

  res.status(200).json({
    status: "success",
    message: "your password Reset sucesfully",
    apiFor: "resetPassword",
  });
});

//--5) Login User
exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check input filed isEmpity
  if (!email || !password) {
    return next(new AppError("please provide the mendatories fileds", 400));
  }

  const user = await User.findOne({ email: email, isVerified: true }).select(
    "+password"
  );

  // check password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

exports.googleAuth = catchAsync(async (req, res, next) => {
  console.log("google auth call");
  const { token } = req.body;

  const ticket = client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_AUTH_CLIENT_ID,
  });

  const { name, email, picture } = (await ticket).getPayload();
  console.log(picture);

  const checkUser = await User.findOne({ email });
  console.log(checkUser);
  if (checkUser) {
    res.status(200).json({
      status: "success",
      message: "Google Register Login",
      user: checkUser,
      token,
    });
  } else {
    const newUser = await User.create({
      name,
      email,
      userImg: {
        url: picture, // Store the Google image URL here
        altText: `${name}'s profile picture`,
      },
      isVerified: true,
      authBy: "googleAuth",
    });

    res.status(200).json({
      status: "success",
      message: "Google Register sucesfully",
      token,
      user: newUser,
      status: "success",
      apiFor: "Login",
    });
  }
});

// Protect Route Function
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Your are not logIn Please login to acces"), 401);
  }

  // 2) Verifing Tooken
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user exist means after token is user or delete user
  // id comes from jwt payload
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The User token does not blonging to this user", 401)
    );
  }
  // 4) check if user changed password after the token was issued
  if (freshUser.changePasswordAfterToken(decoded.iat)) {
    return next(
      new AppError("user recently change password! please log in again", 401)
    );
  }
  // Grant acces to Protected Route

  req.user = freshUser;
  next();
});

// all to acces user Role
exports.restricTO = (...roles) => {
  return (req, res, next) => {
    // roles in Array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to acces this", 403)
      );
    }

    next();
  };
};

exports.logOut = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production", // Ensure secure is used only in production
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
