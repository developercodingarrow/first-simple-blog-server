const express = require("express");
const app = express();
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
const cors = require("cors");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/first-simple-blog/auth", authRoute);

//  Realted to admin
app.use("/api/v1/first-simple-blog/protected/users", userDataRoutes);
app.use("/api/v1/first-simple-blog/protected/blog", blogDataRoute);
app.use("/api/v1/first-simple-blog/protected/admin-auth", adminsAuthRoute);

// Realted To Users
app.use("/api/v1/first-simple-blog/private/users", userRoute);
app.use("/api/v1/first-simple-blog/private/blog", blogRoute);
app.use("/api/v1/first-simple-blog/private/tag", tagRoute);
app.use("/api/v1/first-simple-blog/private/comment", blogCommentRoute);

app.use("/api/v1/first-simple-blog/stats", statsRoute);

app.use(globalErrorHandler);
module.exports = app;
