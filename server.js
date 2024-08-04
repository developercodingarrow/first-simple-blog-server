const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const port = process.env.PORT;
const mongoose = require("mongoose");

const DB = process.env.DATABASEURL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection sucessful...!");
    console.log(process.env.NODE_ENV);
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

app.listen(port, () => console.log(`--Server is Running on Port ${port}`));
