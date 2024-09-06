const fs = require("fs").promises;
const path = require("path");
const catchAsync = require("./catchAsync");
const AppError = require("./appError");

// This function for CRETE one
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log("get all");
    const doc = await Model.find();
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getOneBySlug = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    res.status(200).json({
      status: "success",
      result: doc,
    });
  });
};

// GET ONE BY SLUG
exports.getOneByID = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.slug });
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

exports.userDeatils = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.slug })
      .populate({
        path: "blogs",
        populate: {
          path: "comments", // Populate the comments within each blog
          select: "comment blog", // Select specific fields if needed
        },
      })
      .exec();
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for Update one
exports.updateOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      result: doc,
    });
  });
};

exports.createOneWithImg = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const {
      blogTitle,
      metaDescription,
      blogDescreption,
      alternativeText,
      title,
      caption,
      description,
    } = req.body;
    const image = req.files[0].filename;
    console.log(req.files);
    const id = req.params._id;
    // Create an object with the dynamically provided field name
    const updateObject = {
      blogTitle,
      metaDescription,
      blogDescreption,
      [fieldName]: {
        url: image,
        altText: req.files[0].originalname,
        alternativeText,
        title,
        caption,
        description,
      },
      user: req.user._id,
    };
    // Find and update the document based on the provided slug
    const data = await Model.create(updateObject);

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: "Blog Create Suces fully",
      data,
    });
  });
};

// Generic function to update a document's thumbnail image by slug for any model and field name
exports.updateImageByIdAndField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const { alternativeText, title, caption, description } = req.body;
    const image = req.files[0].filename;
    console.log(req.files);
    const id = req.params._id;
    // Create an object with the dynamically provided field name
    const updateObject = {
      [fieldName]: {
        url: image,
        altText: req.files[0].originalname,
        alternativeText,
        title,
        caption,
        description,
      },
    };
    // Find and update the document based on the provided slug
    const data = await Model.findByIdAndUpdate(id, updateObject, {
      new: true,
      upsert: true,
    });

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: `${fieldName} updated successfully`,
      data,
    });
  });
};

exports.deleteSingleImage = (Model, fieldName, imagePath) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // const { imageId } = req.body;

    const data = await Model.findById(id);
    if (!data) {
      return next(new AppError("There is no data", 404));
    }

    const deletedImage = data[fieldName];

    if (!deletedImage) {
      return next(new AppError("Image not found", 404));
    }

    // Remove the image field
    data[fieldName] = undefined;

    await data.save();

    const imagePathToDelete = path.resolve(
      `${__dirname}/../../client/public/${imagePath}/${deletedImage.url}`
    );

    try {
      await fs.unlink(imagePathToDelete);
      console.log(`Image deleted: ${deletedImage.url}`);
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
    }

    res.status(204).json({
      status: "success",
      message: "Delete Image",
    });
  });
};

// Generic function to update a document's thumbnail image by slug for any model and field name
exports.uplodsingleImg = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const image = req.files[0].filename;
    console.log(req.files);
    const id = req.body.id;
    // Create an object with the dynamically provided field name
    const updateObject = {
      [fieldName]: {
        url: image,
        altText: req.files[0].originalname,
      },
    };
    // Find and update the document based on the provided slug
    const data = await Model.findByIdAndUpdate(id, updateObject, {
      new: true,
      upsert: true,
    });

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: `${fieldName} updated successfully`,
      data,
    });
  });
};

// This function for Delete one
exports.deleteOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.body._id);

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// Togle Blooen filed
exports.toggleBooleanField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.body._id);

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    // Toggle the boolean field
    doc[fieldName] = !doc[fieldName];

    // Save the updated document
    await doc.save();

    res.status(200).json({
      status: "success",
      data: {
        [fieldName]: doc[fieldName],
      },
    });
  });
};
