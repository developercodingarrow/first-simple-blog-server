const express = require("express");
const app = express();
const globalErrorHandler = require("./utils/errorController");
const authRoute = require("./routes/authRoute");

const cors = require("cors");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/first-simple-blog/auth", authRoute);
app.use(globalErrorHandler);
module.exports = app;
