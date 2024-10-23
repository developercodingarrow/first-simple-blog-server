const mongoose = require("mongoose");
const slugify = require("slugify");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please Provide your Name!"],
    },
    email: {
      type: String,
      require: [true, "Please Provide your Email!"],
    },
    number: {
      type: String,
      require: [true, "Please Provide your Contact number!"],
    },

    subject: {
      type: String,
      require: [true, "Please Provide your subject!"],
    },
    message: {
      type: String,
      require: [true, "Please write your message!"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
