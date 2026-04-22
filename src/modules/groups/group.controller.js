import ApiError from "../../utils/ApiError.js";
import Task from "./groups.model.js";

export const create = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return next(new ApiError(400, "Name is required"));
  }
  if (!description) {
    return next(new ApiError(400, "Description is required"));
  }
  try {
    const newGroup = new Task({
      name,
      description,
    });
    await newGroup.save();
    res.status(201).json(newGroup);
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
    const deletedGroup = await Task.findByIdAndDelete(id);
    if (!deletedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    next(new ApiError(500, "Error deleting group"));
  }
};
export const edit = async (req, res, next) => {
  const { id, name, description } = req.body;
  if (!id) {
    return next(new ApiError(400, "groupId is required"));
  }
  if (!name && !description) {
    return next(new ApiError(400, "Some fields are missing"));
  }
  try {
    const updatedGroup = await Task.findByIdAndUpdate(
      id,
      { name, description },
      { new: true },
    );
    if (!updatedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    next(new ApiError(500, "Error updating group"));
  }
};
