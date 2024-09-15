const Blogs = require("../../models/blogModel");
const Factory = require("../../utils/handlerFactory");

// 1) GET ALL BLOGS
exports.allBlogs = Factory.getAll(Blogs);
exports.togglefeaturedBlog = Factory.toggleBooleanField(Blogs, "featured");
