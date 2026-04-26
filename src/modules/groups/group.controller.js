import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Task from "../tasks/tasks.model.js";
import Group from "./groups.model.js";

export const get = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const groups = await Group.find({ userId });
    new ApiResponse(
      200,
      groups,
      "Groups retrieved successfully",
      "groups",
    ).send(res);
  } catch (error) {
    next(new ApiError(500, "Error getting groups"));
  }
};

export const create = async (req, res, next) => {
  const { name, description, icon } = req.body;
  const userId = req.user._id;
  if (!name) {
    return next(new ApiError(400, "Name is required"));
  }
  if (!description) {
    return next(new ApiError(400, "Description is required"));
  }
  try {
    const newGroup = new Group({
      name,
      description,
      icon,
      userId,
    });
    await newGroup.save();
    new ApiResponse(201, newGroup, "Group created successfully", "group").send(
      res,
    );
  } catch (error) {
    next(new ApiError(500, "Error creating group"));
  }
};
export const remove = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return next(new ApiError(400, "groupId is required"));
  }
  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    const tasks = await Task.deleteMany({ groupId: id });

    if (!deletedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    new ApiResponse(200, {
      message: `Group deleted successfully with ${tasks.deletedCount} tasks`,
    }).send(res);
  } catch (error) {
    next(new ApiError(500, "Error deleting group"));
  }
};
export const edit = async (req, res, next) => {
  const { id, name, description, icon } = req.body;
  if (!id) {
    return next(new ApiError(400, "groupId is required"));
  }
  if (!name && !icon) {
    return next(new ApiError(400, "Some fields are missing"));
  }
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name, description, icon },
      { new: true },
    );
    if (!updatedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    new ApiResponse(
      200,
      updatedGroup,
      "Group updated successfully",
      "group",
    ).send(res);
  } catch (error) {
    next(new ApiError(500, "Error updating group"));
  }
};
