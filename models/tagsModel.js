const mongoose = require("mongoose");
const slugify = require("slugify");

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      require: [true, "Please Provide your tag!"],
      unique: true,
      lowercase: true,
    },
    tagSlug: {
      type: String,
      unique: true,
    },

    Verification: {
      type: Boolean,
      default: false,
    },

    tagBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tagSchema.pre("save", function (next) {
  this.tagSlug = slugify(this.tagName, {
    lower: true,
  });

  next();
});

const Tags = mongoose.model("Tags", tagSchema);

module.exports = Tags;
