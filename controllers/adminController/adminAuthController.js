const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/email");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

// jwt tooken function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 36000,
  });
};

//---1) Admins Registration
exports.adminsRegisteraion = catchAsync(async (req, res, next) => {
  //1) Get Body Data
  const { name, email, role, password, passwordConfirm } = req.body;

  //2)  check the user input file isEmpity
  if ((!name || !email || !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }

  //3) Check user already exist or note
  const checkUser = await User.findOne({ email });

  //4) if user Not Register
  if (!checkUser) {
    // 4.2) Create User IN DATA BASE
    const newUser = await User.create({
      name,
      email,
      role,
      password,
      isVerified: true,
    });

    res.status(200).json({
      status: "success",
      apiFor: "register",
      newUser,
    });
  } else {
    return next(new AppError("you have already account Please Login"));
  }
});

//--5) Admins Login
exports.adminsLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check input filed isEmpity
  if (!email || !password) {
    return next(new AppError("please provide the mendatories fileds"));
  }

  const user = await User.findOne({ email: email, isVerified: true }).select(
    "+password"
  );

  // check password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    apiFor: "Login",
    token,
    message: "login succes fully",
    user,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 2) Get the user by hashedToken
  const user = await User.findOne({
    email: email,
  });

  //if user not found check user
  if (!user) {
    return next(new AppError("This user no longer exist", 401));
  }

  user.password = req.body.password;
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
