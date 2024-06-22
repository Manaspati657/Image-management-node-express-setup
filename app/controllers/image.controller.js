const imageRepo = require("../repositories/image.repository");
const userRepo = require('../repositories/user.repository');
const _ = require("lodash");
const RequestHandler = require("../helper/RequestHandler");
const requestHandler = new RequestHandler();
const { default: mongoose } = require('mongoose');

exports.upload = async (req, res) => {
  try {
    if (
      !_.has(req.body, "title") ||
      (_.has(req.body, "title") && _.isUndefined(req.body.title)) ||
      _.isNull(req.body.title) ||
      _.isEmpty(req.body.title.trim())
    ) {
      requestHandler.throwError(400, "Bad Request", "title is required!")();
    }
    if (
      !_.has(req.body, "description") ||
      (_.has(req.body, "description") && _.isUndefined(req.body.description)) ||
      _.isNull(req.body.description) ||
      _.isEmpty(req.body.description.trim())
    ) {
      requestHandler.throwError(
        400,
        "Bad Request",
        "description is required!"
      )();
    }

    if (
      !_.has(req.body, "tags") ||
      (_.has(req.body, "tags") && _.isUndefined(req.body.tags)) ||
      _.isNull(req.body.tags) ||
      _.isEmpty(req.body.tags.trim())
    ) {
      requestHandler.throwError(400, "Bad Request", "tag is required!")();
    }
    if (_.isUndefined(req.file) || _.isNull(req.file)) {
      requestHandler.throwError(400, "Bad Request", "Image is required!")();
    }
    req.body.userId = req.userId;
    req.body.title = req.body.title.trim();
    req.body.tags = req.body.tags.trim();
    req.body.description = req.body.description.trim();
    req.body.image = req.file.filename;
    let savedImage = await imageRepo.save(req.body);
    if (!_.isEmpty(savedImage) && savedImage._id) {
      let imageData = await imageRepo.getImageDetails({ _id: savedImage._id });
      requestHandler.sendSuccess(
        res,
        "Image has been added successfully"
      )(imageData[0]);
    } else {
      requestHandler.throwError(400, "Bad Request", "Something went wrong!")();
    }
  } catch (err) {
    return requestHandler.sendError(req, res, err);
  }
};

exports.getAll = async (req, res) => {
  try {
    let pagination = {
      page: req.body.page,
      limit: req.body.perPage,
    };

    let allImages = await imageRepo.getAllImages(
      { isDeleted: false },
      pagination,
      req.body.search
    );
    if (!_.isEmpty(allImages)) {
      return requestHandler.sendSuccess(
        res,
        "All images fetched successfully."
      )(allImages.docs, {
        total: allImages.total,
        limit: allImages.limit,
        page: allImages.page,
        pages: allImages.pages,
      });
    } else {
      requestHandler.throwError(
        403,
        "Bad Request",
        "No images are available"
      )();
    }
  } catch (error) {
    return requestHandler.sendError(req, res, error);
  }
};

exports.remove = async (req, res) => {
  try {
    let userData = await userRepo.getByField({
      _id: req.userId,
      isDeleted: false,
    });
    if (!_.isEmpty(userData) && userData._id) {
      if (
        !_.has(req.body, "imageId") ||
        (_.has(req.body, "imageId") && _.isUndefined(req.body.imageId)) ||
        _.isNull(req.body.imageId) ||
        _.isEmpty(req.body.imageId)
      ) {
        requestHandler.throwError(400, "Bad Request", "Image id is required")();
      }
      if (!mongoose.isValidObjectId(req.body.imageId)) {
        requestHandler.throwError(
          400,
          "Bad Request",
          "Image id should be an object id"
        )();
      }
      let isImageAvailable = await imageRepo.getByField({
        _id: new mongoose.Types.ObjectId(req.body.imageId),
        isDeleted: false,
      });
      if (!_.isEmpty(isImageAvailable)) {
        let deleteTask = await imageRepo.updateById(
          { isDeleted: true },
          req.body.imageId
        );
        if (!_.isEmpty(deleteTask) && deleteTask._id) {
          requestHandler.sendSuccess(res, "Image deleted successfully!")({});
        } else {
          requestHandler.throwError(
            403,
            "Bad Request",
            "Something went wrong!"
          )();
        }
      } else {
        requestHandler.throwError(
          403,
          "Bad Request",
          "Image is not found, please enter a valid image id!"
        )();
      }
    } else {
      requestHandler.throwError(
        403,
        "Bad Request",
        "Oops,You are not a valid user to delete this image."
      )();
    }
  } catch (err) {
    return requestHandler.sendError(req, res, err);
  }
};

exports.userImages = async (req,res) => {
    try {
        let pagination = {
            page: req.body.page,
            limit: req.body.perPage,
          };
      
        let allImages = await imageRepo.getUserImages(
          { 
            isDeleted: false,
            userId: new mongoose.Types.ObjectId(req.userId)
         },
          pagination
        );
        console.log(req.userId);
        if (!_.isEmpty(allImages)) {
          return requestHandler.sendSuccess(
            res,
            "All images fetched successfully."
          )(allImages.docs, {
            total: allImages.total,
            limit: allImages.limit,
            page: allImages.page,
            pages: allImages.pages,
          });
        } else {
          requestHandler.throwError(
            403,
            "Bad Request",
            "No images are available"
          )();
        }
      } catch (error) {
        return requestHandler.sendError(req, res, error);
      }
}
