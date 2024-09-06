const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");
const Tags = require("../models/tagsModel");

// CREATE TAG
exports.createTag = catchAsync(async (req, res, next) => {
  const { tagName } = req.body;
  const newTag = await Tags.create({
    tagName,
    tagBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    result: newTag,
  });
});

// GET ALL TAG
exports.getAllTags = Factory.getAll(Tags);

// CREATE MULTIPLE TAGS
exports.createTags = catchAsync(async (req, res, next) => {
  const { tagNames } = req.body; // Expecting an array of tag names

  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide an array of tag names.",
    });
  }

  // Map tag names to tag documents
  const tagsToCreate = tagNames.map((tagName) => ({
    tagName,
    tagBy: req.user._id,
  }));

  // Create multiple tags
  const newTags = await Tags.insertMany(tagsToCreate);

  res.status(201).json({
    status: "success",
    results: newTags.length,
    data: {
      tags: newTags,
    },
  });
});

exports.deleteTag = Factory.deleteOneByBody(Tags);

exports.tagverfification = Factory.toggleBooleanField(Tags, "Verification");
