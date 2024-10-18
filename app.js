const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const globalErrorHandler = require("./utils/errorController");
const authRoute = require("./routes/authRoute");
const userDataRoutes = require("./routes/admins/userDataRoutes");
const adminsAuthRoute = require("./routes/admins/adminsAuthRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const blogDataRoute = require("./routes/admins/blogDataRoute");
const tagRoute = require("./routes/tagRoute");
const blogCommentRoute = require("./routes/blogCommentRoute");
const statsRoute = require("./routes/admins/statsRoute");
const mainBannerRoute = require("./routes/admins/mainBannerRoute");
const cors = require("cors");

// Midelwears
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://pinbuzzers.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/first-simple-blog/user-auth", authRoute);

//  Realted to admin
app.use("/api/v1/first-simple-blog/protected/users", userDataRoutes);
app.use("/api/v1/first-simple-blog/protected/blog", blogDataRoute);
app.use("/api/v1/first-simple-blog/protected/admin-auth", adminsAuthRoute);
app.use("/api/v1/first-simple-blog/admin-auth/main-banner", mainBannerRoute);

// Realted To Users
app.use("/api/v1/first-simple-blog/private/users", userRoute);
app.use("/api/v1/first-simple-blog/private/blog", blogRoute);
app.use("/api/v1/first-simple-blog/private/tag", tagRoute);
app.use("/api/v1/first-simple-blog/private/comment", blogCommentRoute);

app.use("/api/v1/first-simple-blog/stats", statsRoute);

app.use(globalErrorHandler);
module.exports = app;
