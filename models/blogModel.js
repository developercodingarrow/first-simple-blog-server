const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      default: "Untitled Blog", // Set default blogTitle
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters."],
    },

    blogDescreption: {
      type: String,
    },
    blogThumblin: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      url: {
        type: String,
        // default: "project-dummy-image.jpg",
      },
      altText: {
        type: String,
      },
      alternativeText: {
        type: String,
      },
      title: {
        type: String,
      },
      caption: {
        type: String,
      },
      description: {
        type: String,
      },
    },

    blogTags: [
      {
        tagName: { type: String, lowercase: true },
        tagSlug: { type: String, lowercase: true },
      },
    ],

    keywords: {
      type: String,
    },

    featured: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },

    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },

    reportAction: {
      type: String,
      enum: ["Harassment", "Rules Violation", "Spam", "no-action"],
      default: "no-action",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportContent: {
      type: String,
      enum: ["moderation_review", "no-action", "suspension"],
      default: "no-action",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rankingPoint: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogSchema.pre("save", function (next) {
  this.blogTags.forEach((tag) => {
    tag.tagSlug = slugify(tag.tagName, { lower: true });
  });
  next();
});

blogSchema.pre("save", function (next) {
  // Ensure blogTitle is set
  if (!this.blogTitle) {
    this.blogTitle = "Untitled Blog";
  }

  // Check if the slug starts with "untitled-" or the blogTitle has been modified
  if (
    this.isNew ||
    this.slug.startsWith("untitled-") ||
    this.isModified("blogTitle")
  ) {
    // Generate slug from blogTitle
    const baseSlug = slugify(this.blogTitle, {
      lower: true,
    });

    // Generate a random string with timestamp
    const randomString = new Date().getTime().toString(36).substring(7);

    // Combine baseSlug with random string
    this.slug = `${baseSlug}-${randomString}`;
  }

  next();
});

blogSchema.virtual("comments", {
  ref: "BlogComments",
  foreignField: "blog",
  localField: "_id",
});

const Blogs = mongoose.model("Blogs", blogSchema);

module.exports = Blogs;
