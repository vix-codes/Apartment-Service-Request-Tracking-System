const Request = require("../models/Request");

// CREATE
const createRequest = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      const error = new Error("Title and description are required");
      error.statusCode = 400;
      throw error;
    }

    const request = await Request.create({ title, description });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// READ
const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find();

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: "Request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest,
};
